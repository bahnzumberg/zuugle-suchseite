import * as React from 'react';
import { useEffect, useRef, useState, useMemo, lazy, Suspense } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, ZoomControl, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import { connect } from "react-redux";
import { LOAD_MAP_FILTERS } from "../../actions/types.js";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loadTour, setTourID } from '../../actions/tourActions.js';
import { formatMapClusterNumber } from "../../utils/map_utils.js";

const TourPopupContent = lazy(() => import('./TourPopupContent.jsx'));

function TourMapContainer({
  tours,
  tour,
  totalTours,
  filter,
  setMapInitialized,
  mapInitialized,
  onSelectTour,
  loadTourConnections
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markers = useSelector((state) => state.tours.markers);
  const mapRef = useRef();
  const clusterRef = useRef();
  const markerRef = useRef(null);
  const [gpxTrack, setGpxTrack] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || localStorage.getItem('city') || null;
  const [city, setCity] = useState(initialCity);
  const [selectedTour, setSelectedTour] = useState(null);
  let filterValuesLocal = localStorage.getItem("filterValues") || null;
  filter = filterValuesLocal || filter;
  const onToggle = localStorage.getItem('MapToggle');
  const default_MapPositionLatNE = 49.019;
  const default_MapPositionLngNE = 17.189;
  const default_MapPositionLatSW = 46.372;
  const default_MapPositionLngSW = 9.530;
  const centerLat = (default_MapPositionLatSW + default_MapPositionLatNE) / 2;
  const centerLng = (default_MapPositionLngSW + default_MapPositionLngNE) / 2;

  const pageAccessedByReload =
    (window.performance.getEntriesByType("navigation")[0] &&
      window.performance.getEntriesByType("navigation")[0].type === 1) ||
    window.performance
      .getEntriesByType("navigation")
      .map((nav) => nav.type)
      .includes("reload");

    let StartIcon = L.icon({
    iconUrl: 'app_static/img/pin-icon-start.png',   //the acutal picture
    shadowUrl: 'app_static/img/pin-shadow.png',     //the shadow of the icon
    iconSize: [30, 41],                             //size of the icon
    iconAnchor: [15, 41],
    });
    
  useEffect(() => {
    if (!mapInitialized) {
      setMapInitialized(true);
    }
  }, [mapInitialized, setMapInitialized]);

  useEffect(() => {
    if (pageAccessedByReload && onToggle !== "true") {
      localStorage.removeItem('MapPositionLatNE');
      localStorage.removeItem('MapPositionLngNE');
      localStorage.removeItem('MapPositionLatSW');
      localStorage.removeItem('MapPositionLngSW');
      assignNewMapPosition(null);
      updateBounds();
    } else {
      if (localStorage.getItem('MapPositionLatNE') &&
        localStorage.getItem('MapPositionLngNE') &&
        localStorage.getItem('MapPositionLatSW') &&
        localStorage.getItem('MapPositionLngSW')) {

        var corner1 = L.latLng(localStorage.getItem('MapPositionLatNE'), localStorage.getItem('MapPositionLngNE'));
        var corner2 = L.latLng(localStorage.getItem('MapPositionLatSW'), localStorage.getItem('MapPositionLngSW'));
        var bounds = L.latLngBounds(corner1, corner2);

        if (bounds && mapRef.current) {
          mapRef.current?.fitBounds(bounds);
        }
      } else {
        updateBounds();
      }
    }
  }, [tours]);

  useEffect(() => {
    if (city && searchParams.get('city') && city !== searchParams.get('city')) {
      setCity(searchParams.get('city'));
    }
  }, [searchParams]);

  const assignNewMapPosition = (position) => {
    localStorage.setItem('MapPositionLatNE', position?._northEast?.lat || default_MapPositionLatNE);
    localStorage.setItem('MapPositionLngNE', position?._northEast?.lng || default_MapPositionLngNE);
    localStorage.setItem('MapPositionLatSW', position?._southWest?.lat || default_MapPositionLatSW);
    localStorage.setItem('MapPositionLngSW', position?._southWest?.lng || default_MapPositionLngSW);
  };

  const updateBounds = () => {
    if (mapRef.current && tours && clusterRef.current) {
      if (clusterRef.current.getBounds().isValid()) {
        mapRef.current.fitBounds(clusterRef.current.getBounds());
      }
    }
  };

  const onMarkerClick = async (tourId) => {
    if (tourId && city) {
      try {
        const selected = await loadTour(tourId, city);
        setSelectedTour(selected.data.tour);
        console.log("Tour selected:", selected.data.tour);
        localStorage.setItem("tourId", tourId);
        dispatch(setTourID(tourId)); 
      } catch (error) {
        console.error("Error loading tour:", error);
      }
    } else {
      window.location.reload();
    }
  };

  const markerComponents = useMemo(() => {
    if (markers && Array.isArray(markers) && markers.length > 0) {
      return markers.map((mark) => {
        if (mark) {
          return (
            <Marker
              key={mark.id}
              ref={markerRef}
              position={[mark.lat, mark.lon]}
              icon={StartIcon}
              eventHandlers={{
                click: () => {
                //   onMarkerClick(mark.id);
                setTourID(mark.id);
                },
              }}
            >
              <Suspense>
                <Popup className="request-popup">
                  <TourPopupContent
                    tourId={mark.id}
                    onSelectTour={onSelectTour}
                    loadTourConnections={loadTourConnections}
                    city={city}
                    tour={tour}
                  />
                </Popup>
              </Suspense>
            </Marker>
          );
        }
        return null;
      });
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, StartIcon]);

  const createClusterCustomIcon = (cluster) => {
    const clusterChildCount = cluster.getChildCount();
    const formattedCount = formatMapClusterNumber(clusterChildCount);
    const iconSize = L.point(
      Math.max(33, formattedCount.length * 10 + 5),
      Math.max(33, formattedCount.length * 10 + 5),
      true
    );
    return L.divIcon({
      html: `<span style='display: flex; justify-content: center; align-items: center; height: 100%;'>${formattedCount}</span>`,
      className: 'custom-marker-cluster',
      iconSize: iconSize,
    });
  };

  const MyComponent = () => {
    const map = useMapEvents({
      moveend: () => {
        const position = map.getBounds();
        assignNewMapPosition(position);
        debouncedStoppedMoving(map.getBounds());
      }
    });
    return null;
  };

  const makeDebounced = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const stoppedMoving = (bounds) => {
    dispatch({
      type: LOAD_MAP_FILTERS,
      payload: {
        zoom: mapRef.current?.getZoom(),
        ne_lat: bounds?._northEast?.lat || default_MapPositionLatNE,
        ne_lng: bounds?._northEast?.lng || default_MapPositionLngNE,
        sw_lat: bounds?._southWest?.lat || default_MapPositionLatSW,
        sw_lng: bounds?._southWest?.lng || default_MapPositionLngSW,
      },
    });
  };

  const debouncedStoppedMoving = makeDebounced(stoppedMoving, 1000);

  return (
    <Box>
      <MapContainer
        ref={mapRef}
        center={[centerLat, centerLng]}
        zoom={8}
        style={{ height: "80vh", width: "100%" }}
        zoomControl={false}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          ref={clusterRef}
          iconCreateFunction={createClusterCustomIcon}
        >
          {markerComponents}
        </MarkerClusterGroup>
        <MyComponent />
      </MapContainer>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  tours: state.tours.tours,
  tour: state.tours.tour,
  totalTours: state.tours.totalTours,
  markers: state.tours.markers,
  filter: state.filter.filter,
});

const mapDispatchToProps = (dispatch) => ({
  loadTour: (tourId, city) => dispatch(loadTour(tourId, city)),
//   setTourID: (tourId) => dispatch({ type: 'SET_TOUR_ID', payload: tourId }),
  setTourID: (tourId) => dispatch(setTourID(tourId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TourMapContainer);
