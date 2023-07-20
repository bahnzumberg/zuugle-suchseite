import * as React from 'react';
import {useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback} from "react";
import {MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap} from "react-leaflet";
// import { useMap } from 'react-leaflet/hooks';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
// import {useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import CircularProgress from "@mui/material/CircularProgress";
import {connect} from "react-redux";
import {LOAD_MAP_FILTERS} from "../../actions/types";

const DEFAULT_ZOOM_LEVEL = 13;


function TourMapContainer({
                              tours,
                              onSelectTour,
                              loadTourConnections,
                              city,
                              loadTours,
                              totalTours,
                              pageTours,
                              loading,
                              total,
                              loadGPX,
                              setTourID,
                              scrollWheelZoom = true,
                              visibleTours,
                              filterVisibleToursGPX
                          }) {
    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',   //the acutal picture
        shadowUrl: 'app_static/img/pin-shadow.png',     //the shadow of the icon
        iconSize: [30, 41],                             //size of the icon
        iconAnchor: [15, 41],
    });


    const mapRef = useRef();
    const clusterRef = useRef();
    const [gpxTrack, setGpxTrack] = useState([]);
    const [mapLoading, setMapLoading] = useState(false);

    //checks if page is reloaded
    const pageAccessedByReload = (
        (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance
            .getEntriesByType('navigation')
            .map((nav) => nav.type)
            .includes('reload')
    );

    useEffect(() => {
        //If the Bounds-Variables in the Storage are undefined --> it must be the first Load
        // So updateBounds() is called instead

        //states if the toggle buton is was clicked
        var onToggle = localStorage.getItem('MapToggle');

        //if the page is reloaded (this would also be true when clicking the toggle button) AND the toggle button was not clicked
        //all items are removed and updateBounds() is called in order to reset the map
        if (pageAccessedByReload && onToggle != "true") {
            localStorage.removeItem('MapPositionLatNE');
            localStorage.removeItem('MapPositionLngNE');
            localStorage.removeItem('MapPositionLatSW');
            localStorage.removeItem('MapPositionLngSW');
            updateBounds();
        } else {
            if (!!localStorage.getItem('MapPositionLatNE') && !!localStorage.getItem('MapPositionLngNE')
                && !!localStorage.getItem('MapPositionLatSW') && !!localStorage.getItem('MapPositionLngSW')) {
                var corner1 = L.latLng(localStorage.getItem('MapPositionLatNE'), localStorage.getItem('MapPositionLngNE'));
                var corner2 = L.latLng(localStorage.getItem('MapPositionLatSW'), localStorage.getItem('MapPositionLngSW'));
                //creating a latLngBounds-Object for the fitBounds()-Method
                var bounds = L.latLngBounds(corner1, corner2);

                //the map's current position is set to the last position where the user has been
                if (!!bounds && !!mapRef && !!mapRef.current) {
                    mapRef.current?.fitBounds(bounds);
                }
            } else {
                //the map is aligned to the marker/cluster
                updateBounds();
            }
        }
    }, [tours])

    //after moving the map, a position is set and saved
    function MyPositionComponent() {
        const mapEvents = useMapEvents({
            moveend: () => {
                const position = mapEvents.getBounds();
                setMapPosition(position);
            },

            zoom: () => {
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
        console.log(position._northEast?.lat)
        console.log(position._northEast?.lng)
        console.log(position._southWest?.lat)
        console.log(position._southWest?.lng)

    }

    const updateBounds = () => {
        if (!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current) {
            if (clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()) {
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
        return (!!tours ? tours : []).map((tour, index) => {
            let data = !!tour.gpx_data ? tour.gpx_data.find(d => d.typ == "first") : null;
            if (!!data) {
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
        loadGPX(url).then(res => {
            if (!!res && !!res.data) {
                let gpx = new gpxParser(); //Create gpxParser Object
                gpx.parse(res.data);
                if (gpx.tracks.length > 0) {
                    let track = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                    setGpxTrack(track);
                }
            }
        }).catch(error => {
            console.error('Error loading GPX:', error);
            setGpxTrack([]);
        });
    }

    const getStartMarker = () => {
        if (!!gpxTrack && gpxTrack.length > 0) {
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
    const MyComponent = () => {
        const map = useMapEvents({
            moveend: () => {
                /*let amountOfMarkers = 0;
                visibleToursOnMap = [];
                markerComponents.map(marker => { //Print the Id and their title to check if all tours are correct
                    //console.log("Id:",  marker.key, ", Title:", marker.props.title);
                    const position = marker?.props?.position ? marker.props.position : [0, 0];
                    if (map.getBounds().contains(position)) {
                        //console.log("in view")
                        console.log(position)
                        visibleToursOnMap.push({id : marker?.key, lat : position[0], lon: position[1]});
                        amountOfMarkers++;
                    }
                })
                filterVisibleToursGPX(visibleToursOnMap);*/


                /* Aufbau von get Bounds:
                LatLngBounds
                    _northEast: LatLng {lat: 49.55014950174062, lng: 13.521202303280619}
                    _southWest: LatLng {lat: 48.50385480315508, lng: 11.977623201718119}
                 */
                //Alle filter auch aus dem Store holen und dann call triggert--> Liste von ids
                //DANACH zweiter call mit der liste von ids dann fürs anzeigen der details --> ist automatisch wenn karte geschlossen
                //in search params coordinates reinschreiben und dann mit useEffect auf die Search Parameter chekcen
                //über load tours wird data befüllt --> functions die data objekt übernimmt
                //überall wo load tours steht coordinaten mitgeben
                //DATUM ans bakcend mitschicken --> optional
                //TODO: Set Timeout, debounce and insert timestamp
                filterVisibleToursGPX(map.getBounds());
                console.log("Current Bounds: ", map.getBounds());
                //TODO: include them in the filter request
            }
        })
        return null
    }


    return <Box
        style={{height: "calc(100vh - 165px)", width: "100%", position: "relative"}}>
        {(!!loading || !!mapLoading) && <Box className={"map-spinner"}>
            <CircularProgress/>
        </Box>}

        <MapContainer
            ref={mapRef}
            scrollWheelZoom={scrollWheelZoom} //if you can zoom with you mouse wheel
            maxZoom={15}                    //how many times you can zoom
            center={[47.800499, 13.044410]}  //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
            zoom={13}       //zoom level --> how much it is zoomed out
            style={{height: "100%", width: "100%"}} //Size of the map
        >
            <TileLayer
                url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
            />

            {(!!gpxTrack && gpxTrack.length > 0) && [<Polyline
                pathOptions={{fillColor: 'red', color: 'red'}}
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

const mapDispatchToProps = (dispatch) => {
    return {
        filterVisibleToursGPX: (visibleToursGPX) => dispatch({type: LOAD_MAP_FILTERS, visibleToursGPX})
    }
};


const mapStateToProps = (state) => {
    return {
        visibleToursGPX: state.tours.visibleToursGPX,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TourMapContainer);