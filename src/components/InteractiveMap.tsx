import { useEffect, useState } from "react";
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
}

export default function InteractiveMap({
  gpxPositions,
  anreiseGpxPositions,
  abreiseGpxPositions,
  scrollWheelZoom = false,
}: InteractiveMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [poly, setPoly] = useState<L.Polyline | null>(null);

  const startIcon = L.icon({
    iconUrl: "https://cdn.zuugle.at/img/startpunkt.png",
    iconSize: [33, 45],
    iconAnchor: [16, 46],
  });
  const endIcon = L.icon({
    iconUrl: "https://cdn.zuugle.at/img/zielpunkt.png",
    iconSize: [33, 45],
    iconAnchor: [16, 46],
  });

  const StartMarker = ({ position }: { position: L.LatLngExpression }) => {
    return <Marker position={position} icon={startIcon}></Marker>;
  };

  const EndMarker = ({ position }: { position: L.LatLngExpression }) => {
    return <Marker position={position} icon={endIcon}></Marker>;
  };

  useEffect(() => {
    if (map && poly) {
      map.fitBounds(poly.getBounds());
    }
  }, [map]);

  const getStartMarker = () => {
    if (anreiseGpxPositions.length > 0) {
      return <StartMarker position={anreiseGpxPositions[0]} />;
    } else if (gpxPositions.length > 0) {
      return <StartMarker position={gpxPositions[0]} />;
    }
  };
  const getEndMarker = () => {
    if (abreiseGpxPositions.length > 0) {
      return (
        <EndMarker
          position={abreiseGpxPositions[abreiseGpxPositions.length - 1]}
        />
      );
    } else if (gpxPositions.length > 0) {
      return <EndMarker position={gpxPositions[gpxPositions.length - 1]} />;
    }
  };

  return (
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
          pathOptions={{ weight: 5, color: "#FF7663" }}
          positions={gpxPositions}
        />
      )}
      {getStartMarker()}
      {getEndMarker()}
      {!!anreiseGpxPositions && anreiseGpxPositions.length > 0 && (
        <Polyline
          pathOptions={{
            weight: 5,
            color: "#FF7663",
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
            color: "#FF7663",
            dashArray: "5,10",
            dashOffset: "0",
            lineCap: "square",
          }}
          positions={abreiseGpxPositions}
        />
      )}
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}
