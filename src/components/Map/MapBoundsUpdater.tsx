import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { getMarkersBounds, toLatLngBounds } from "../../utils/map_utils";
import L from "leaflet";
import { RootState } from "../..";
import { Marker } from "./TourMapContainer";
import { PoiWithRadius } from "../../features/searchSlice";

export interface MapBoundsUpdaterProps {
  isUserMoving: boolean;
  poi: PoiWithRadius | null;
  markers: Marker[];
  markersInvalidated: boolean;
}
export function MapBoundsUpdater({
  isUserMoving,
  poi,
  markers,
  markersInvalidated,
}: MapBoundsUpdaterProps) {
  const map = useMap();
  const bounds = useSelector((state: RootState) => state.search.bounds);

  useEffect(() => {
    // Skip if user is actively moving the map
    if (isUserMoving) return;

    // case 1: bounds are active and no poi search is active
    if (!poi && bounds) {
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
    // case 2: poi search is active and tours are loaded
    if (poi && !markersInvalidated) {
      const markerBounds = getMarkersBounds(markers);
      const poiBounds = L.latLng(poi.lat, poi.lng).toBounds(poi.radius * 3);
      markerBounds.extend(poiBounds);
      map.fitBounds(markerBounds, { animate: true });
    }
  }, [bounds, poi, markers]);

  return null;
}
