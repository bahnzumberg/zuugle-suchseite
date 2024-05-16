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
// import {popupContent, popupHead} from "./popupStyles";
import GoIcon from '../../icons/GoIcon';

function TourMapContainer({
    tours,
    tour,
    totalTours,
    onSelectTour,
    filter,
    setTourID,
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

    // const [popupOpen, setPopupOpen] = useState({});
    

    let StartIcon = L.icon({
        iconUrl: 'app_static/img/pin-icon-start.png',   //the acutal picture
        shadowUrl: 'app_static/img/pin-shadow.png',     //the shadow of the icon
        iconSize: [30, 41],                             //size of the icon
        iconAnchor: [15, 41],
    });
 
    const mapRef = useRef();
    const clusterRef = useRef();
    const markerRef = useRef(null);
    // const initialTours = useRef(markers);

    const [gpxTrack, setGpxTrack] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const initialCity = !!searchParams.get('city') ? searchParams.get('city') : null
    const [city, setCity] = useState(initialCity);

    // create a bounds state ?
    var onToggle = localStorage.getItem('MapToggle');
    
    //checks if page is reloaded
    const pageAccessedByReload =
      (window.performance.getEntriesByType("navigation")[0] &&
        window.performance.getEntriesByType("navigation")[0].type === 1) ||
      window.performance
        .getEntriesByType("navigation")
        .map((nav) => nav.type)
        .includes("reload");

    // POPUP related code
    // useEffect(() => {
    //     if (initialTours.current) {
    //         const initialPopupOpenState = {};
    //         const uniqueTourIds = new Set(); // Use a Set to store unique tour IDs
    //         initialTours.current.forEach(tour => {
    //             if (!uniqueTourIds.has(tour.id)) { // Check if tour ID is unique
    //                 initialPopupOpenState[tour.id] = false;
    //                 uniqueTourIds.add(tour.id); // Add tour ID to the Set
    //             } else {
    //                 console.log(`Duplicate tour ID found: ${tour.id}`); // Log a warning for duplicate IDs
    //             }
    //         });
    //         setPopupOpen(initialPopupOpenState);
    //     }
    // }, [initialTours]);

                
  
    // useEffect(()=>{
    //     // if(!!popupOpen && Array.isArray(popupOpen)){
    //     if(!!popupOpen){
    //         // for (let i = 0; i < popupOpen.length; i++) {
    //         //     consoleLog(`poopUp${i} : ${popupOpen[i]}`);
    //         // }
    //         consoleLog("L100 popupOpen:", popupOpen);
    //     }
    // },[popupOpen]);
        
    useEffect(() => {
        // consoleLog("L61 TMC / tours is : ", tours) //we do get array of tours here
        if(!!markers && Array.isArray(markers)){
            console.log("L115, markers inside TourMapContainer / length :", markers.length)
            markers.forEach(mark => console.log(`${mark.id} : (${mark.lat}, ${mark.lon})`))
        }
        //states if the toggle button is was clicked
        
        consoleLog("L70 pageAccessedByReload value :", pageAccessedByReload);
        consoleLog("L71 onToggle value :", onToggle);
        consoleLog("L72 filter value :", filter);
        consoleLog("L73 totalTours value :", totalTours);

        //If the Bounds-Variables in the Storage are undefined --> it must be the first Load
        // So updateBounds() is called instead
        //if the page is reloaded (this would also be true when clicking the toggle button) AND the toggle button was not clicked
        //all items are removed and updateBounds() is called in order to reset the map


        if (pageAccessedByReload && onToggle !== "true") {
            localStorage.removeItem('MapPositionLatNE');
            localStorage.removeItem('MapPositionLngNE');
            localStorage.removeItem('MapPositionLatSW');
            localStorage.removeItem('MapPositionLngSW');
            assignNewMapPosition(null); // set the localStorage to default values
            consoleLog("L78 / local storage is set")
            updateBounds();
        } else {
            if (!!localStorage.getItem('MapPositionLatNE') && !!localStorage.getItem('MapPositionLngNE')
                && !!localStorage.getItem('MapPositionLatSW') && !!localStorage.getItem('MapPositionLngSW')) {

                var corner1 = L.latLng(localStorage.getItem('MapPositionLatNE'), localStorage.getItem('MapPositionLngNE'));

                var corner2 = L.latLng(localStorage.getItem('MapPositionLatSW'), localStorage.getItem('MapPositionLngSW'));
                //creating a latLngBounds-Object for the fitBounds()-Method
                var bounds = L.latLngBounds(corner1, corner2);

                consoleLog("L89 bounds :", bounds);


                //the map's current position is set to the last position where the user has been
                if (!!bounds && !!mapRef && !!mapRef.current) {
                    mapRef.current?.fitBounds(bounds);
                }
            } else {
                consoleLog("L97 you are at L97 next step is updateBounds()")
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
        localStorage.setItem('MapPositionLatNE', position?._northEast?.lat || 47.97659313367704);
        localStorage.setItem('MapPositionLngNE', position?._northEast?.lng || 13.491897583007814);
        localStorage.setItem('MapPositionLatSW', position?._southWest?.lat || 47.609403608607785);
        localStorage.setItem('MapPositionLngSW', position?._southWest?.lng || 12.715988159179688);
    }

    const updateBounds = () => {
        if (!!mapRef && !!mapRef.current && !!tours && clusterRef && clusterRef.current) {
            consoleLog("L114 at updateBounds ")
            if (clusterRef.current.getBounds() && clusterRef.current.getBounds().isValid()) {
                mapRef.current.fitBounds(clusterRef.current.getBounds());
            }
        }
    }

    const setCurrentGpxTrack = async (url) => {
        consoleLog("L153 url : ", url);

        if (!!url) {
            try {
                const loadGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
                const res = await loadGpxFunction(dispatch); // Execute the inner function with dispatch 
                if (!!res && !!res.data) {
                    consoleLog("L154 IF res.data is true :", !!res.data )
                    let gpx = new gpxParser(); //Create gpxParser Object
                    gpx.parse(res.data);
                    if (gpx.tracks.length > 0) {
                        // consoleLog("L190 gpx.tracks[0].points : ")
                        // consoleLog(gpx.tracks[0])
                        let track = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
                        consoleLog("L193 track[0][0] : ")
                        consoleLog(track[0][0]) //  [47.639424, 15.830512] 
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

    // const markerComponents = useMemo(() => {
    //     // if (!!tours) {
    //     if (!!initialTours) {
    //         return initialTours.current.map((tour) => {
    //         // return tours.map((tour) => {
    //             // consoleLog("L123 : tour", tour)
    //             let data = !!tour.gpx_data ? tour.gpx_data.find(d => d.typ === "first") : null;
    //             // consoleLog("L124 : data is ", data)
    //             if (!!data) {
    //                 // markerRef.bindPopup("<div>Popup here !</div>").openPopup();
    //                 return (
    //                     <Marker
    //                         key={tour.id}
    //                         ref={markerRef}
    //                         position={[data.lat, data.lon]}
    //                         title={tour.title}
    //                         icon={StartIcon}
    //                         eventHandlers={{
    //                             click: () => {
    //                                 setTourID(tour.id);
    //                                 setCurrentGpxTrack(tour.gpx_file);
    //                                 onSelectTour(tour.id);
    //                                 handleMarkerClick(tour.id);
    //                                 // setPopupOpen(!popupOpen)
    //                             },
    //                         }}
    //                     >
    //                         {/* {popupOpen[tour.id] && ( */}
    //                         <Popup>
    //                             {/* <div>{`${tour.id} is open!`}</div> */}
    //                             <div>Popup here !</div>
    //                         </Popup>
    //                     {/* )} */}
    //                     </Marker>
    //                 );
    //             }
    //             return null;
    //         });
    //     }
    //     return null;
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [tours,onSelectTour,setTourID,StartIcon]);

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

                                {/* <Popup className="request-popup">
                                    <div 
                                        style={popupContent}
                                        onClick={e => handlePopupClick(e,mark.id)}
                                    >
                                        <div className="m-2" style={popupHead}>
                                            Tour Details
                                        </div>
                                        <GoIcon
                                            style={{
                                                transform: "scale(1.55)",
                                                strokeWidth: 0,
                                            }}
                                        />
                                    </div>
                                </Popup> */}
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
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(33, 33, true),
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
        consoleLog("L205 bounds value", bounds);  // seems to give the rights values when zoom in or out
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
        if (filterValues == null) {
            searchParams.delete("filter");
        } else {
            searchParams.set("filter", JSON.stringify(filterValues));
            setSearchParams(searchParams);
            consoleLog("L230 searchParams set to:", JSON.stringify(filterValues) )
        }
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

        <MapContainer
            className='leaflet-container'
            ref={mapRef}
            scrollWheelZoom={false} //if you can zoom with you mouse wheel
            zoomSnap={1}
            maxZoom={15}                    //how many times you can zoom
            center={[47.800499, 13.044410]}  //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
            zoom={13}       //zoom level --> how much it is zoomed out
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
export default connect(mapStateToProps, mapDispatchToProps)(TourMapContainer);