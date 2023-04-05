import * as React from 'react';
import {MapContainer, TileLayer, Marker, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import "react-leaflet-fullscreen/dist/styles.css";
// import { FullscreenControl } from "react-leaflet-fullscreen";
import {useEffect, useRef} from "react";
import L from 'leaflet';

// description:
//the component "InteractiveMap" renders an interactive map using the React Leaflet library. The map displays markers and polylines based on the input parameters passed to the component. The purpose of the component is to display a map with different markers and polylines that represent different routes or paths. The component uses Leaflet icons for the start and end markers and a tile layer from opentopo.bahnzumberg.at. 
//Tile layers:  provided by the OpenTopoMap project, which is a free and open-source topographic map that is based on OpenStreetMap data. The map features contour lines, hillshading, and a terrain background layer that provides information about the landscape. The opentopo.bahnzumberg.at URL is one of several servers hosting this map.
//detailed description: below final lines
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

        {/* <FullscreenControl /> */}
    </MapContainer>
}

//detailed dscription:
//The InteractiveMap component renders an interactive map using the React Leaflet library. The map displays markers and polylines based on the input parameters passed to the component. The purpose of the component is to display a map with different markers and polylines that represent different routes or paths. The component uses Leaflet icons for the start and end markers and a tile layer from OpenTopoMap project, which is a free and open-source topographic map based on OpenStreetMap data. The map features contour lines, hillshading, and a terrain background layer that provides information about the landscape.
// The component also includes a FullscreenControl from the react-leaflet-fullscreen library to enable the user to view the map in fullscreen mode. The component uses the useEffect hook to adjust the zoom level of the map to fit the bounds of the polyline. The component uses ref to get access to the Leaflet map instance and the polyline instance.
// The InteractiveMap component takes in three parameters, gpxPositions, anreiseGpxPositions, and abreiseGpxPositions, which are arrays of coordinates that define the routes or paths to display on the map. The component conditionally renders the start and end markers based on the input parameters. If anreiseGpxPositions or abreiseGpxPositions are passed, it uses the first or last coordinate of the array, respectively, for the start or end marker. Otherwise, if only gpxPositions is passed, it uses the first or last coordinate of that array for the start or end marker.
// The InteractiveMap component also renders a TileLayer component that provides the tile layer for the map, and Polyline components to render the routes or paths on the map.