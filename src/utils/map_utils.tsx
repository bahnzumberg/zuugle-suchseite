import L from "leaflet";
import { Marker } from "../components/Map/TourMapContainer";
import { BoundsObject } from "../features/searchSlice";
import { useCallback, useRef } from "react";

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

export function toBoundsObject(bounds: L.LatLngBounds): BoundsObject {
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    west: bounds.getWest(),
    east: bounds.getEast(),
  };
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

export function getDefaultBoundsForDomain(domain: string): {
  ne: [number, number];
  sw: [number, number];
  center: [number, number];
} {
  const boundsDefinitions = {
    si: { ne: [46.876, 16.609], sw: [45.421, 13.383] },
    fr: { ne: [51.089, 9.559], sw: [42.331, -5.142] },
    it: { ne: [46.5, 12.5], sw: [44.0, 7.0] }, // North Italy only
    de: { ne: [55.058, 15.041], sw: [47.27, 5.866] },
    ch: { ne: [47.808, 10.491], sw: [45.817, 5.955] },
    at: { ne: [49.019, 17.189], sw: [46.372, 9.53] }, // default
  };

  const bounds =
    domain in boundsDefinitions
      ? // @ts-ignore
        boundsDefinitions[domain]
      : boundsDefinitions.at;
  const center: [number, number] = [
    (bounds.ne[0] + bounds.sw[0]) / 2,
    (bounds.ne[1] + bounds.sw[1]) / 2,
  ];

  return { ne: bounds.ne, sw: bounds.sw, center };
}

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}

export const getMarkersBounds = (markers: Marker[]) => {
  const _bounds = L.latLngBounds([]);
  if (markers.length > 0) {
    markers.forEach((marker) => {
      if (marker.lat && marker.lon) {
        _bounds.extend([marker.lat, marker.lon]);
      }
    });
  }
  return _bounds;
};
