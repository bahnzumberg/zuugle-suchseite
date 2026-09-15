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
    latMin: 43.7,
    latMax: 50.1,
    lonMin: 4.8,
    lonMax: 17.2,
    deltaLat: 0.1,
    deltaLon: 0.1,
    numLats: 65, // (50.1 - 43.7) / 0.1 + 1 = 65
    numLons: 125, // (17.2 - 4.8) / 0.1 + 1 = 125
    boundsLatMin: 43.65,
    boundsLatMax: 50.15,
    boundsLonMin: 4.75,
    boundsLonMax: 17.25,
    width: 2048,
    height: 1400,
    alpha: 200, // ~78% opacity baked into WebP
} as const;

export interface WeatherDay {
    date: string; // YYYY-MM-DD
    weekday: string; // Mo, Di, Mi...
    label: string; // "Heute (Mo)", "Morgen (Di)", etc.
    file: string; // "weather_overlay_YYYY-MM-DD.webp"
}

export interface WeatherMetadata {
    version: "1.0";
    generated_at: string;
    bounds: [[number, number], [number, number]];
    minZoom: number;
    maxZoom: number;
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
 * Geographic boundary of the Alpine arc including generous buffer (~40-60 km)
 * covering all Alpine valleys, foothills, and approach areas.
 */
export const ALPS_POLYGON: [number, number][] = [
    [43.5, 6.2], // South of Maritime Alps / Verdon
    [44.0, 5.14], // Digne / Sisteron approach (+20 km W)
    [45.0, 4.74], // Vercors / Valence outskirts (+20 km W)
    [45.98, 4.94], // Chartreuse / Chambéry / Lyon east (+20 km N+W)
    [46.58, 5.54], // Jura foothills / Geneva (+20 km N+W)
    [47.38, 6.34], // Swiss Jura (+20 km N+W)
    [47.98, 7.24], // Basel / Black Forest south (+20 km N+W)
    [48.28, 8.8], // Lake Constance north / Hegau (+20 km N)
    [48.38, 10.2], // Allgäu foothills / Memmingen (+20 km N)
    [48.48, 11.6], // Munich south / Starnberg / Rosenheim (+20 km N)
    [48.48, 12.8], // Chiemgau / Traunstein / Salzburg foothills (+20 km N)
    [48.58, 14.2], // Upper Austrian Prealps / Linz south (+20 km N)
    [48.68, 15.2], // Mostviertel / Eisenwurzen / Wachau (+20 km N)
    [48.68, 16.86], // Vienna Woods / Vienna / Danube basin (+20 km N+E)
    [48.18, 17.06], // Leithagebirge / Neusiedler See (+20 km N+E)
    [46.8, 16.66], // Styrian hill country / Koralpe east (+20 km E)
    [46.4, 16.46], // Pohorje / Maribor / Drau (+20 km E)
    [45.9, 15.5], // Lower Carniola / Sava valley (south — unchanged)
    [45.6, 14.0], // Postojna / Notranjska / Karst (south — unchanged)
    [45.7, 13.0], // Friuli lowlands / Udine south (south — unchanged)
    [45.4, 11.8], // Veneto foothills / Vicenza / Bassano (south — unchanged)
    [45.2, 10.5], // Lake Garda south / Verona / Brescia (south — unchanged)
    [45.3, 9.3], // Bergamo / Como / Milan north (south — unchanged)
    [44.8, 7.5], // Piedmont / Turin outskirts / Po valley west (south — unchanged)
    [44.0, 7.6], // Ligurian Alps / Cuneo / Imperia (south — unchanged)
    [43.5, 6.2], // Closing polygon
];

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
 * Computes a 65 x 125 grid containing mask weights (0.0 to 1.0) for the Alpine arc,
 * with a smooth ~45 km feathering falloff at the borders.
 */
export function computeAlpsMaskGrid(): Float32Array {
    const { numLats, numLons, latMax, lonMin, deltaLat, deltaLon } = GRID_CONFIG;
    const mask = new Float32Array(numLats * numLons);
    const fadeDist = 0.45; // ~45 km feathering distance

    for (let r = 0; r < numLats; r++) {
        const lat = latMax - r * deltaLat;
        for (let c = 0; c < numLons; c++) {
            const lon = lonMin + c * deltaLon;
            const inside = pointInPolygon(lat, lon, ALPS_POLYGON);

            let minDist = Infinity;
            for (let i = 0; i < ALPS_POLYGON.length - 1; i++) {
                const p1 = ALPS_POLYGON[i];
                const p2 = ALPS_POLYGON[i + 1];
                const d = distanceToSegment(lat, lon, p1[0], p1[1], p2[0], p2[1]);
                if (d < minDist) minDist = d;
            }

            const signedDist = inside ? minDist : -minDist;

            if (signedDist >= 0) {
                mask[r * numLons + c] = 1.0;
            } else if (signedDist <= -fadeDist) {
                mask[r * numLons + c] = 0.0;
            } else {
                const t = (signedDist + fadeDist) / fadeDist;
                mask[r * numLons + c] = t * t * (3 - 2 * t); // smoothstep
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
 * Encodes RGBA buffer to WebP and writes it to disk.
 */
export async function saveRgbaAsWebp(rgbaBuffer: Buffer, targetFilePath: string): Promise<void> {
    await fs.promises.mkdir(path.dirname(targetFilePath), { recursive: true });
    await sharp(rgbaBuffer, {
        raw: {
            width: GRID_CONFIG.width,
            height: GRID_CONFIG.height,
            channels: 4,
        },
    })
        .webp({ quality: 85, effort: 4 })
        .toFile(targetFilePath);
}

/**
 * German weekday names and labels for the UI button bar.
 */
export function formatDayLabel(
    dateStr: string,
    dayIndex: number,
): { weekday: string; label: string } {
    const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    const weekday = weekdays[dateObj.getUTCDay()];

    if (dayIndex === 0) {
        return { weekday, label: `Heute (${weekday})` };
    }
    if (dayIndex === 1) {
        return { weekday, label: `Morgen (${weekday})` };
    }

    const dayPad = String(day).padStart(2, "0");
    const monthPad = String(month).padStart(2, "0");
    return { weekday, label: `${weekday}, ${dayPad}.${monthPad}.` };
}

/**
 * Immediately deletes expired overlays (where date < todayStr) and strips them from metadata.
 * "Ungültig ist ungültig." — executes immediately upon script startup.
 */
export function cleanupOldWeatherOverlays(weatherDir: string, todayStr: string): number {
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
                    fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2), "utf-8");
                    logger.info(`[WeatherOverlay] Cleaned expired days from ${metadataPath}`);
                }
            }
        } catch (err) {
            logger.warn(`[WeatherOverlay] Could not sanitize existing weather_metadata.json:`, err);
        }
    }

    return deletedCount;
}
