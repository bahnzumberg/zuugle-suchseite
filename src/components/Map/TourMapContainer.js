import * as React from 'react';
import {useEffect,useLayoutEffect, useRef, useState, useMemo, useCallback} from "react";
import {MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap} from "react-leaflet";
// import { useMap } from 'react-leaflet/hooks';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
// import {useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import CircularProgress from "@mui/material/CircularProgress";

const DEFAULT_ZOOM_LEVEL = 13;


export default function TourMapContainer({tours, onSelectTour, loadTourConnections, city, loadTours, totalTours, pageTours, loading, total, loadGPX, setTourID, scrollWheelZoom=true}) {
    //clg
    // loading ? console.log("loading :",loading) : console.log(" not loading",loading);
    // (tours && tours.length) ? console.log("tours inside TMC :",tours.length) : console.log("tours type :",typeof(tours))

    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',   //the acutal picture
        shadowUrl: 'app_static/img/pin-shadow.png',     //the shadow of the icon
        iconSize: [30, 41],                             //size of the icon
        iconAnchor: [15, 41],
    });


    const mapRef = useRef();
    const clusterRef = useRef();
    const polyRef = useRef();
    const [gpxTrack, setGpxTrack] = useState([]);
    const [mapLoading, setMapLoading] = useState(false);
    let visibleTours = []; //Markers which are currently visible on the map

    // useEffect(() => {
    //     const map = mapRef.current?.leafletElement;

    //     function handleClick() {
    //       console.log('Map clicked!');
    //     }

    //     if (map) {
    //       map.on('click', handleClick);
    //     }

    //     return () => {
    //       if (map) {
    //         map.off('click', handleClick);
    //       }
    //     };
    //   }, []);

//     useEffect(() => {
//     console.log("L 57: inside first useEffect ")
//     const map = mapRef.current;

//     // remove previous layers and markers
//     !!map && map.eachLayer(layer => {
//       if (!layer._url) { // ignore tile layers
//         map.removeLayer(layer);
//       }
//     });

//     if (!!polyRef.current){
//       map.fitBounds(polyRef.current.getBounds());
//     }

