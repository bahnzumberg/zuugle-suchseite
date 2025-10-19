import { useRef } from "react";
import { Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { t } from "i18next";
import { Typography } from "@mui/material";

interface ResizableCircleProps {
  center: L.LatLngExpression;
  initialRadius: number;
  onRadiusChange?: (radius: number) => void;
  onRemove?: (map: L.Map) => void;
}

export default function ResizableCircle({
  center,
  initialRadius,
  onRadiusChange,
  onRemove,
}: ResizableCircleProps) {
  const map = useMap();
  const circleRef = useRef<L.Circle | null>(null);
  const resizeMarkerRef = useRef<L.Marker | null>(null);
  const trashMarkerRef = useRef<L.Marker | null>(null);

  // Place handle at {radius} meters from center, so it appears on the right edge of the circle.
  const computeHandlePosition = (
    center: L.LatLngExpression,
    radius: number,
    angleDeg = 0,
  ) => {
    const c = L.latLng(center);
    const earthRadius = 6378137; // meters
    const dLat =
      (radius / earthRadius) *
      (180 / Math.PI) *
      Math.sin((angleDeg * Math.PI) / 180);
    const dLng =
      (((radius / earthRadius) * (180 / Math.PI)) /
        Math.cos((c.lat * Math.PI) / 180)) *
      Math.cos((angleDeg * Math.PI) / 180);
    return L.latLng(c.lat + dLat, c.lng + dLng);
  };

  const handleDrag = (e: L.LeafletEvent) => {
    const newPos = e.target.getLatLng();
    const newRadius = map.distance(L.latLng(center), newPos);
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius);
    }
    if (resizeMarkerRef.current) {
      const handlePos = computeHandlePosition(center, newRadius);
      resizeMarkerRef.current.setLatLng(handlePos);
    }
    if (trashMarkerRef.current) {
      const handlePos = computeHandlePosition(center, newRadius, 90);
      trashMarkerRef.current.setLatLng(handlePos);
    }
  };

  const handleDragEnd = (e: L.LeafletEvent) => {
    if (onRadiusChange) {
      const newPos = e.target.getLatLng();
      const newRadius = map.distance(L.latLng(center), newPos);
      onRadiusChange(newRadius);
    }
  };

  const trashSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
      viewBox="0 0 640 640">
      <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
  `;

  const resizeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M237.66,133.66l-32,32a8,8,0,0,1-11.32-11.32L212.69,136H43.31l18.35,18.34a8,8,0,0,1-11.32,11.32l-32-32a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,11.32L43.31,120H212.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,133.66Z"></path></svg>`;

  return (
    <>
      <Circle
        center={center}
        radius={initialRadius}
        pathOptions={{ color: "#4992ff", fillOpacity: 0.2 }}
        ref={circleRef}
        // Use eventHandlers to intercept the click
        eventHandlers={{
          mousedown: (e) => {
            e.originalEvent.preventDefault();
          },
        }}
      >
        <Popup className="area-search-popup">
          <Typography variant="blackP">
            {t("main.areaSearchTooltip")}
          </Typography>
        </Popup>
      </Circle>

      <Marker
        position={computeHandlePosition(center, initialRadius)}
        draggable={true}
        eventHandlers={{
          drag: handleDrag,
          dragend: handleDragEnd,
        }}
        ref={resizeMarkerRef}
        title="Drag to resize search area"
        icon={L.divIcon({
          className: "circle-marker",
          html: resizeSvg,
          iconSize: [12, 12],
          iconAnchor: [8, 0],
        })}
      />

      {onRemove && (
        <Marker
          position={computeHandlePosition(center, initialRadius, 90)}
          title="Remove search area"
          ref={trashMarkerRef}
          icon={L.divIcon({
            className: "circle-marker",
            html: trashSvg,
            iconSize: [24, 24],
            iconAnchor: [16, 16],
          })}
          eventHandlers={{
            click: () => onRemove(map),
          }}
        />
      )}
    </>
  );
}
