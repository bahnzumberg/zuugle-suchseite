import * as React from 'react';
import {useRef, useEffect, useMemo} from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { divIcon } from 'leaflet';

export default function InteractiveMap({ gpxPositions, anreiseGpxPositions, abreiseGpxPositions, scrollWheelZoom=false }) {
  const polyRef = useRef();
  const mapRef  = useRef(null);

  const startIcon = L.icon({
    iconUrl: 'app_static/img/pin-icon-start.png',
    shadowUrl: 'app_static/img/pin-shadow.png',
    iconSize: [30, 41],
    iconAnchor: [15, 41],
  });
  const endIcon = L.icon({
    iconUrl: 'app_static/img/pin-icon-end.png',
    shadowUrl: 'app_static/img/pin-shadow.png',
    iconSize: [30, 41],
    iconAnchor: [15, 41],
  });

  const StartMarker = ({ position }) => {
    return <Marker position={position} icon={startIcon}></Marker>;
  };

  const EndMarker = ({ position }) => {
    return <Marker position={position} icon={endIcon}></Marker>;
  };


useEffect(() => {
  let map = mapRef.current;
  const initializeMap = () => {
    if (!!mapRef && !!mapRef.current) {
      if (!!mapRef.current._leaflet_id && mapRef.current._leaflet_id !== (null || undefined)) {
        // console.log("Just before initialization")
        mapRef.current._leaflet_id = null;
      }
    }
  };
  initializeMap();
  //clg
  mapRef.current
    ? console.log(
        "L130 Interactive, ouside if(), mapRef.current._leaflet_id is :",
        mapRef.current._leaflet_id
      )
    : console.log("L133 mapRef.current is falsy");

  return () => {
    // remove the map when the component is unmounted
    // map ? console.log("L138 returning InteractiveM , map is", map) : console.log("L138 Interactive, this is", map);
    if(!!map) {
      map = map.remove();
    } 
  };
}, []);

useEffect(() => {
  if (!!mapRef && !!mapRef.current) {
    if (!!polyRef.current) {
      mapRef.current.fitBounds(polyRef.current.getBounds());
    }
  }
});

  const getStartMarker = () => {
    if (anreiseGpxPositions && anreiseGpxPositions.length > 0) {
      return <StartMarker position={anreiseGpxPositions[0]} />;
    } else if (gpxPositions && gpxPositions.length > 0) {
      return <StartMarker position={gpxPositions[0]} />;
    }
  }
  const getEndMarker = () => {
    if (!!abreiseGpxPositions && abreiseGpxPositions.length > 0) {
      return <EndMarker position={abreiseGpxPositions[abreiseGpxPositions.length - 1]} />;
    } else if (!!gpxPositions && gpxPositions.length > 0) {
      return <EndMarker position={gpxPositions[gpxPositions.length - 1]} />;
    }
  };


  return (
    <MapContainer
      // key={()=>generateKey()}
      ref={mapRef}
      scrollWheelZoom={scrollWheelZoom}
      maxZoom={17}
      center={[47.800499, 13.04441]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      // whenCreated={(mapInstance)=> { mapRef.current = mapInstance }}
    >
      <TileLayer url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png" />
      {!!gpxPositions && gpxPositions.length > 0 && (
        <Polyline
          ref={polyRef}
          pathOptions={{ color: 'red' }}
          positions={gpxPositions}
        />
      )}
      {getStartMarker()}
      {getEndMarker()}
      {!!anreiseGpxPositions && anreiseGpxPositions.length > 0 && (
        <Polyline
          pathOptions={{ color: 'blue' }}
          positions={anreiseGpxPositions}
        />
      )}
      {!!abreiseGpxPositions && abreiseGpxPositions.length > 0 && (
        <Polyline
          pathOptions={{ color: 'green' }}
          positions={abreiseGpxPositions}
        />
      )}
    </MapContainer>
  )
}