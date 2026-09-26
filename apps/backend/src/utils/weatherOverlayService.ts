import fs from "fs";
import path from "path";
import sharp from "sharp";
import logger from "./logger";

export const COLOR_STOPS: [number, string][] = [
    [0.0, "#3b0f70"], // dark violet — Gefährlich
    [0.15, "#7b1fa2"],
    [0.3, "#b52a8f"],
    [0.45, "#e04a5f"],
    [0.58, "#f07d1a"],
    [0.72, "#e3b41c"],
    [0.86, "#8cbf2f"],
    [1.0, "#2f9e44"], // green — Ausgezeichnet
];

export const GRID_CONFIG = {
    latMin: 42.6,
    latMax: 49.3,
    lonMin: 4.4,
    lonMax: 17.3,
    deltaLat: 0.1,
    deltaLon: 0.1,
    numLats: 68, // (49.3 - 42.6) / 0.1 + 1 = 68
    numLons: 130, // (17.3 - 4.4) / 0.1 + 1 = 130
    boundsLatMin: 42.55,
    boundsLatMax: 49.35,
    boundsLonMin: 4.35,
    boundsLonMax: 17.35,
    width: 2048,
    height: 1544,
    alpha: 200, // ~78% opacity baked into WebP
} as const;

export interface WeatherDay {
    date: string; // YYYY-MM-DD
    file: string; // "weather_overlay_YYYY-MM-DD.webp"
}

export interface WeatherMetadata {
    version: "1.0";
    generated_at: string;
    bounds: [[number, number], [number, number]];
    days: WeatherDay[];
    legend: { score: number; color: string; label: string }[];
}

export interface WeatherRow {
    weather_date: string;
    lat: number | string;
    lon: number | string;
    weather_score_min: number | string | null;
}

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
}

const parsedStops = COLOR_STOPS.map(([pos, hex]) => ({
    pos,
    rgb: hexToRgb(hex),
}));

/**
 * Precomputed lookup table for scores from 0.0 to 100.0 with 0.1 resolution.
 * Index 0..1000 -> Uint8ClampedArray of 4 bytes [R, G, B, A].
 */
const COLOR_LUT: Uint8Array = (() => {
    const lut = new Uint8Array(1001 * 4);
    for (let i = 0; i <= 1000; i++) {
        const t = i / 1000;
        let r = parsedStops[0].rgb[0];
        let g = parsedStops[0].rgb[1];
        let b = parsedStops[0].rgb[2];

        for (let s = 0; s < parsedStops.length - 1; s++) {
            const s0 = parsedStops[s];
            const s1 = parsedStops[s + 1];
            if (t >= s0.pos && t <= s1.pos) {
                const segmentFactor = (t - s0.pos) / (s1.pos - s0.pos || 1);
                r = Math.round(s0.rgb[0] + segmentFactor * (s1.rgb[0] - s0.rgb[0]));
                g = Math.round(s0.rgb[1] + segmentFactor * (s1.rgb[1] - s0.rgb[1]));
                b = Math.round(s0.rgb[2] + segmentFactor * (s1.rgb[2] - s0.rgb[2]));
                break;
            }
        }

        const offset = i * 4;
        lut[offset] = r;
        lut[offset + 1] = g;
        lut[offset + 2] = b;
        lut[offset + 3] = GRID_CONFIG.alpha;
    }
    return lut;
})();

/**
 * Precompute 1D coordinate transformations:
 * X -> longitude -> fractional grid column (0..124)
 * Y -> Web Mercator -> latitude -> fractional grid row (0..64)
 */
interface ProjectionArrays {
    colIndex: Int32Array;
    colFrac: Float32Array;
    rowIndex: Int32Array;
    rowFrac: Float32Array;
}

