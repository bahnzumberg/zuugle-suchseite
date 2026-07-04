import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { getMarkersBounds, toLatLngBounds } from "../../utils/map_utils";
import L from "leaflet";
import { RootState } from "../..";
import { Marker } from "../../models/mapTypes";
import { LocationWithRadius } from "../../features/searchSlice";
import { PoiResult } from "../../features/apiSlice";

export interface MapBoundsUpdaterProps {
  isUserMoving: boolean;
  geolocation: LocationWithRadius | null;
  markers: Marker[];
  pois: PoiResult[];
  markersInvalidated: boolean;
}
export function MapBoundsUpdater({
  isUserMoving,
  geolocation,
  markers,
  pois,
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
    // case 3: poi search is active and tours are loaded
    if (pois.length > 0 && !markersInvalidated) {
      const markerBounds = getMarkersBounds(markers);
      const poiBounds = getMarkersBounds(pois);
      markerBounds.extend(poiBounds);
      map.fitBounds(markerBounds, { animate: true });
    }
    // case 4: map was just opened with no bounds/geolocation/poi search yet - fit to all tour markers
    if (
      !geolocation &&
      !bounds &&
      pois.length === 0 &&
      markers.length > 0 &&
      !markersInvalidated
    ) {
      map.fitBounds(getMarkersBounds(markers), { animate: true });
    }
  }, [bounds, geolocation, markers, pois, markersInvalidated]);

  return null;
}
