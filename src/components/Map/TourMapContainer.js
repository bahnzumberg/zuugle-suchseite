import * as React from 'react';
import {MapContainer, TileLayer, Marker, Polyline, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/dist/styles.css";
import { FullscreenControl } from "react-leaflet-fullscreen";
import {useEffect, useRef, useState, useMemo} from "react";
import L from 'leaflet';
import {useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import CircularProgress from "@mui/material/CircularProgress";

const DEFAULT_ZOOM_LEVEL = 13;

export default function TourMapContainer({tours, onSelectTour, loadTourConnections, city, loadTours, totalTours, pageTours, loading, total, loadGPX}){
    console.log("onSelectTour :", onSelectTour);
    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',
        shadowUrl: 'app_static/img/pin-shadow.png',
        iconSize: [30, 41],
        iconAnchor: [15, 41],
    });

    // let EndIcon = L.icon({
    //     iconUrl: 'app_static/img/pin-icon-end.png',
    //     shadowUrl: 'app_static/img/pin-shadow.png',
    //     iconSize: [30, 41],
    //     iconAnchor: [15, 41],
    // });

    const mapRef = useRef();
    const clusterRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();
    const [gpxTrack, setGpxTrack] = useState([]);
    const [mapLoading, setMapLoading] = useState(true);

    useEffect(() => {
        updateBounds();
    }, [tours]);

    const updateBounds = () => {
        if(!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current){
            if(clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()){
                mapRef.current.fitBounds(clusterRef.current.getBounds());
            }
        }
    }

    const markerComponents = useMemo(() => {
        return (!!tours ? tours : []).map((tour, index) => {
            let data = !!tour.gpx_data ? tour.gpx_data.find(d => d.typ == "first") : null;
            if(!!data){
                return <Marker
                    key={index}
                    position={[data.lat, data.lon]}
                    title={tour.title}
                    icon={StartIcon}
                    eventHandlers={{
                        click: (e) => {
                            setCurrentGpxTrack(tour.gpx_file);
                            onSelectTour(tour.id);
                        },
                    }}
                ></Marker>
            }

        });
    }, [tours]);

    const setCurrentGpxTrack = (url) => {
        loadGPX(url).then(res => {
            if(!!res && !!res.data){
                let gpx = new gpxParser(); //Create gpxParser Object
                gpx.parse(res.data);
                if(gpx.tracks.length > 0){
                    setGpxTrack(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
                }
            }
        })
    }

    const getStartMarker = () => {
        if(!!gpxTrack && gpxTrack.length > 0){
            return <Marker position={gpxTrack[0]} icon={StartIcon}></Marker>;
        }
    }

    const getEndMarker = () => {
        // if(!!gpxTrack && gpxTrack.length > 0){
        //     return <Marker position={gpxTrack[gpxTrack.length - 1]} icon={EndIcon}></Marker>;
        // }
    }

    const createClusterCustomIcon = function (cluster) {
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(33, 33, true),
        })
    }

    function MyComponent() {
        const map = useMapEvents({
            click: (e) => {
                setGpxTrack([]);
            }
        });
        return null;
    }

    const getClusterRadius = (zoom) => (zoom > 13 ? 100 : 100);

    return <Box
        style={{height: "calc(100vh - 165px)", width: "100%", position: "relative"}}>

        {(!!loading || !!mapLoading) && <Box className={"map-spinner"}>
            <CircularProgress />
        </Box>}

        <MapContainer
            scrollWheelZoom={true}
            maxZoom={15}
            center={[47.800499,13.044410]}
            zoom={DEFAULT_ZOOM_LEVEL}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; updateBounds(); setMapLoading(false)}}
            style={{ height: "100%", width: "100%" }}>
            <TileLayer
                url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
            />

            {(!!gpxTrack && gpxTrack.length > 0) && [<Polyline
                pathOptions={{ fillColor: 'red', color: 'red' }}
                positions={gpxTrack}
            />]}

            {
                getStartMarker()
            }
            {
                getEndMarker()
            }

            <MarkerClusterGroup
                ref={clusterRef}
                maxClusterRadius={getClusterRadius}
                spiderfyOnMaxZoom={true}
                chunkedLoading={true}
                zoomToBoundsOnClick={true}
                showCoverageOnHover={false}
                iconCreateFunction={createClusterCustomIcon}
            >
                {markerComponents}
            </MarkerClusterGroup> 
            <MyComponent />

        </MapContainer>
    </Box>
}
