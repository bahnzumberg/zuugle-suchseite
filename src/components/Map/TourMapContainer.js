import * as React from 'react';
import {useEffect, useRef, useState, useMemo} from "react";
import {MapContainer, TileLayer, Marker, Polyline, useMapEvents, ZoomControl, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import {connect} from "react-redux";
import {LOAD_MAP_FILTERS} from "../../actions/types";
import {useSearchParams, useNavigate} from "react-router-dom";
// import debounce from "lodash/debounce";
import { loadGPX } from '../../actions/fileActions';
import { useDispatch, useSelector } from 'react-redux';
import {consoleLog} from '../../utils/globals';
// import useDebouncedCallback from '../../utils/useDebouncedCallback';
import { loadTour } from '../../actions/tourActions';
import { PopupContent, PopupHead,PopupText, PopupImage } from "./PopupStyles.js";
import {formatMapClusterNumber} from "../../utils/map_utils";
import MountinImage from './MountinImage.jsx';
// import "./Popup.css";



function TourMapContainer({
    tours,
    tour,
    totalTours,
    onSelectTour,
    filter,
    setTourID,
    setMapInitialized,
    mapInitialized
    // loadGPX,
    // scrollWheelZoom = true,
    //   loadTourConnections,
    //   city,
    //   loadTours,
    //   pageTours,
    //   loading,
    //   total,
    //   tourID,
    //   filterVisibleToursGPX,
    //   doSubmit,
    }) {

    const navigate = useNavigate();
    const dispatch = useDispatch(); // Get dispatch function from Redux
    // const getState = useSelector(state => state); // Get state from Redux

    const markers = useSelector((state) => state.tours.markers);// move to props    

    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',   //the acutal picture
        shadowUrl: 'app_static/img/pin-shadow.png',     //the shadow of the icon
        iconSize: [30, 41],                             //size of the icon
        iconAnchor: [15, 41],
    });
 
    const mapRef = useRef();
    const clusterRef = useRef();
    const markerRef = useRef(null);

    const [gpxTrack, setGpxTrack] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const initialCity = !!searchParams.get('city') ? searchParams.get('city') : null
    const [city, setCity] = useState(initialCity);

    let filterValuesLocal = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : null;
    filter =  !!filterValuesLocal ? filterValuesLocal : filter;

    console.log("L68 filter from Main or from Localstroge: ", filter)

    // create a bounds state ?
    var onToggle = localStorage.getItem('MapToggle');
    // default map values 
    const default_MapPositionLatNE = 49.019;
    const default_MapPositionLngNE = 17.189;
    const default_MapPositionLatSW = 46.372;
    const default_MapPositionLngSW = 9.530;
    //default center calculations
    const centerLat = (default_MapPositionLatSW + default_MapPositionLatNE) / 2;
    const centerLng = (default_MapPositionLngSW + default_MapPositionLngNE) / 2;


    //checks if page is reloaded
    const pageAccessedByReload =
      (window.performance.getEntriesByType("navigation")[0] &&
        window.performance.getEntriesByType("navigation")[0].type === 1) ||
      window.performance
        .getEntriesByType("navigation")
        .map((nav) => nav.type)
        .includes("reload");

    useEffect(() => {
        // console.log("L79 mapInitialized :", mapInitialized)
        if (!mapInitialized) {
            setMapInitialized(true);
        }
    }, [mapInitialized, setMapInitialized]);

    // useEffect(() => {
    //     // Set default bounds to Austria's geographic bounds
    //     const defaultBounds = L.latLngBounds(
    //         L.latLng(46.372, 9.530), // Southwest corner (latitude, longitude)
    //         L.latLng(49.019, 17.189) // Northeast corner (latitude, longitude)
    //     );
    //     // console.log('Default Bounds:', defaultBounds);

    //     // Update the bounds when the map is first initialized
    //     if (!!mapRef.current && defaultBounds.isValid()) {
    //         // Delay execution to ensure map is fully initialized
    //         setTimeout(() => {
    //             console.log('Fitting Bounds:', defaultBounds);
    //             mapRef.current.fitBounds(defaultBounds);
    //         }, 100); // Adjust delay as needed
    //     }
    // }, []);

        
    useEffect(() => {
        //If the Bounds-Variables in the Storage are undefined --> it must be the first Load
        // So updateBounds() is called instead

        if (pageAccessedByReload && onToggle !== "true") {
            localStorage.removeItem('MapPositionLatNE');
            localStorage.removeItem('MapPositionLngNE');
            localStorage.removeItem('MapPositionLatSW');
            localStorage.removeItem('MapPositionLngSW');
            assignNewMapPosition(null); // set the localStorage to default values
            // consoleLog("L78 / local storage is set")
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
    }, [tours]);

    useEffect(()=>{
        if(!!city && !!searchParams.get('city') && city !== searchParams.get('city')){
            setCity(searchParams.get('city'))
        }
    },[searchParams])

    // const handleMarkerClick = (tourId) => {
    //     console.log('Previous popupOpen state:', popupOpen);
    //     setPopupOpen(prevState => ({
    //         ...prevState,
    //         [tourId]: !prevState[tourId] // Toggle the state of the clicked marker with popup
    //     }));
    //     console.log('New popupOpen state:', popupOpen);

    // }

    //saves the bounds on localStorage
    const assignNewMapPosition = (position) => {
        localStorage.setItem('MapPositionLatNE', position?._northEast?.lat || default_MapPositionLatNE);
        localStorage.setItem('MapPositionLngNE', position?._northEast?.lng || default_MapPositionLngNE);
        localStorage.setItem('MapPositionLatSW', position?._southWest?.lat || default_MapPositionLatSW);
        localStorage.setItem('MapPositionLngSW', position?._southWest?.lng || default_MapPositionLngSW);
    }

    const updateBounds = () => {
        if (!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current) {
            if (clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()) {
                mapRef.current.fitBounds(clusterRef.current.getBounds());
            }
        }
    }

    const setCurrentGpxTrack = async (url) => {

        if (!!url) {
            try {
                const loadGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
                const res = await loadGpxFunction(dispatch); // Execute the inner function with dispatch 
                if (!!res && !!res.data) {
                    let gpx = new gpxParser(); //Create gpxParser Object
                    gpx.parse(res.data);
                    if (gpx.tracks.length > 0) {
                        // consoleLog("L190 gpx.tracks[0].points : ");// consoleLog(gpx.tracks[0])
                        let track = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                        //consoleLog("L193 track[0][0] : ")//consoleLog(track[0][0]) //  [47.639424, 15.830512] 
                        setGpxTrack(track);
                    }
                }
            } catch (error) {
                console.error('Error loading GPX:', error);
                setGpxTrack([]);
            }
        } else {
            setGpxTrack([]);
        }
    }

    const popupClick = async (popupId)=>{
        // console.log("L221 popupClickHandler popupId : ", popupId)
        // console.log("L221 popupClickHandler city : ", city)

        if (!!popupId && !!city ) {
            try {
                loadTour(popupId, city); // Wait for the loadTour action to complete
                localStorage.setItem("tourId", popupId);
                // console.log("L227 popupClickHandler: tour data loaded successfully, tour.id :", tour.id);
                // window.open("/tour?" + searchParams.toString(),"_blank","noreferrer");
                navigate('/tour?' + searchParams.toString(), { target: '_blank' });            
                //window.location.reload(); // Reload the page in case of an error
            }catch (error) {
                console.error("Error loading tour:", error);
            }
        }else{
        window.location.reload()
        }
    }

    const handlePopupClick = (event, id) => {
        event.preventDefault();
        popupClick(id);
        console.log('L243 Clicked ID:', id);
    };


    const markerComponents = useMemo(() => {
            if (!!markers && Array.isArray(markers) && markers.length > 0) {
                return markers.map((mark) => {
                    // consoleLog("L123 : mark", mark.id)
                    if (!!mark) {
                        return (
                            <Marker
                                key={mark.id}
                                ref={markerRef}
                                position={[mark.lat, mark.lon]}
                                icon={StartIcon}
                                eventHandlers={{
                                    click: () => {
                                        setTourID(mark.id);
                                        //console.log("mark.id -> ", mark.id)
                                        // onSelectTour(mark.id);
                                        // handleMarkerClick(tour.id);
                                        // setPopupOpen(!popupOpen)
                                    },
                                }}
                            >
                                {/* <Popup> */}
                                    {/* <div onClick={()=>popupClickHandler(mark.id)}> {`ID: ${mark.id}`}</div> */}
                                    {/* <div onClick={e => handlePopupClick(e,mark.id)}> {`ID: ${mark.id}`}</div> */}
                                {/* </Popup> */}

                                <Popup className="request-popup">
                                    <PopupContent>
                                        <PopupImage
                                        src="https://www.bahn-zum-berg.at/wp-content/uploads/2021/01/20201231_Michael_werdenfels_18-720x480.jpg"
                                        alt="Mountain Image"
                                        />
                                        <PopupHead>Tour Details</PopupHead>
                                        <PopupText>Some additional details about the tour.</PopupText>
                                    </PopupContent>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                });
            }
            return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [markers,StartIcon]);

        
    const createClusterCustomIcon = function (cluster) {
        const clusterChildCount = cluster.getChildCount();
        const formattedCount = formatMapClusterNumber(clusterChildCount);

        // Calculate icon size based on formatted count length
        const iconSize = L.point(
        Math.max(33, formattedCount.length * 10 + 5), // Minimum 33px, adjust padding
        Math.max(33, formattedCount.length * 10 + 5), // Minimum 33px, adjust padding
        true // Anchor point flag :  center the icon on the cluster center position
    );
        return L.divIcon({
            html: `<span style='display: flex; justify-content: center; align-items: center; height: 100%;'>${formattedCount}</span>`,
            className: 'custom-marker-cluster',
            iconSize: iconSize,
        })
    }

            
    
    //legacy code (the Diploma )
      const MyComponent = () => {
        const map = useMapEvents({
            moveend: () => { //Throws an event whenever the bounds of the map change
                const position = map.getBounds();  //after moving the map, a position is set and saved
                console.log("L168 position changed -> value :", position)
                assignNewMapPosition(position);
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

    function stoppedMoving(bounds) { //funciton used to call initiate filter
        initiateFilter(bounds)
    }

    const debouncedStoppedMoving = makeDebounced(stoppedMoving, 300); //Calls makeDebounce with the function you want to debounce and the debounce time

    //Method to load the parameters and the filter call:
    const initiateFilter = (bounds) => {
        consoleLog("L205  filter", filter['singleDayTour']);  // seems to give the rights values when zoom in or out
        const filterValues = { //All Values in the URL
            coordinatesSouthWest: bounds?._southWest,
            coordinatesNorthEast: bounds?._northEast,
            singleDayTour: filter.singleDayTour,
            multipleDayTour: filter.multipleDayTour,
            summerSeason: filter.summerSeason,
            winterSeason: filter.winterSeason,
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
        // if (filterValues == null) {
        //     searchParams.delete("filter");
        // } else {
        //     console.log("L330 JSON.stringify(filterValues) : ", JSON.stringify(filterValues))
        //     //pull filtervalues from localStorage and pass it to params for setting
        //     searchParams.set("filter", JSON.stringify(filterValues));
        //     setSearchParams(searchParams);
        //     consoleLog("L230 searchParams set to:", JSON.stringify(filterValues) )
        // }
        // //pull filtervalues from localStorage and pass it to params for setting
        // localStorage.setItem('MapToggle', true); //The map should stay the same after rendering the page
        // setSearchParams(searchParams) //set the search Params and start the call to the backend

        if (filter == null || Object.keys(filter).length === 0) {
            searchParams.delete("filter");
        } else {
            console.log("L330 JSON.stringify(filter) : ", JSON.stringify(filter))
            //filter comes from localStorage or from Main and pass it to params to be set 
            searchParams.set("filter", JSON.stringify(filter));
            setSearchParams(searchParams);
        }
        //pull filtervalues from localStorage and pass it to params for setting
        localStorage.setItem('MapToggle', true); //The map should stay the same after rendering the page
        setSearchParams(searchParams) //set the search Params and start the call to the backend

    };

    return <Box
        style={{
            // height: "500px", 
            height: "calc(75vh - 50px)", 
            width: "100%", 
            position: "relative",
            overflow: "hidden",
            margin: "auto"
            }}>
        {mapInitialized && (
            <MapContainer
                className='leaflet-container'
                ref={mapRef}
                scrollWheelZoom={false} //if you can zoom with you mouse wheel
                zoomSnap={1}
                maxZoom={15}                    //how many times you can zoom
                center={[centerLat, centerLng]}  //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
                zoom={7}       //zoom level --> how much it is zoomed out
                style={{height: "100%", width: "100%"}} //Size of the map
                zoomControl={false}
                bounds={() => {
                    updateBounds(); 
                }}
            >
            
            <TileLayer
                url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
            />

            {(!!gpxTrack && gpxTrack.length > 0) && [<Polyline
                pathOptions={{fillColor: 'green', color: 'green'}}
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
            <MyComponent/>
            <ZoomControl position="bottomright" />
        </MapContainer>
        )}
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
        tour: state.tours.tour,
    }
};
// export default connect(mapStateToProps, mapDispatchToProps)(TourMapContainer);
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TourMapContainer));
