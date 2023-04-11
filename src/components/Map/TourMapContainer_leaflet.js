import * as React from 'react';
import {useEffect,useLayoutEffect, useRef, useState, useMemo} from "react";
import {MapContainer, TileLayer, Marker, Polyline, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import {useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import CircularProgress from "@mui/material/CircularProgress";

const DEFAULT_ZOOM_LEVEL = 13;

export default function TourMapContainer({tours, onSelectTour, loadTourConnections, city, loadTours, totalTours, pageTours, loading, total, loadGPX}){
    //clg
    // loading ? console.log("loading :",loading) : console.log(" not loading",loading);
    // (tours && tours.length) ? console.log("tours inside TMC :",tours.length) : console.log("tours type :",typeof(tours))
   
    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',
        shadowUrl: 'app_static/img/pin-shadow.png',
        iconSize: [30, 41],
        iconAnchor: [15, 41],
    });


    const mapRef = useRef();
    const clusterRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();
    const [gpxTrack, setGpxTrack] = useState([]);
    const [mapLoading, setMapLoading] = useState(false);

    useEffect(() => {
        // console.log("L34 mapRef :", mapRef)
        updateBounds();
        // console.log("inside useEffects :")
    }, [tours]);

    const updateBounds = () => {
        // let check = !!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current;
        // console.log('check value :', check);
        // let check_1 = !!mapRef.current 
        // console.log('check mapRef.current only  :', check_1);
        // let check_2 =  !!tours 
        // console.log('check tours value only:', check_2);
        // let check_3 =  !!clusterRef.current ;
        // console.log('check clusterRef.current value only :', check_3);
        // console.log("tours length :", tours.length);
        // console.log("clusterRef.current  :", clusterRef.current);
        if(!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current){
            if(clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()){
                mapRef.current.fitBounds(clusterRef.current.getBounds());
            }
        }
    }

    const markerComponents = useMemo(() => {
        return (!!tours ? tours : []).map((tour, index) => {
            let data = !!tour.gpx_data ? tour.gpx_data.find(d => d.typ == "first") : null;
            // data && console.log("Data L53, TourMapContainer: " + JSON.stringify(data));
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
        // console.log("L83 url : " + url);
        loadGPX(url).then(res => {
            if(!!res && !!res.data){
                let gpx = new gpxParser(); //Create gpxParser Object
                gpx.parse(res.data);
                if(gpx.tracks.length > 0){
                    let track= gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                    setGpxTrack(track);
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
            {/* {loading ? console.log('loading', loading) : console.log("loading var is falsy")}
            {loading ? console.log('mapLoading', mapLoading) : console.log("mapLoading is falsy")} */}
        {(!!loading || !!mapLoading) && <Box className={"map-spinner"}>
            <CircularProgress />
        </Box>}
        <MapContainer
            ref={mapRef}
            scrollWheelZoom={true}
            maxZoom={15}
            center={[47.800499,13.044410]}
            zoom={DEFAULT_ZOOM_LEVEL}
            // whenCreated={(mapInstance) => { 
            //     mapRef.current = mapInstance; 
            //     console.log("L139 type of mapInstance:", typeof(mapInstance))
            //     console.log("L141 mapRef.current :", mapRef.current)
            //     updateBounds(); 
            //     setMapLoading(true)}
            // }
            // key={new Date().getTime()}
            bounds={() => {
                updateBounds(); 
                setMapLoading(true)
            }}
            style={{ height: "100%", width: "100%" }}
        >
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
