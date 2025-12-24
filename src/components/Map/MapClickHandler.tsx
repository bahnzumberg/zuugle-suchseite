import { Button } from "@mui/material";
import { MapPinAreaIcon } from "@phosphor-icons/react";
import { t } from "i18next";
import { Popup, useMapEvents } from "react-leaflet";

export interface ClickHandlerProps {
  clickPosition: L.LatLng | null;
  setClickPosition: (position: L.LatLng | null) => void;
  handlePoiSearch: (position: L.LatLng, radius: number) => void;
}
export function MapClickHandler({
  handlePoiSearch,
  clickPosition,
  setClickPosition,
}: ClickHandlerProps) {
  const map = useMapEvents({
    click(e) {
      setClickPosition(e.latlng);
    },
  });

  if (!clickPosition) return null;

  return (
    <Popup
      position={clickPosition}
      className="area-search"
      autoPan={false}
      key={`clickPosition_${clickPosition.lat}_${clickPosition.lng}`}
    >
      <Button
        startIcon={<MapPinAreaIcon />}
        onClick={(e) => {
          const bounds = map.getBounds();
          const width = map.distance(
            bounds.getNorthWest(),
            bounds.getNorthEast(),
          );
          const height = map.distance(
            bounds.getSouthWest(),
            bounds.getNorthWest(),
          );
          const radius = Math.min(height, width) / 8;
          handlePoiSearch(clickPosition, radius);
          e.stopPropagation();
        }}
      >
        {t("main.areaSearchTrigger")}
      </Button>
    </Popup>
  );
}
