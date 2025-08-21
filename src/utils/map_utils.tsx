import L from "leaflet";
import { Marker } from "../components/Map/TourMapContainer";
import { BoundsObject } from "../features/searchSlice";

export const formatMapClusterNumber = (number: number) => {
  // Absolute numbers
  number = Math.abs(number);

  if (number < 1000) {
    return number.toString();
  } else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

export const createIdArray = (markers: Marker[]) => {
  return markers.map((marker) => marker.id);
};

export function toLatLngBounds(bounds: BoundsObject): L.LatLngBounds {
  return L.latLngBounds(
    [bounds.south, bounds.west],
    [bounds.north, bounds.east],
  );
}

//returns a list of markers that are contained within the passed bounds object
export const getMarkersListFromBounds = (
  bounds: L.LatLngBounds,
  markersList: Marker[],
) => {
  // markersList is an array of objects {id: 72869, lat: 47.79043, lon: 15.91079}
  if (bounds && markersList) {
    return markersList.filter((marker) =>
      bounds.contains(L.latLng(marker.lat, marker.lon)),
    );
  }
  return [];
};

export function parseGPX(gpxText: string): L.LatLngExpression[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxText, "application/xml");
  const points = Array.from(xml.getElementsByTagName("trkpt"));
  return points.map((pt) => [
    parseFloat(pt.getAttribute("lat")!),
    parseFloat(pt.getAttribute("lon")!),
  ]);
}