const PROJECTION: ProjectionArrays = (() => {
    const {
        width,
        height,
        boundsLonMin,
        boundsLonMax,
        boundsLatMin,
        boundsLatMax,
        lonMin,
        latMax,
        deltaLon,
        deltaLat,
    } = GRID_CONFIG;

    const colIndex = new Int32Array(width);
    const colFrac = new Float32Array(width);

    for (let px = 0; px < width; px++) {
        const lon = boundsLonMin + ((px + 0.5) / width) * (boundsLonMax - boundsLonMin);
        const gCol = (lon - lonMin) / deltaLon;
        const c0 = Math.max(0, Math.min(GRID_CONFIG.numLons - 1, Math.floor(gCol)));
        colIndex[px] = c0;
        colFrac[px] = Math.max(0, Math.min(1, gCol - c0));
    }

    const rowIndex = new Int32Array(height);
    const rowFrac = new Float32Array(height);

    const yTop = Math.log(Math.tan(Math.PI / 4 + (boundsLatMax * Math.PI) / 360));
    const yBottom = Math.log(Math.tan(Math.PI / 4 + (boundsLatMin * Math.PI) / 360));

    for (let py = 0; py < height; py++) {
        const yMerc = yTop - ((py + 0.5) / height) * (yTop - yBottom);
        const lat = (2 * Math.atan(Math.exp(yMerc)) - Math.PI / 2) * (180 / Math.PI);
        const gRow = (latMax - lat) / deltaLat; // latMax is row 0 (North at top)
        const r0 = Math.max(0, Math.min(GRID_CONFIG.numLats - 1, Math.floor(gRow)));
        rowIndex[py] = r0;
        rowFrac[py] = Math.max(0, Math.min(1, gRow - r0));
    }

    return { colIndex, colFrac, rowIndex, rowFrac };
})();

/**
 * Creates a 65 x 125 Float32Array grid from database rows for one day.
 */
export function buildGridFromRows(rows: WeatherRow[]): Float32Array {
    const { numLats, numLons, latMax, lonMin, deltaLat, deltaLon } = GRID_CONFIG;
    const grid = new Float32Array(numLats * numLons);
    grid.fill(NaN);

    for (const row of rows) {
        const lat = typeof row.lat === "number" ? row.lat : parseFloat(row.lat);
        const lon = typeof row.lon === "number" ? row.lon : parseFloat(row.lon);
        const score =
            row.weather_score_min !== null
                ? typeof row.weather_score_min === "number"
                    ? row.weather_score_min
                    : parseFloat(row.weather_score_min)
                : NaN;

        if (isNaN(lat) || isNaN(lon)) continue;

        const r = Math.round((latMax - lat) / deltaLat);
        const c = Math.round((lon - lonMin) / deltaLon);

        if (r >= 0 && r < numLats && c >= 0 && c < numLons) {
            grid[r * numLons + c] = score;
        }
    }

    return grid;
}

/**
 * Geographic boundary loaded from weather-outline.json, covering the Alpine arc
 * and surrounding regions.
 */
