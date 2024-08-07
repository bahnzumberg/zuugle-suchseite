import * as React from "react";
import { useEffect, useRef, useState, useMemo, lazy, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  ZoomControl,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import { connect } from "react-redux";
import { LOAD_MAP_FILTERS } from "../../actions/types.js";
import { useSearchParams } from "react-router-dom";
// import debounce from "lodash/debounce";
import { loadGPX } from "../../actions/fileActions.js";
import { useDispatch, useSelector } from "react-redux";
import { loadTour, setTourID } from "../../actions/tourActions.js";
import { formatMapClusterNumber } from "../../utils/map_utils.js";
// import CustomMarker from './CustomMarker.js';
import "./popup-style.css";
import { orderedArraysEqual } from "../../utils/globals.js";
import { createIdArray } from "../../utils/map_utils.js";
// import { isArray } from "lodash";
import useMediaQuery from "@mui/material/useMediaQuery";

const PopupCard = lazy(() => import("./PopupCard"));

function TourMapContainer({
  tours,
  filter,
  setMapInitialized,
  mapInitialized,
  onSelectTour, // use for Popup content
  //onMarkersSubListChange,//handler for change in markers list, sets the state in Main.js
  markersSubList,
  handleMapBounds,
  handleChangedMarkers,
  setMarkersSubList,
  setMapBounds,
  mapBounds,
  handleShowCardContainer
}) {
  const dispatch = useDispatch(); // Get dispatch function from Redux
  // const getState = useSelector(state => state); // Get state from Redux

  const markers = useSelector((state) => state.tours.markers); // move to props
  const isMasterMarkersSet = useRef(false);

  const isMobile = useMediaQuery("(max-width:600px)");


  useEffect(() => {
    if (!isMasterMarkersSet.current && markers && markers.length > 0) {
      localStorage.setItem("masterMarkers", JSON.stringify(markers));
      isMasterMarkersSet.current = true; // Set the flag to true to avoid future updates
    }
  }, []);

  const createStartMarker = () => {
    return L.icon({
      iconUrl: "app_static/img/startpunkt.png", //the acutal picture
      // shadowUrl: "app_static/img/pin-shadow.png", //the shadow of the icon
      iconSize: [30, 40], //size of the icon
      iconAnchor: [15, 41],
    });
  };

  // const createEndMarker = () => {
  //   return L.icon({
  //     iconUrl: "app_static/img/zielpunkt.png", //the acutal picture
  //     shadowUrl: "app_static/img/pin-shadow.png", //the shadow of the icon
  //     iconSize: [30, 40], //size of the icon
  //     iconAnchor: [15, 41],
  //   });
  // };

  const mapRef = useRef();
  const clusterRef = useRef();
  const markerRef = useRef(null);
  const activeMarkerRef = useRef(null)

  const [gpxTrack, setGpxTrack] = useState([]);
  const [totourGpxTrack, setTotourGpxTrack] = useState([]);
  const [fromtourGpxTrack, setFromtourGpxTrack] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();


  const initialCity = !!searchParams.get("city")
    ? searchParams.get("city")
    : localStorage.getItem("city")
    ? localStorage.getItem("city")
    : null;
  const [city, setCity] = useState(initialCity);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let filterValuesLocal = !!localStorage.getItem("filterValues")
    ? localStorage.getItem("filterValues")
    : null;
  filter = !!filterValuesLocal ? filterValuesLocal : filter;

  // default map bounds
  const default_MapPositionLatNE = 49.019;
  const default_MapPositionLngNE = 17.189;
  const default_MapPositionLatSW = 46.372;
  const default_MapPositionLngSW = 9.53;
  //default center calculations
  const centerLat = (default_MapPositionLatSW + default_MapPositionLatNE) / 2;
  const centerLng = (default_MapPositionLngSW + default_MapPositionLngNE) / 2;

  //checks if page is reloaded
  // const pageAccessedByReload =
  //   (window.performance.getEntriesByType("navigation")[0] &&
  //     window.performance.getEntriesByType("navigation")[0].type === 1) ||
  //   window.performance
  //     .getEntriesByType("navigation")
  //     .map((nav) => nav.type)
  //     .includes("reload");

  useEffect(() => {
    if (!mapInitialized) {
      setMapInitialized(true);
    }
  }, [mapInitialized, setMapInitialized]);

  useEffect(() => {
    if (mapRef.current && mapBounds) {  // +++++++ if needed add mapInitialized in the condition 
      let _masterMarkers = {};

      // Retrieve master markers from local storage if available
      if (localStorage.getItem("masterMarkers")) {
        _masterMarkers = JSON.parse(localStorage.getItem("masterMarkers"));
      }

      let visibleMarkersObj = {};
      let visibleMarkersArray =[];

      // if _masterMarkers is not empty
      if (Object.keys(_masterMarkers).length > 0) {
        visibleMarkersObj = getMarkersListFromBounds(mapBounds, _masterMarkers);
        
        // Early exit if no list of visible markers is found
        if (!visibleMarkersObj || Object.keys(visibleMarkersObj).length === 0) {
          handleShowCardContainer(false);  // so we can remove the card container 
          return;
        }else{
          handleShowCardContainer(true);  // so we can retain the card container when markers are there 
        }
        // if found extract only IDs in an array
        visibleMarkersArray = createIdArray(visibleMarkersObj);
      }

      const storedMarkers = JSON.parse(localStorage.getItem("visibleMarkers")) || [];
      const check = checkMarkersChanges(visibleMarkersArray, storedMarkers);

      if (!!check && !!visibleMarkersObj && !!visibleMarkersArray) { 
        setMarkersSubList(visibleMarkersArray); // set the state of "markersSubList" defined inside Main
        localStorage.setItem("visibleMarkers", JSON.stringify(visibleMarkersArray));
        handleChangedMarkers(true); // *** handle the Boolean flag in Main /make new call in card container

        let newBounds = getMarkersBounds(visibleMarkersObj)
        !!newBounds ? handleMapBounds(newBounds) : handleMapBounds(mapBounds)

      } else {
        handleChangedMarkers(false);
      }
    }
  // eslint-disable-next-line no-use-before-define
  }, [mapBounds]);  

  /*
  useEffect(() => {
    if (activeMarkerRef.current && mapRef.current) {
      const { lat, lon } = activeMarkerRef.current;
      mapRef.current.setView([lat, lon], 15); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMarkerRef.current]);
  */
 
  const getMarkersBounds = (markers) => {
    const _bounds = L.latLngBounds([]);

    if(!!markers){
      markers.forEach((marker) => {
        if (marker.lat && marker.lon) {
          _bounds.extend([marker.lat, marker.lon]);
        }
      });

      return _bounds;
    }else return null
  };

  // city setting
  useEffect(() => {
    if (
      !!city &&
      !!searchParams.get("city") &&
      city !== searchParams.get("city")
    ) {
      setCity(searchParams.get("city"));
    }
  }, [searchParams, city]);

  const checkMarkersChanges = (visibleMarkers, storedMarkers) => {
    if (!orderedArraysEqual(visibleMarkers, storedMarkers)) {

      return true;
    } else return false;
  };

  //saves the bounds on localStorage
  const assignNewMapPosition = (position) => {
    localStorage.setItem(
      "MapPositionLatNE",
      position?._northEast?.lat || default_MapPositionLatNE
    );
    localStorage.setItem(
      "MapPositionLngNE",
      position?._northEast?.lng || default_MapPositionLngNE
    );
    localStorage.setItem(
      "MapPositionLatSW",
      position?._southWest?.lat || default_MapPositionLatSW
    );
    localStorage.setItem(
      "MapPositionLngSW",
      position?._southWest?.lng || default_MapPositionLngSW
    );
  };

  // fitting bounds when cluster is clicked
  const updateBounds = () => {
    if (
      !!mapRef &&
      !!mapRef.current &&
      !!tours &&
      clusterRef &&
      clusterRef.current
    ) {
      if (
        clusterRef.current.getBounds() &&
        clusterRef.current.getBounds().isValid()
      ) {
        mapRef.current.fitBounds(clusterRef.current.getBounds());
      }
    }
  };

  const handleGpxTrack = async (url) => {
    if (!!url) {
      try {
        const loadGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
        const res = await loadGpxFunction(dispatch); // Execute the inner function with dispatch
        if (!!res && !!res.data) {
          let gpx = new gpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            let track = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
          
            setGpxTrack(track);
          }
        }
      } catch (error) {
        console.error("Error loading GPX:", error);
        setGpxTrack([]);
      }
    } else {
      setGpxTrack([]);
    }
  };

  const handleTotourGpxTrack = async (url) => {
    if (!!url) {
      try {
        const loadTotourGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
        const res = await loadTotourGpxFunction(dispatch); // Execute the inner function with dispatch
        if (!!res && !!res.data) {
          let gpx = new gpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            let track = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
            setTotourGpxTrack(track);
          }
        }
      } catch (error) {
        console.error("Error loading GPX:", error);
        setGpxTrack([]);
      }
    } else {
      setGpxTrack([]);
    }
  };

  const handleFromtourGpxTrack = async (url) => {
    if (!!url) {
      try {
        const loadFromtourGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
        const res = await loadFromtourGpxFunction(dispatch); // Execute the inner function with dispatch
        if (!!res && !!res.data) {
          let gpx = new gpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            let track = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
            setFromtourGpxTrack(track);
          }
        }
      } catch (error) {
        console.error("Error loading GPX:", error);
        setGpxTrack([]);
      }
    } else {
      setGpxTrack([]);
    }
  }; 

  const handleMarkerClick = useCallback(
    async (e, tourId) => {

      if(!!mapInitialized) {
       
        let tourInfo = { id: tourId, lat: e.latlng.lat, lon: e.latlng.lng }
        activeMarkerRef.current = tourInfo;

        setSelectedTour(null);
        setIsLoading(true);

        if (!tourId || !city) return; // exit if not both parameters available

        if(!!tourId && city ){
          try {
            const _tourDetail = await onSelectTour(tourId);
            const _tour = _tourDetail.data.tour;
            if (_tour) setSelectedTour(_tour);
            if (_tour && _tour.gpx_file) handleGpxTrack(_tour.gpx_file);
            if (_tour && _tour.totour_gpx_file) handleTotourGpxTrack(_tour.totour_gpx_file);
            if (_tour && _tour.fromtour_gpx_file) handleFromtourGpxTrack(_tour.fromtour_gpx_file);
          } catch (error) {
            console.error("Error fetching tour details:", error);
          } finally {
            setIsLoading(false);
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [city, mapInitialized]
  );

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
      className: "custom-marker-cluster",
      iconSize: iconSize,
    });
  };

  const MyComponent = () => {
    const map = useMapEvents({
      moveend: () => {
        //Throws an event whenever the bounds of the map change
        // if there are markers , fit map to them else use the usual way
        let position = null;
        if (markers && markers.length > 0 && mapRef.current) {
          position = getMarkersBounds(markers);
        } else {
          position = map.getBounds(); //after moving the map, a position is set and saved
        }
        assignNewMapPosition(position);
        debouncedStoppedMoving(map.getBounds());
        handleMapBounds(map.getBounds())
      },
    });
    return null;
  };

  //returns a list of markers that are contained within the passed bounds object
  const getMarkersListFromBounds = (bounds, markersList) => {
    // markersList is an array of objects {id: 72869, lat: 47.79043, lon: 15.91079}
    if(!!bounds && !!markersList) {
      return markersList.filter((marker) => {
        return bounds.contains(L.latLng(marker.lat, marker.lon));
      });
    };
  };


  function makeDebounced(func, timeout) {
    //Function for the actual debounce
    let timer;
    return (...args) => {
      clearTimeout(timer); //Resets the debounce timer --> when moved stopped and moved within the debounce time only one fetch request is made with the last bounds of the map
      timer = setTimeout(() => func(...args), timeout);
    };
  }

  function stoppedMoving(bounds) {
    initiateFilter(bounds);
  }

  const debouncedStoppedMoving = useMemo(() => makeDebounced(stoppedMoving, 1000), []); //Calls makeDebounce with the function you want to debounce and the debounce time

  //Method to load the parameters and the filter call:
  const initiateFilter = (bounds) => {
    const filterValues = {
      //All Values in the URL
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
    };
    if (filterValues == null) {
      searchParams.delete("filter");
      setSearchParams(searchParams);
    } else {
      //pull filtervalues from localStorage and pass it to params for setting
      searchParams.set("filter", JSON.stringify(filterValues));
      setSearchParams(searchParams);
      }
      //pull filtervalues from localStorage and pass it to params for setting
      localStorage.setItem("MapToggle", true); //The map should stay the same after rendering the page
      // setSearchParams(searchParams); //set the search Params and start the call to the backend
  };

  return (
    <Box
      style={{
        height: !isMobile ? "calc(70vh - 50px)" : "calc(60vh - 50px)",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        margin: "auto",
      }}
    >
      {mapInitialized && (
        <MapContainer
          className="leaflet-container"
          ref={mapRef}
          scrollWheelZoom={false} //if you can zoom with you mouse wheel
          zoomSnap={1}
          maxZoom={15} //how many times you can zoom
          //maxZoom={16} //how many times you can zoom
          center={[centerLat, centerLng]} //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
          zoom={7} //zoom level --> how much it is zoomed out
          style={{ height: "100%", width: "100%" }} //Size of the map
          zoomControl={false}
          bounds={() => {
            updateBounds();
          }}
        >
          <TileLayer 
            url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png" 
            maxZoom={16}
            maxNativeZoom={19}
          />

          { !!activeMarkerRef.current && selectedTour && mapInitialized && (
            <Popup
              key={`popup_${activeMarkerRef.current.id}`}
              // minWidth={350}
              maxWidth={280}
              // minHeight={300}
              maxHeight={210}
              className="request-popup"
              offset={L.point([0, -25])}
              position={[
                parseFloat(activeMarkerRef.current.lat),
                parseFloat(activeMarkerRef.current.lon),
              ]}
              eventHandlers={{
                remove: () => activeMarkerRef.current = null,
              }}
            >
              {selectedTour?.id === activeMarkerRef.current.id && (
                <PopupCard tour={selectedTour} />
              )}
            </Popup>
          )}
          {/* orange color  (tour track) */}
          {!!gpxTrack &&
            gpxTrack.length > 0 && activeMarkerRef.current && mapInitialized && [
              <Polyline
                pathOptions={{ weight: 6, color: "#FF7663"}}
                positions={gpxTrack}
              />,
            ]
          }
          
          {/* blue color  (fromtour) */}
          {!!fromtourGpxTrack &&
            fromtourGpxTrack.length > 0 && activeMarkerRef.current && mapInitialized && [
              <Polyline
                pathOptions={{ 
                  weight: 6, 
                  color: "#FF7663",
                  opacity: 1,
                  // opacity: !!totourGpxTrack ? 0.5 : 1,
                  lineCap: 'square',
                  dashArray: '5,10',
                  dashOffset: '0' 
                }}
                positions={fromtourGpxTrack}
              />,
            ]
          }

          {/* orange color  (totour) */}
          {!!totourGpxTrack &&
            totourGpxTrack.length > 0 && activeMarkerRef.current && mapInitialized && [
              <Polyline
                pathOptions={{ 
                  weight: 6, 
                  color: "#FF7663", 
                  dashArray: '5,10', 
                  dashOffset: '1' ,
                  opacity: 1,
                  lineCap: 'square',
                }}
                positions={totourGpxTrack}
              />,
            ]
          }

          <MarkerClusterGroup
            // key={new Date().getTime()}
            ref={clusterRef}
            maxClusterRadius={100}
            chunkedLoading //dass jeder marker einzeln geladen wird --> bessere performance
            showCoverageOnHover={false}
            removeOutsideVisibleBounds={true}
            iconCreateFunction={createClusterCustomIcon} //das icon vom CLuster --> also wenn mehrere marker zusammengefasst werden
          >
            {markers.map((mark) => {
              return (
                <Marker
                  key={mark.id}
                  position={[mark.lat, mark.lon]}
                  ref={markerRef}
                  icon={createStartMarker()}
                  eventHandlers={{
                    click: (e) => mapInitialized && handleMarkerClick(e, mark.id),
                  }}
                ></Marker>
              );
            })}
          </MarkerClusterGroup>
          {/* <MapLogger /> */}
          <MyComponent />
          <ZoomControl position="bottomright" />
        </MapContainer>
      )}
    </Box>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadTour,
    filterVisibleToursGPX: (visibleToursGPX) =>
      dispatch({ type: LOAD_MAP_FILTERS, visibleToursGPX }), //used to save the bounds of the map in the redux store
    setTourID: (tourId) => dispatch(setTourID(tourId)),
  };
};

const mapStateToProps = (state) => {
  return {
    filter: state.tours.filter, //used to get the filter variables
    visibleToursGPX: state.tours.visibleToursGPX, //used to get the current bounds of the map out of the store
    tour: state.tours.tour,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(TourMapContainer));
