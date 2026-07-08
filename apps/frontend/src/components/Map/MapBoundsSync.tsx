import { useMapEvents } from "react-leaflet";

export interface MapBoundsSyncProps {
  setIsUserMoving: (moving: boolean) => void;
  updateBounds: (bounds: L.LatLngBounds) => void;
}

export function MapBoundsSync({
  setIsUserMoving,
  updateBounds,
}: MapBoundsSyncProps) {
  const map = useMapEvents({
    movestart() {
      setIsUserMoving(true);
    },
    moveend() {
      updateBounds(map.getBounds());
      setIsUserMoving(false);
    },
  });
  return null;
}
