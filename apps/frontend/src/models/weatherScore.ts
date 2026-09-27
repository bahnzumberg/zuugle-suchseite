/**
 * The weather score colour ramp, shared by the map overlay and the tour cards.
 *
 * These stops are the frontend copy of `COLOR_STOPS` in
 * `apps/backend/src/utils/weatherOverlayService.ts`, which is what the overlay
 * job bakes into the daily WebP tiles. Keep the two in sync or the map legend
 * will stop describing its own tiles.
 */
export const WEATHER_COLOR_STOPS: [number, string][] = [
  [0.0, "#3b0f70"], // dark violet — Gefährlich
  [0.15, "#7b1fa2"],
  [0.3, "#b52a8f"],
  [0.45, "#e04a5f"],
  [0.58, "#f07d1a"],
  [0.72, "#e3b41c"],
  [0.86, "#8cbf2f"],
  [1.0, "#2f9e44"], // green — Ausgezeichnet
];

/** CSS for a left-to-right bar spanning the full 0–100 range. */
export const WEATHER_GRADIENT_CSS = `linear-gradient(to right, ${WEATHER_COLOR_STOPS.map(
  ([position, hex]) => `${hex} ${position * 100}%`,
).join(", ")})`;

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const PARSED_STOPS = WEATHER_COLOR_STOPS.map(([position, hex]) => ({
  position,
  rgb: hexToRgb(hex),
}));

/** Linearly interpolates the ramp at `score` (0–100), clamping outside it. */
function scoreToRgb(score: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, score / 100));

  for (let i = 0; i < PARSED_STOPS.length - 1; i++) {
    const low = PARSED_STOPS[i];
    const high = PARSED_STOPS[i + 1];
    if (t > high.position) continue;

    const span = high.position - low.position;
    const ratio = span === 0 ? 0 : (t - low.position) / span;
    return [0, 1, 2].map((c) =>
      Math.round(low.rgb[c] + ratio * (high.rgb[c] - low.rgb[c])),
    ) as [number, number, number];
  }
  return PARSED_STOPS[PARSED_STOPS.length - 1].rgb;
}

/**
 * The ramp colour at `score`, for painting a shape — never for text.
 *
 * Measured against the card's white, the ramp's whole mid-to-high band falls
 * far below the 4.5:1 WCAG AA asks of small text (#e3b41c is 1.8:1, #8cbf2f
 * 2.0:1, #f07d1a 2.4:1, #2f9e44 3.2:1). The strip therefore spends it on the
 * score rule only and keeps the grade word near-black.
 */
export function scoreToColor(score: number): string {
  return `rgb(${scoreToRgb(score).join(", ")})`;
}
