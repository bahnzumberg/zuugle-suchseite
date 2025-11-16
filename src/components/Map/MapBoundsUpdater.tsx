import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { getMarkersBounds, toLatLngBounds } from "../../utils/map_utils";
import L from "leaflet";
import { RootState } from "../..";
import { Marker } from "./TourMapContainer";
import { LocationWithRadius } from "../../features/searchSlice";

export interface MapBoundsUpdaterProps {
  isUserMoving: boolean;
  geolocation: LocationWithRadius | null;
  markers: Marker[];
  markersInvalidated: boolean;
}
export function MapBoundsUpdater({
  isUserMoving,
  geolocation,
  markers,
  markersInvalidated,
}: MapBoundsUpdaterProps) {
  const map = useMap();
  const bounds = useSelector((state: RootState) => state.search.bounds);

  useEffect(() => {
    // Skip if user is actively moving the map
    if (isUserMoving) return;

    // case 1: bounds are active and no geolocation search is active
    if (!geolocation && bounds) {
      const current = map.getBounds();
      const newBounds = toLatLngBounds(bounds);

      const latDiff = Math.abs(
        current.getCenter().lat - newBounds.getCenter().lat,
      );
      const lngDiff = Math.abs(
        current.getCenter().lng - newBounds.getCenter().lng,
      );
      const threshold = 0.0001;
      if (latDiff > threshold || lngDiff > threshold) {
        map.fitBounds(newBounds, { animate: true });
      }
    }
    // case 2: geolocation search is active and tours are loaded
    if (geolocation && !markersInvalidated) {
      const markerBounds = getMarkersBounds(markers);
      const circleSearchBounds = L.latLng(
        geolocation.lat,
        geolocation.lng,
      ).toBounds(geolocation.radius * 3);
      markerBounds.extend(circleSearchBounds);
      map.fitBounds(markerBounds, { animate: true });
    }
  }, [bounds, geolocation, markers]);

  return null;
}
