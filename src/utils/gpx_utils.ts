/**
 * GPX parsing utilities - no Leaflet dependency
 */

export function parseGPX(gpxText: string): [number, number][] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxText, "application/xml");
  const points = Array.from(xml.getElementsByTagName("trkpt"));
  return points.map((pt) => [
    parseFloat(pt.getAttribute("lat")!),
    parseFloat(pt.getAttribute("lon")!),
  ]);
}