//     return () => {
//       // remove the map when the component is unmounted
//       !!map && map.remove();
//     }
//   }, []);

    useEffect(() => {
        //             //&& !!localStorage.getItem('MapZoom')
        //localStorage.removeItem('MapPositionLatNE');

        //If the Bounds-Variable sin the Storage are undefined --> it must be the first Load
        // So updateBounds() is called instead
        if (!!localStorage.getItem('MapPositionLatNE') && !!localStorage.getItem('MapPositionLngNE')
                         && !!localStorage.getItem('MapPositionLatSW') && !!localStorage.getItem('MapPositionLngSW')) {
            var corner1 = L.latLng(localStorage.getItem('MapPositionLatNE'), localStorage.getItem('MapPositionLngNE'));
            var corner2 = L.latLng(localStorage.getItem('MapPositionLatSW'), localStorage.getItem('MapPositionLngSW'));
            //creating a latLngBounds-Object for the fitBounds()-Method
            var bounds = L.latLngBounds(corner1, corner2);
            console.log("UseBounds:", bounds);

            //the map's current position is set to the last position where the user has been
            if (!!bounds && !!mapRef && !!mapRef.current) {
                mapRef.current?.fitBounds(bounds);
                console.log("fit!!!");
            }
        }else{
            //the map is aligned to the marker/cluster
            updateBounds();
        }

        return () => {
            //clg
            // mapRef.current ? console.log("L90 TourMAp , mapRef.current is", mapRef.current) : console.log("L90 : mapRef.current is falsy");
            // remove the map when the component is unmounted
            //let map = mapRef.current;
            //!!map && map.remove();
        }
    }, [tours])

    //after moving the map, a position is set and saved
    function MyPositionComponent() {
        /*localStorage.removeItem('MapPositionLatNE');
        localStorage.removeItem('MapPositionLngNE');
        localStorage.removeItem('MapPositionLatSW');
        localStorage.removeItem('MapPositionLngSW');*/

        const mapEvents = useMapEvents({
            mouseup: () => {
                console.log("move");
                const position = mapEvents.getBounds();
                setMapPosition(position);
            },

            zoom: () => {
                console.log("zoom");
                const position = mapEvents.getBounds();
                setMapPosition(position);
            }
        })
    }

    //saves the bounds on localStorage
    const setMapPosition = (position) => {
        localStorage.setItem('MapPositionLatNE', position._northEast?.lat || 47.97659313367704);
        localStorage.setItem('MapPositionLngNE', position._northEast?.lng || 13.491897583007814);
        localStorage.setItem('MapPositionLatSW', position._southWest?.lat || 47.609403608607785);
        localStorage.setItem('MapPositionLngSW', position._southWest?.lng || 12.715988159179688);

        console.log(position._northEast?.lat);
        console.log(position._northEast?.lng);
        console.log(position._southWest?.lat);
        console.log(position._southWest?.lng);
    }

    const updateBounds = () => {
        if(!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current){
            if(clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()){
                mapRef.current.fitBounds(clusterRef.current.getBounds());
            }
        }
    }

    //TODO: When the position or zoom of the map changes do the same
    //TODO: Then same the entries in the store
    //DEV Version --> 2 mal geladen --> tours verdoppelt sich --> key kommt damit zweimal vor
    //PROBLEM: desto öfter man den toggle Button klickt, desto höher wird die ANZ an touren???
    //Anz Touren bricht sobald man die Seite refreshed oder den Toggle button verwendet
    //Backendcall wenn man in main kommt --> tours die in map übergeben werden sind dann es dopppelte

    const markerComponents = useMemo(() => {//function to create all the markers on the map
        console.log("inside component")
        return (!!tours ? tours : []).map((tour, index) => {
            let data = !!tour.gpx_data ? tour.gpx_data.find(d => d.typ == "first") : null;
            // data && console.log("Data L53, TourMapContainer: " + JSON.stringify(data));
            if(!!data){
                return <Marker
                    //key={tour.id}
                    key={index}                   //We need the tour id to be the key cause we want to get the tours and save the ids into the store
                    position={[data.lat, data.lon]} //Where the markers will be pointing to --> laitude and longitude
                    title={tour.title}              //When you hover the marker you get the name of the tour
                    icon={StartIcon}                //how the marker should look like
                    eventHandlers={{
                        click: () => {
                            setTourID(tour.id)  // additional state passed from the parent Main.js
                            setCurrentGpxTrack(tour.gpx_file);
                            onSelectTour(tour.id);  //new window with the specific tour
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
        }).catch(error => {
            console.error('Error loading GPX:', error);
            setGpxTrack([]);
        });
    }

    const getStartMarker = () => {
        if(!!gpxTrack && gpxTrack.length > 0){
            return <Marker position={gpxTrack[0]} icon={StartIcon}></Marker>;
        }
    }


    const createClusterCustomIcon = function (cluster) {
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(33, 33, true),
        })
    }
    // const  MyComponent = useCallback(
    //   () => {
    //     () => {
    //         const map = useMapEvents({

    //             click: (e) => {
    //                 setGpxTrack([]);
    //             }
    //         });
    //         return null;
    //     }
    //   },
    //   [gpxTrack]
    // )

    // const memoizedMapContainer = useMemo( () => {
    //     return (
    //         <MapContainer
    //         ref={mapRef}
    //         scrollWheelZoom={true}
    //         maxZoom={15}
    //         center={[47.800499,13.044410]}
    //         zoom={DEFAULT_ZOOM_LEVEL}
    //         // whenCreated={(mapInstance) => {
    //         //     mapRef.current = mapInstance;
    //         //     console.log("L139 type of mapInstance:", typeof(mapInstance))
    //         //     console.log("L141 mapRef.current :", mapRef.current)
    //         //     updateBounds();
    //         //     setMapLoading(true)}
    //         // }
    //         // key={new Date().getTime()}
    //         bounds={() => {
    //             updateBounds();
    //             setMapLoading(true)
    //         }}
    //         style={{ height: "100%", width: "100%" }}
    //     >
    //         <TileLayer
    //             url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
    //         />

    //         {(!!gpxTrack && gpxTrack.length > 0) && [<Polyline
    //             pathOptions={{ fillColor: 'red', color: 'red' }}
    //             positions={gpxTrack}
    //             ref={polyRef}
    //         />]}

    //         {
    //             getStartMarker()
    //         }
    //         {
    //             getEndMarker()
    //         }

    //         <MarkerClusterGroup
    //             ref={clusterRef}
    //             maxClusterRadius={getClusterRadius}
    //             spiderfyOnMaxZoom={true}
    //             chunkedLoading={true}
    //             zoomToBoundsOnClick={true}
    //             showCoverageOnHover={false}
    //             iconCreateFunction={createClusterCustomIcon}
    //         >
    //             {markerComponents}
    //         </MarkerClusterGroup>
    //         <MyComponent />
    //     </MapContainer>
    //     )
    // },[markerComponents,tours,gpxTrack])
    const MyComponent = () => {
        const map = useMapEvents({
            moveend: () =>   {
                console.log("Moved:");
                let amountOfMarkers = 0;
                visibleTours = [];
                markerComponents.map(marker =>{ //Print the Id and their title to check if all tours are correct
                    //console.log("Id:",  marker.key, ", Title:", marker.props.title);
                    const position = marker?.props?.position ? marker.props.position : [0, 0];
                    if(map.getBounds().contains(position)){
                        //console.log("in view")
                        visibleTours.push(marker?.key);
                        amountOfMarkers++;
                    }
                })
                console.log("Number of MarkerComponents:", markerComponents.length + ' markers: ', amountOfMarkers);
                console.log(visibleTours);
            }
        })
        return null
    }


    return <Box
        style={{height: "calc(100vh - 165px)", width: "100%", position: "relative"}}>
        {/* {loading ? console.log('loading', loading) : console.log("loading var is falsy")}
            {loading ? console.log('mapLoading', mapLoading) : console.log("mapLoading is falsy")} */}
        {(!!loading || !!mapLoading) && <Box className={"map-spinner"}>
            <CircularProgress />
        </Box>}
        {/* {memoizedMapContainer} */}

        <MapContainer
            ref={mapRef}
            scrollWheelZoom={scrollWheelZoom} //if you can zoom with you mouse wheel
            maxZoom={15}                    //how many times you can zoom
            center={[47.800499,13.044410]}  //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
            zoom={13}       //zoom level --> how much it is zoomed out
            // whenCreated={(mapInstance) => {
            //     mapRef.current = mapInstance;
            //     console.log("L139 type of mapInstance:", typeof(mapInstance))
            //     console.log("L141 mapRef.current :", mapRef.current)
            //     updateBounds();
            //     setMapLoading(true)}
            // }
            // key={new Date().getTime()}
            //bounds={[localStorage.getItem('MapPositionLatNE'),localStorage.getItem('MapPositionLngNE')]}
            style={{ height: "100%", width: "100%" }} //Size of the map
        >
            <TileLayer
                url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
            />

            {(!!gpxTrack && gpxTrack.length > 0) && [<Polyline
                pathOptions={{ fillColor: 'red', color: 'red' }}
                positions={gpxTrack}
            />]}

            <MarkerClusterGroup
                key={new Date().getTime()}
                ref={clusterRef}
                maxClusterRadius={100}
                chunkedLoading //dass jeder marker einzeln geladen wird --> bessere performance
                showCoverageOnHover={false}
                iconCreateFunction={createClusterCustomIcon} //das icon vom CLuster --> also wenn mehrere marker zusammengefasst werden
            >
                {markerComponents}
            </MarkerClusterGroup>
            <MyComponent></MyComponent>
            <MyPositionComponent></MyPositionComponent>
        </MapContainer>
    </Box>
}
