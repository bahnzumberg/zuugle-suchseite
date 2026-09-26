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
 * Computes a data-driven presence mask from the grid itself.
 * Cells with valid data get weight 1.0, cells without data get 0.0.
 * A separable Gaussian blur is then applied so that edges fade out
 * smoothly instead of appearing blocky.
 *
 * @param grid - The weather score grid (NaN = no data)
 * @param blurRadius - Blur kernel radius in grid cells (default 3 ≈ 30 km)
 */
export function computeDataPresenceMask(grid: Float32Array, blurRadius: number = 3): Float32Array {
    const { numLats, numLons } = GRID_CONFIG;
    const size = numLats * numLons;

    // Step 1: binary presence (1 where data exists, 0 where NaN)
    const presence = new Float32Array(size);
    for (let i = 0; i < size; i++) {
        presence[i] = isNaN(grid[i]) ? 0.0 : 1.0;
    }

    // Step 2: build 1D Gaussian kernel
    const kernelSize = blurRadius * 2 + 1;
    const kernel = new Float32Array(kernelSize);
    const sigma = blurRadius / 2;
    let kernelSum = 0;
    for (let k = 0; k < kernelSize; k++) {
        const x = k - blurRadius;
        kernel[k] = Math.exp(-(x * x) / (2 * sigma * sigma));
        kernelSum += kernel[k];
    }
    // normalise
    for (let k = 0; k < kernelSize; k++) {
        kernel[k] /= kernelSum;
    }

    // Step 3: separable 2-pass blur (horizontal then vertical)
    const tmp = new Float32Array(size);

    // horizontal pass
    for (let r = 0; r < numLats; r++) {
        const rowOff = r * numLons;
        for (let c = 0; c < numLons; c++) {
            let sum = 0;
            for (let k = 0; k < kernelSize; k++) {
                const cc = Math.min(numLons - 1, Math.max(0, c + k - blurRadius));
                sum += kernel[k] * presence[rowOff + cc];
            }
            tmp[rowOff + c] = sum;
        }
    }

    // vertical pass
    const result = new Float32Array(size);
    for (let c = 0; c < numLons; c++) {
        for (let r = 0; r < numLats; r++) {
            let sum = 0;
            for (let k = 0; k < kernelSize; k++) {
                const rr = Math.min(numLats - 1, Math.max(0, r + k - blurRadius));
                sum += kernel[k] * tmp[rr * numLons + c];
            }
            result[r * numLons + c] = sum;
        }
    }

    return result;
}

/**
 * Generates an RGBA buffer (2048 x 1544 x 4) by bilinearly interpolating the grid.
 * If presenceMask is provided, areas without data are smoothly feathered to transparent.
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
