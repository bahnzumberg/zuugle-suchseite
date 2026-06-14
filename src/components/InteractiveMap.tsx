import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export interface InteractiveMapProps {
  gpxPositions: L.LatLngExpression[];
  anreiseGpxPositions: L.LatLngExpression[];
  abreiseGpxPositions: L.LatLngExpression[];
  scrollWheelZoom?: boolean;
  hoveredStop?: { lat: number; lon: number } | null;
}

export default function InteractiveMap({
  gpxPositions,
  anreiseGpxPositions,
  abreiseGpxPositions,
  scrollWheelZoom = false,
  hoveredStop,
}: InteractiveMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [poly, setPoly] = useState<L.Polyline | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startIcon = L.icon({
    iconUrl: "https://cdn.zuugle.at/img/startpunkt.svg",
    iconSize: [33, 45],
    iconAnchor: [16, 46],
  });
  const endIcon = L.icon({
    iconUrl: "https://cdn.zuugle.at/img/zielpunkt.svg",
    iconSize: [33, 45],
    iconAnchor: [16, 46],
  });
  const stopIcon = L.icon({
    iconUrl: "https://cdn.zuugle.at/img/stopsign.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const StartMarker = ({ position }: { position: L.LatLngExpression }) => {
    return <Marker position={position} icon={startIcon} zIndexOffset={1000} />;
  };

  const EndMarker = ({ position }: { position: L.LatLngExpression }) => {
    return <Marker position={position} icon={endIcon}></Marker>;
  };

  useEffect(() => {
    if (map && poly) {
      map.fitBounds(poly.getBounds());
    }
  }, [map]);

  // Invalidate map size after fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Leaflet needs to recalculate size after resize
      setTimeout(() => map?.invalidateSize(), 100);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [map]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  // Compare two LatLng positions rounded to 3 decimal places (~111 m).
  // When they match the tour is a round trip and zielpunkt is hidden.
  const isSamePosition = (
    a: L.LatLngExpression,
    b: L.LatLngExpression,
  ): boolean => {
    const toLatLng = (p: L.LatLngExpression): L.LatLng =>
      p instanceof L.LatLng
        ? p
        : Array.isArray(p)
          ? L.latLng(p[0] as number, p[1] as number)
          : L.latLng(p);
    const la = toLatLng(a);
    const lb = toLatLng(b);
    return (
      la.lat.toFixed(3) === lb.lat.toFixed(3) &&
      la.lng.toFixed(3) === lb.lng.toFixed(3)
    );
  };

  const getStartPosition = (): L.LatLngExpression | null => {
    if (anreiseGpxPositions.length > 0) return anreiseGpxPositions[0];
    if (gpxPositions.length > 0) return gpxPositions[0];
    return null;
  };

  const getEndPosition = (): L.LatLngExpression | null => {
    if (abreiseGpxPositions.length > 0)
      return abreiseGpxPositions[abreiseGpxPositions.length - 1];
    if (gpxPositions.length > 0) return gpxPositions[gpxPositions.length - 1];
    return null;
  };

  const startPos = getStartPosition();
  const endPos = getEndPosition();

  // Hide zielpunkt when start and end are at the same position (round trip)
  const isRoundTrip =
    startPos !== null && endPos !== null && isSamePosition(startPos, endPos);

  const getStartMarker = () => {
    if (startPos) return <StartMarker position={startPos} />;
  };
  const getEndMarker = () => {
    if (endPos && !isRoundTrip) return <EndMarker position={endPos} />;
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <MapContainer
        ref={setMap}
        scrollWheelZoom={scrollWheelZoom}
        maxZoom={15}
        center={[47.800499, 13.04441]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
          maxZoom={17}
          attribution='<a href="https://github.com/sletuffe/OpenTopoMap">&copy; OpenTopoMap-R</a> <a href="https://openmaps.fr/donate">❤️ Donation</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a>'
        />
        {!!gpxPositions && gpxPositions.length > 0 && (
          <Polyline
            ref={setPoly}
            pathOptions={{ weight: 5, color: "#001D47" }}
            positions={gpxPositions}
          />
        )}
        {getEndMarker()}
        {getStartMarker()}
        {!!anreiseGpxPositions && anreiseGpxPositions.length > 0 && (
          <Polyline
            pathOptions={{
              weight: 5,
              color: "#001D47",
              dashArray: "5,10",
              dashOffset: "1",
              lineCap: "square",
            }}
            positions={anreiseGpxPositions}
          />
        )}
        {!!abreiseGpxPositions && abreiseGpxPositions.length > 0 && (
          <Polyline
            pathOptions={{
              weight: 5,
              color: "#001D47",
              dashArray: "5,10",
              dashOffset: "0",
              lineCap: "square",
            }}
            positions={abreiseGpxPositions}
          />
        )}
        <ZoomControl position="bottomright" />
        {hoveredStop && (
          <Marker
            position={[hoveredStop.lat, hoveredStop.lon]}
            icon={stopIcon}
          />
        )}
      </MapContainer>
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Vollbild beenden" : "Vollbild"}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          width: "34px",
          height: "34px",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          backgroundColor: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          lineHeight: 1,
          padding: 0,
        }}
      >
        {isFullscreen ? "✕" : "⛶"}
      </button>
    </div>
  );
}