export const DEFAULT_OUTLINE_POLYGON: [number, number][] = [
    [46.22925, 15.27237],
    [46.08419, 14.17168],
    [45.81157, 13.76037],
    [45.71865, 13.64227],
    [45.6772806, 13.4255155],
    [45.6937215, 13.2019405],
    [45.7142659, 12.760674],
    [45.7163199, 12.4488456],
    [45.7430153, 12.2546884],
    [45.73686, 12.06436],
    [45.6896118, 11.8546067],
    [45.6608349, 11.6986926],
    [45.55806, 11.58302],
    [45.39411, 11.37703],
    [45.36686, 11.07628],
    [45.38784, 10.96092],
    [45.41195, 10.67322],
    [45.44279, 10.35805],
    [45.4259426, 10.2212549],
    [45.4352528, 10.1151211],
    [45.4095674, 10.0031865],
    [45.317172, 9.841336],
    [45.1604668, 9.5075194],
    [44.8959425, 9.0927776],
    [44.6949493, 9.052315],
    [44.3342918, 8.9106959],
    [44.17236, 8.78082],
    [43.6639, 8.456723],
    [43.43298, 7.723386],
    [42.70464, 6.660459],
    [42.69859, 5.96008],
    [43.00264, 4.842221],
    [43.9204199, 4.4294614],
    [44.4066018, 4.439577],
    [44.7811749, 4.5508492],
    [45.1247917, 4.7126997],
    [45.4095674, 5.0060536],
    [45.671713, 5.3095232],
    [46.38839, 5.824127],
    [46.5830642, 5.8658506],
    [46.8466164, 6.0681678],
    [47.2875849, 6.5233722],
    [47.7453178, 7.2618149],
    [47.9150911, 9.1635578],
    [48.0369841, 10.4583614],
    [48.3539042, 11.0653006],
    [48.6220802, 12.4207982],
    [49.0879789, 13.9887245],
    [49.2136893, 14.9497116],
    [49.1012291, 15.8702478],
    [48.9752306, 16.3153248],
    [48.9486671, 16.7098471],
    [48.595329, 17.2358611],
    [48.1315935, 17.2763237],
    [47.8540393, 17.2763237],
    [47.7317146, 17.2560924],
    [47.5005, 16.76239],
    [47.33138, 16.52756],
    [46.8050912, 16.3153366],
    [46.42011, 15.64419],
    [46.3827, 15.6023],
    [46.2606, 15.43922],
    [46.24374, 15.36335],
    [46.22925, 15.27237],
];

/** Backwards-compatible alias for existing callers. */
export const ALPS_POLYGON = DEFAULT_OUTLINE_POLYGON;

/**
 * Loads outline polygon from weather-outline.json if available on disk,
 * otherwise falls back to DEFAULT_OUTLINE_POLYGON.
 */
export function loadOutlinePolygon(customPath?: string): [number, number][] {
    const candidatePaths = [
        customPath,
        path.join(__dirname, "../../public/weather/weather-outline.json"),
        path.join(__dirname, "../../../../assets/public/weather/weather-outline.json"),
        path.join(__dirname, "../../../assets/public/weather/weather-outline.json"),
    ].filter(Boolean) as string[];

    for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
            try {
                const raw = fs.readFileSync(p, "utf-8");
                const geojson = JSON.parse(raw);
                const feature =
                    geojson.type === "FeatureCollection" ? geojson.features?.[0] : geojson;
                const ring = feature?.geometry?.coordinates?.[0];
                if (Array.isArray(ring) && ring.length >= 3) {
                    return ring.map(([lon, lat]: [number, number]) => [lat, lon]);
                }
            } catch (err) {
                logger.warn(`[WeatherOverlay] Failed to parse outline from ${p}:`, err);
            }
        }
    }
    return DEFAULT_OUTLINE_POLYGON;
}

function distanceToSegment(
    lat: number,
    lon: number,
    aLat: number,
    aLon: number,
    bLat: number,
    bLon: number,
): number {
    const dLat = bLat - aLat;
    const dLon = bLon - aLon;
    const lenSq = dLat * dLat + dLon * dLon;
    if (lenSq === 0) {
        return Math.hypot(lat - aLat, lon - aLon);
    }
    const t = Math.max(0, Math.min(1, ((lat - aLat) * dLat + (lon - aLon) * dLon) / lenSq));
    const projLat = aLat + t * dLat;
    const projLon = aLon + t * dLon;
    return Math.hypot(lat - projLat, lon - projLon);
}

