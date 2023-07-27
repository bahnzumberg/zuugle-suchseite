import * as React from 'react';
import {useEffect, useRef, useState, useMemo} from "react";
import {MapContainer, TileLayer, Marker, Polyline, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import {connect} from "react-redux";
import {LOAD_MAP_FILTERS} from "../../actions/types";
import {useSearchParams} from "react-router-dom";
import debounce from "lodash/debounce";

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
                              filter,
                              filterVisibleToursGPX,
                              doSubmit,
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
    const [searchParams, setSearchParams] = useSearchParams();

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

        //states if the toggle button is was clicked
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

    //saves the bounds on localStorage
    const setMapPosition = (position) => {
        localStorage.setItem('MapPositionLatNE', position._northEast?.lat || 47.97659313367704);
        localStorage.setItem('MapPositionLngNE', position._northEast?.lng || 13.491897583007814);
        localStorage.setItem('MapPositionLatSW', position._southWest?.lat || 47.609403608607785);
        localStorage.setItem('MapPositionLngSW', position._southWest?.lng || 12.715988159179688);
    }

    const updateBounds = () => {
        if (!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current) {
            if (clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()) {
                mapRef.current.fitBounds(clusterRef.current.getBounds());
            }
        }
    }

    const markerComponents = useMemo(() => {
        if (!!tours) {
            return tours.map((tour, index) => {
                let data = !!tour.gpx_data ? tour.gpx_data.find(d => d.typ === "first") : null;
                if (!!data) {
                    return (
                        <Marker
                            key={index}
                            position={[data.lat, data.lon]}
                            title={tour.title}
                            icon={StartIcon}
                            eventHandlers={{
                                click: () => {
                                    setTourID(tour.id);
                                    setCurrentGpxTrack(tour.gpx_file);
                                    onSelectTour(tour.id);
                                },
                            }}
                        ></Marker>
                    );
                }
                return null;
            });
        }
        return null;
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

    const createClusterCustomIcon = function (cluster) {
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(33, 33, true),
        })
    }
    const MyComponent = () => {
        const map = useMapEvents({
            moveend: () => { //Throws an event whenever the bounds of the map change
                const position = map.getBounds();  //after moving the map, a position is set and saved
                setMapPosition(position);
                debouncedStoppedMoving(map.getBounds());
            }
        })
        return null
    }

    function makeDebounced(func, timeout) { //Function for the actual debounce
        let timer;
        return (...args) => {
            clearTimeout(timer) //Resets the debounce timer --> when moved stopped and moved within the debounce time only one fetch request is made with the last bounds of the map
            timer = setTimeout(() => func(...args), timeout);
        };
    }

    function stoppedMoving(bounds) { //funciton used to call initiate Filter
        initiateFilter(bounds)
    }

    const debouncedStoppedMoving = makeDebounced(stoppedMoving, 300); //Calls makeDebounce with the function you want to debounce and the debounce time

    //Method to load the parameters and the filter call:
    const initiateFilter = (bounds) => {
        console.log("Filter: ", bounds);
        const filterValues = { //All Values in the URL
            coordinatesSouthWest: bounds?._southWest,
            coordinatesNorthEast: bounds?._northEast,
            singleDayTour: filter.singleDayTour,
            multipleDayTour: filter.multipleDayTour,
            summerSeason: filter.summerSeason,
            winterSeason: filter.winterSeason,
            children: filter.children,
            traverse: filter.traverse,
            difficulty: filter.difficulty,
            minAscent: filter.minAscent,
            maxAscent: filter.maxAscent,
            minDescent: filter.minDescent,
            maxDescent: filter.maxDescent,
            minTransportDuration: filter.minTransportDuration,
            maxTransportDuration: filter.maxTransportDuration,
            minDistance: filter.minDistance,
            maxDistance: filter.maxDistance,
            ranges: filter.ranges,
            types: filter.types,
        }
        console.log("filter values:", filterValues);
        if (filterValues == null) {
            searchParams.delete("filter");
        } else {
            searchParams.set("filter", JSON.stringify(filterValues));
        }
        localStorage.setItem('MapToggle', true); //The map should stay the same after rendering the page
        setSearchParams(searchParams) //set the search Params and start the call to the backend
    };

    return <Box
        style={{height: "calc(100vh - 165px)", width: "100%", position: "relative"}}>

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
        </MapContainer>
    </Box>
}

const mapDispatchToProps = (dispatch) => {
    return {
        filterVisibleToursGPX: (visibleToursGPX) => dispatch({type: LOAD_MAP_FILTERS, visibleToursGPX}) //used to save the bounds of the map in the redux store
    }
};

const mapStateToProps = (state) => {
    return {
        filter: state.tours.filter, //used to get the filter variables
        visibleToursGPX: state.tours.visibleToursGPX, //used to get the current bounds of the map out of the store
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(TourMapContainer);