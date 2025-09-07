import * as React from "react";
import { useRef, useEffect } from "react";
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
  const polyRef: React.Ref<L.Polyline> = useRef(null);
  const mapRef: React.Ref<L.Map> = useRef(null);

  const startIcon = L.icon({
    iconUrl: "/app_static/img/startpunkt.png",
    iconSize: [33, 45],
    iconAnchor: [16, 46],
  });
  const endIcon = L.icon({
    iconUrl: "/app_static/img/zielpunkt.png",
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
    let map = mapRef.current;
    const initializeMap = () => {
      if (
        mapRef.current?._leaflet_id !== null &&
        mapRef.current?._leaflet_id !== undefined
      ) {
        mapRef.current._leaflet_id = null;
      }
    };
    initializeMap();

    return () => {
      // remove the map when the component is unmounted
      if (map) {
        map = map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!!mapRef && !!mapRef.current) {
      if (polyRef.current) {
        mapRef.current.fitBounds(polyRef.current.getBounds());
      }
    }
  });

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
      ref={mapRef}
      scrollWheelZoom={scrollWheelZoom}
      maxZoom={15}
      center={[47.800499, 13.04441]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      // whenCreated={(mapInstance)=> { mapRef.current = mapInstance }}
    >
      <TileLayer url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png" />
      {!!gpxPositions && gpxPositions.length > 0 && (
        <Polyline
          ref={polyRef}
          // pathOptions={{ color: 'red' }}
          pathOptions={{ weight: 5, color: "#FF7663" }}
          positions={gpxPositions}
        />
      )}
      {getStartMarker()}
      {getEndMarker()}
      {!!anreiseGpxPositions && anreiseGpxPositions.length > 0 && (
        <Polyline
          // pathOptions={{ color: 'blue' }}
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
          // pathOptions={{ color: 'green' }}
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