function pointInPolygon(lat: number, lon: number, poly: [number, number][]): boolean {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0],
            yi = poly[i][1];
        const xj = poly[j][0],
            yj = poly[j][1];
        const intersect = yi > lon !== yj > lon && lat < ((xj - xi) * (lon - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Computes a grid containing mask weights (0.0 to 1.0) for the outline polygon,
 * strictly masking out anything outside the GeoJSON outline, with a smooth ~15 km
 * feathering falloff inside the border.
 */
export function computeAlpsMaskGrid(
    outlinePoly: [number, number][] = loadOutlinePolygon(),
): Float32Array {
    const { numLats, numLons, latMax, lonMin, deltaLat, deltaLon } = GRID_CONFIG;
    const mask = new Float32Array(numLats * numLons);
    const fadeDist = 0.15; // ~15 km feathering distance inside the boundary

    for (let r = 0; r < numLats; r++) {
        const lat = latMax - r * deltaLat;
        for (let c = 0; c < numLons; c++) {
            const lon = lonMin + c * deltaLon;
            const inside = pointInPolygon(lat, lon, outlinePoly);

            if (!inside) {
                mask[r * numLons + c] = 0.0;
                continue;
            }

            let minDist = Infinity;
            for (let i = 0; i < outlinePoly.length - 1; i++) {
                const p1 = outlinePoly[i];
                const p2 = outlinePoly[i + 1];
                const d = distanceToSegment(lat, lon, p1[0], p1[1], p2[0], p2[1]);
                if (d < minDist) minDist = d;
            }

            if (minDist >= fadeDist) {
                mask[r * numLons + c] = 1.0;
            } else {
                const t = minDist / fadeDist;
                mask[r * numLons + c] = t * t * (3 - 2 * t); // smoothstep inward
            }
        }
    }
    return mask;
}

/**
 * Generates an RGBA buffer (2048 x 1400 x 4) by bilinearly interpolating the 65 x 125 grid.
 * If alpsMask is provided, areas outside the Alpine arc are smoothly feathered to transparent.
 */
export function interpolateGridToRgba(grid: Float32Array, alpsMask?: Float32Array): Buffer {
    const { width, height, numLats, numLons } = GRID_CONFIG;
    const { colIndex, colFrac, rowIndex, rowFrac } = PROJECTION;
    const rgba = Buffer.alloc(width * height * 4);

    let pixelOffset = 0;

    for (let py = 0; py < height; py++) {
        const r0 = rowIndex[py];
        const r1 = Math.min(numLats - 1, r0 + 1);
        const dr = rowFrac[py];
        const invDr = 1 - dr;

        const r0Offset = r0 * numLons;
        const r1Offset = r1 * numLons;

        for (let px = 0; px < width; px++) {
            const c0 = colIndex[px];
            const c1 = Math.min(numLons - 1, c0 + 1);
            const dc = colFrac[px];
            const invDc = 1 - dc;

            // Optional Alpine mask interpolation
            let maskWeight = 1.0;
            if (alpsMask) {
                const m00 = alpsMask[r0Offset + c0];
                const m01 = alpsMask[r0Offset + c1];
                const m10 = alpsMask[r1Offset + c0];
                const m11 = alpsMask[r1Offset + c1];
                maskWeight =
                    invDr * invDc * m00 + invDr * dc * m01 + dr * invDc * m10 + dr * dc * m11;
            }

            if (maskWeight > 0.005) {
                const v00 = grid[r0Offset + c0];
                const v01 = grid[r0Offset + c1];
                const v10 = grid[r1Offset + c0];
                const v11 = grid[r1Offset + c1];

                let score = NaN;

                // Fast path: all 4 corners valid
                if (!isNaN(v00) && !isNaN(v01) && !isNaN(v10) && !isNaN(v11)) {
                    score =
                        invDr * invDc * v00 + invDr * dc * v01 + dr * invDc * v10 + dr * dc * v11;
                } else {
                    // Fallback: partial coverage at borders
                    let sumWeight = 0;
                    let sumValue = 0;

                    if (!isNaN(v00)) {
                        const w = invDr * invDc;
                        sumWeight += w;
                        sumValue += w * v00;
                    }
                    if (!isNaN(v01)) {
                        const w = invDr * dc;
                        sumWeight += w;
                        sumValue += w * v01;
                    }
                    if (!isNaN(v10)) {
                        const w = dr * invDc;
                        sumWeight += w;
                        sumValue += w * v10;
                    }
                    if (!isNaN(v11)) {
                        const w = dr * dc;
                        sumWeight += w;
                        sumValue += w * v11;
                    }

                    if (sumWeight > 0.0001) {
                        score = sumValue / sumWeight;
                    }
                }

                if (!isNaN(score)) {
                    const clamped = Math.max(0, Math.min(100, score));
                    const lutIndex = Math.round(clamped * 10) * 4;
                    rgba[pixelOffset] = COLOR_LUT[lutIndex];
                    rgba[pixelOffset + 1] = COLOR_LUT[lutIndex + 1];
                    rgba[pixelOffset + 2] = COLOR_LUT[lutIndex + 2];
                    rgba[pixelOffset + 3] = Math.round(
                        COLOR_LUT[lutIndex + 3] * Math.min(1, maskWeight),
                    );
                }
            }
            // else: buffer already zero-filled (transparent RGBA 0,0,0,0)

            pixelOffset += 4;
        }
    }

    return rgba;
}

/**
 * Writes via a temp file and a rename, which is atomic within a directory.
 * nginx serves this folder straight to clients while the job rewrites it, and
 * the job shares a process with the GPX pipeline, which can `process.exit()`
 * mid-write — so a plain write can publish a truncated file under a 6 h cache
 * header. A reader here sees either the old file or the new one.
 */
export async function writeWeatherFile(
    targetFilePath: string,
    contents: Buffer | string,
): Promise<void> {
    await fs.promises.mkdir(path.dirname(targetFilePath), { recursive: true });
    const tmpPath = `${targetFilePath}.tmp`;
    await fs.promises.writeFile(tmpPath, contents);
    await fs.promises.rename(tmpPath, targetFilePath);
}

/**
 * Encodes RGBA buffer to WebP and writes it to disk.
 */
export async function saveRgbaAsWebp(rgbaBuffer: Buffer, targetFilePath: string): Promise<void> {
    const webp = await sharp(rgbaBuffer, {
        raw: {
            width: GRID_CONFIG.width,
            height: GRID_CONFIG.height,
            channels: 4,
        },
    })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

    await writeWeatherFile(targetFilePath, webp);
}

/**
 * Immediately deletes expired overlays (where date < todayStr) and strips them from metadata.
 * "Ungültig ist ungültig." — executes immediately upon script startup.
 */
export async function cleanupOldWeatherOverlays(
    weatherDir: string,
    todayStr: string,
): Promise<number> {
    if (!fs.existsSync(weatherDir)) {
        return 0;
    }

    let deletedCount = 0;
    const files = fs.readdirSync(weatherDir);
    const overlayRegex = /^weather_overlay_(\d{4}-\d{2}-\d{2})\.webp$/;

    for (const file of files) {
        const match = file.match(overlayRegex);
        if (match) {
            const fileDate = match[1];
            if (fileDate < todayStr) {
                const fullPath = path.join(weatherDir, file);
                try {
                    fs.unlinkSync(fullPath);
                    deletedCount++;
                    logger.info(`[WeatherOverlay] Deleted expired overlay: ${file}`);
                } catch (err) {
                    logger.error(`[WeatherOverlay] Failed to delete ${file}:`, err);
                }
            }
        }
    }

    // Also sanitize weather_metadata.json if it exists
    const metadataPath = path.join(weatherDir, "weather_metadata.json");
    if (fs.existsSync(metadataPath)) {
        try {
            const raw = fs.readFileSync(metadataPath, "utf-8");
            const data = JSON.parse(raw) as WeatherMetadata;
            if (Array.isArray(data.days)) {
                const filteredDays = data.days.filter((d) => d.date >= todayStr);
                if (filteredDays.length !== data.days.length) {
                    data.days = filteredDays;
                    await writeWeatherFile(metadataPath, JSON.stringify(data, null, 2));
                    logger.info(`[WeatherOverlay] Cleaned expired days from ${metadataPath}`);
                }
            }
        } catch (err) {
            logger.warn(`[WeatherOverlay] Could not sanitize existing weather_metadata.json:`, err);
        }
    }

    return deletedCount;
}
