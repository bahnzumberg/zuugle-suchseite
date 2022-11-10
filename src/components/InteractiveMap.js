import * as React from 'react';
import {MapContainer, TileLayer, Marker, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/dist/styles.css";
import { FullscreenControl } from "react-leaflet-fullscreen";
import {useEffect, useRef} from "react";
import L from 'leaflet';

export default function InteractiveMap({gpxPositions, anreiseGpxPositions, abreiseGpxPositions}){
    const mapRef = useRef();
    const polyRef = useRef();

    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',
        shadowUrl: 'app_static/img/pin-shadow.png',
        iconSize: [30, 41],
        iconAnchor: [15, 41],
    });

    let EndIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-end.png',
        shadowUrl: 'app_static/img/pin-shadow.png',
        iconSize: [30, 41],
        iconAnchor: [15, 41],
    });

    useEffect(() => {
        if(!!polyRef.current){
            if(!!mapRef && !!mapRef.current){
                mapRef.current.fitBounds(polyRef.current.getBounds());
            }
        }
    })

    const getStartMarker = () => {
        if(!!anreiseGpxPositions && anreiseGpxPositions.length > 0){
            return <Marker position={anreiseGpxPositions[0]} icon={StartIcon}></Marker>;
        } else if(!!gpxPositions && gpxPositions.length > 0){
            return <Marker position={gpxPositions[0]} icon={StartIcon}></Marker>;
        }
    }

    const getEndMarker = () => {
        if(!!abreiseGpxPositions && abreiseGpxPositions.length > 0){
            return <Marker position={abreiseGpxPositions[abreiseGpxPositions.length -1]} icon={EndIcon}></Marker>;
        } else if(!!gpxPositions && gpxPositions.length > 0){
            return <Marker position={gpxPositions[gpxPositions.length - 1]} icon={EndIcon}></Marker>;
        }
    }

    return <MapContainer
        scrollWheelZoom={true}
        maxZoom={17}
        center={[47.800499,13.044410]} zoom={13} style={{ height: "100%", width: "100%" }} whenCreated={(mapInstance)=> { mapRef.current = mapInstance }}>
        <TileLayer
            url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
        />
        {(!!gpxPositions && gpxPositions.length > 0) && [<Polyline
            ref={polyRef}
            pathOptions={{ fillColor: 'red', color: 'red' }}
            positions={gpxPositions}
        />]}
        {(!!anreiseGpxPositions && anreiseGpxPositions.length > 0) && [
            <Polyline
                pathOptions={{ fillColor: 'blue', color: 'blue' }}
                positions={anreiseGpxPositions}
            />
        ]}
        {(!!abreiseGpxPositions && abreiseGpxPositions.length > 0) && <Polyline
            pathOptions={{ fillColor: 'blue', color: 'blue' }}
            positions={abreiseGpxPositions}
        />}
        {
            getStartMarker()
        }
        {
            getEndMarker()
        }

        <FullscreenControl />
    </MapContainer>
}