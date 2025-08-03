import * as React from "react";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  lazy,
  useCallback,
  Suspense,
  MutableRefObject,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  ZoomControl,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Box from "@mui/material/Box";
import MarkerClusterGroup from "react-leaflet-cluster";
import gpxParser from "gpxparser";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadGPX } from "../../actions/fileActions";
import { useSelector } from "react-redux";
import { loadTour, setTourID } from "../../actions/tourActions.js";
import { formatMapClusterNumber } from "../../utils/map_utils";
import "./popup-style.css";
import { orderedArraysEqual, getTopLevelDomain } from "../../utils/globals";
import { createIdArray } from "../../utils/map_utils";
import useMediaQuery from "@mui/material/useMediaQuery";
import "/src/config.js";
import { FilterObject } from "../Filter/Filter.js";
import { Tour } from "../TourCard.js";

const PopupCard = lazy(() => import("./PopupCard"));

// There is also a Marker defined in leaflet. Should we use that instead?
export interface Marker {
  id: number;
  lat: number;
  lon: number;
}

export interface TourMapContainerProps {
  filter: FilterObject;
  setMapInitialized: (initialized: boolean) => void;
  mapInitialized: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectTour: (tourId: number) => any;
  handleMapBounds: (bounds: L.LatLngBounds) => void;
  handleChangedMarkers: (doHandle: boolean) => void;
  handleShowCardContainer: (show: boolean) => void;
}

function TourMapContainer({
  filter,
  setMapInitialized,
  mapInitialized,
  onSelectTour, // use for Popup content
  handleMapBounds,
  handleChangedMarkers,
  handleShowCardContainer,
}: TourMapContainerProps) {
  // @ts-expect-error TODO: fix type
  const markers = useSelector((state) => state.tours.markers); // move to props
  const isMasterMarkersSet = useRef(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const time = useMemo(() => new Date().getTime(), []); // used for MapContainer

  const domain = getTopLevelDomain();

  let default_LatNE: number,
    default_LngNE: number,
    default_LatSW: number,
    default_LngSW: number;

  //initialise map bounds and center according to domain country
  switch (domain) {
    case "si": // Slovenia
      default_LatNE = 46.876;
      default_LngNE = 16.609;
      default_LatSW = 45.421;
      default_LngSW = 13.383;
      break;

    case "fr": // France
      default_LatNE = 51.089;
      default_LngNE = 9.559;
      default_LatSW = 42.331;
      default_LngSW = -5.142;
      break;

    case "it": // North Italy only
      default_LatNE = 46.5;
      default_LngNE = 12.5;
      default_LatSW = 44.0;
      default_LngSW = 7.0;
      break;

    case "de": // Germany
      default_LatNE = 55.058;
      default_LngNE = 15.041;
      default_LatSW = 47.27;
      default_LngSW = 5.866;
      break;

    case "ch": // Switzerland
      default_LatNE = 47.808;
      default_LngNE = 10.491;
      default_LatSW = 45.817;
      default_LngSW = 5.955;
      break;

    default: // Austria
      default_LatNE = 49.019;
      default_LngNE = 17.189;
      default_LatSW = 46.372;
      default_LngSW = 9.53;
      break;
  }

  // Default map center using default bounds
  // Use markers_center instead (https://github.com/bahnzumberg/zuugle-suchseite/issues/457)
  const centerLat = (default_LatSW + default_LatNE) / 2;
  const centerLng = (default_LngSW + default_LngNE) / 2;

  const createStartMarker = () => {
    return L.icon({
      iconUrl: "app_static/img/startpunkt.png", //the acutal picture
      // shadowUrl: "app_static/img/pin-shadow.png", //the shadow of the icon
      iconSize: [33, 45], //size of the icon
      iconAnchor: [16, 46],
    });
  };

  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef();
  const markerRef = useRef(null);
  const activeMarkerRef: MutableRefObject<Marker | null> = useRef(null);

  const [gpxTrack, setGpxTrack] = useState<L.LatLngExpression[]>([]);
  const [totourGpxTrack, setTotourGpxTrack] = useState<L.LatLngExpression[]>(
    [],
  );
  const [fromtourGpxTrack, setFromtourGpxTrack] = useState<
    L.LatLngExpression[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapLoaded, setMapLoaded] = useState(false);

  const initialCity =
    searchParams.get("city") ?? localStorage.getItem("city") ?? "no-city";
  const [city, setCity] = useState(initialCity);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const filterValuesLocal = localStorage.getItem("filterValues")
    ? localStorage.getItem("filterValues")
    : null;

  // @ts-expect-error TODO
  filter = filterValuesLocal ? filterValuesLocal : filter; // TODO: why is that necessary?

  // storing masterMarkers list inside localStorage
  useEffect(() => {
    if (!isMasterMarkersSet.current && markers && markers.length > 0) {
      localStorage.setItem("masterMarkers", JSON.stringify(markers));
      localStorage.setItem("visibleMarkers", JSON.stringify(markers));
      isMasterMarkersSet.current = true; // Set the flag to true to avoid future updates
    }
  }, [markers]);

  //setMapInitialized
  useEffect(() => {
    if (!mapInitialized) {
      setMapInitialized(true);
    }
  }, [mapInitialized, setMapInitialized]);

  // keep checking until mapRef.current is set
  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current) {
        setMapLoaded(true);
        clearInterval(interval);
      }
    }, 500);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [mapRef]);

  const mapChangeHandler = (bounds: L.LatLngBounds) => {
    if (bounds && mapInitialized) {
      // Retrieve master markers from local storage if available
      const _masterMarkers = JSON.parse(
        localStorage.getItem("masterMarkers") ?? "{}",
      );

      let visibleMarkersObj: Marker[] = [];
      let _visibleMarkersArray: number[] = [];

      // if _masterMarkers is not empty
      if (!!_masterMarkers && Object.keys(_masterMarkers).length > 0) {
        visibleMarkersObj = getMarkersListFromBounds(bounds, _masterMarkers);

        // Early exit if no list of visible markers is found
        if (!visibleMarkersObj || Object.keys(visibleMarkersObj).length === 0) {
          handleShowCardContainer(false); // so we can remove the card container
          return;
        } else {
          handleShowCardContainer(true); // so we can retain the card container when markers are there
        }
        // if found extract only IDs in an array
        _visibleMarkersArray = createIdArray(visibleMarkersObj);
      }

      const storedMarkers = JSON.parse(
        localStorage.getItem("visibleMarkers") ?? "[]",
      );
      const check = checkMarkersChanges(_visibleMarkersArray, storedMarkers);

      if (!!check && !!visibleMarkersObj && !!_visibleMarkersArray) {
        localStorage.setItem(
          "visibleMarkers",
          JSON.stringify(_visibleMarkersArray),
        );
        handleChangedMarkers(true); // *** handle the Boolean flag in Main /make new call in card container

        handleMapBounds(getMarkersBounds(visibleMarkersObj) || bounds);
      } else {
        handleChangedMarkers(false);
      }
    }
  };

  const getMarkersBounds = (markers: Marker[]) => {
    const _bounds = L.latLngBounds([]);
    if (markers) {
      markers.forEach((marker) => {
        if (marker.lat && marker.lon) {
          _bounds.extend([marker.lat, marker.lon]);
        }
      });
    }
    return _bounds;
  };

  // city setting -> TODO: move to global helper
  useEffect(() => {
    const _city =
      searchParams.get("city") ?? localStorage.getItem("city") ?? "no-city";

    setCity(_city);
  }, [searchParams, city]);

  const checkMarkersChanges = (
    visibleMarkers: number[],
    storedMarkers: number[],
  ) => {
    if (!orderedArraysEqual(visibleMarkers, storedMarkers)) {
      return true;
    } else return false;
  };

  //saves the bounds on localStorage
  const assignNewMapPosition = (position: L.LatLngBounds) => {
    const _southWest = position.getSouthWest();
    const _northEast = position.getNorthEast();
    const swLat = _southWest?.lat.toFixed(6);
    const swLng = _southWest?.lng.toFixed(6);
    const neLat = _northEast?.lat.toFixed(6);
    const neLng = _northEast?.lng.toFixed(6);

    localStorage.setItem("MapPositionLatNE", String(neLat || default_LatNE));
    localStorage.setItem("MapPositionLngNE", String(neLng || default_LngNE));

    localStorage.setItem("MapPositionLatSW", String(swLat || default_LatSW));
    localStorage.setItem("MapPositionLngSW", String(swLng || default_LngSW));
  };

  const handleGpxTrack = async (url: string) => {
    if (url) {
      try {
        const loadGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
        const res = await loadGpxFunction(); // TODO: should this use dispatch?
        if (!!res && !!res.data) {
          const gpx = new gpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            const track = gpx.tracks[0].points.map((p) =>
              L.latLng(p.lat, p.lon),
            );
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

  const handleTotourGpxTrack = async (url: string) => {
    if (url) {
      try {
        const loadTotourGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
        const res = await loadTotourGpxFunction();
        if (!!res && !!res.data) {
          const gpx = new gpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            const track = gpx.tracks[0].points.map((p) =>
              L.latLng(p.lat, p.lon),
            );
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

  const handleFromtourGpxTrack = async (url: string) => {
    if (url) {
      try {
        const loadFromtourGpxFunction = loadGPX(url); // Call loadGPX with the URL to get the inner function
        const res = await loadFromtourGpxFunction();
        if (!!res && !!res.data) {
          const gpx = new gpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            const track = gpx.tracks[0].points.map((p) =>
              L.latLng(p.lat, p.lon),
            );
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
    async (e: L.LeafletMouseEvent, tourId: number) => {
      if (!mapLoaded || !mapInitialized) {
        console.warn("Map is still loading, please wait.");
        return;
      }
      if (!tourId) return;

      const tourInfo = { id: tourId, lat: e.latlng.lat, lon: e.latlng.lng };
      activeMarkerRef.current = tourInfo;

      setSelectedTour(null);

      if (!!tourId && city) {
        try {
          const _tourDetail = await onSelectTour(tourId);
          const _tour = _tourDetail.data.tour;
          if (_tour) setSelectedTour(_tour);
          if (_tour && _tour.gpx_file) await handleGpxTrack(_tour.gpx_file);
          if (_tour && _tour.totour_gpx_file)
            await handleTotourGpxTrack(_tour.totour_gpx_file);
          if (_tour && _tour.fromtour_gpx_file)
            await handleFromtourGpxTrack(_tour.fromtour_gpx_file);
        } catch (error) {
          console.error("Error fetching tour details:", error);
        }
      }
    },
    [
      mapInitialized,
      mapLoaded,
      city,
      onSelectTour,
      handleGpxTrack,
      handleTotourGpxTrack,
      handleFromtourGpxTrack,
    ],
  );

  const createClusterCustomIcon = function (cluster: {
    getChildCount: () => number;
  }) {
    const clusterChildCount = cluster.getChildCount();
    const formattedCount = formatMapClusterNumber(clusterChildCount);

    // Calculate icon size based on formatted count length
    const iconSize = L.point(
      Math.max(33, formattedCount.length * 10 + 5), // Minimum 33px, adjust padding
      Math.max(33, formattedCount.length * 10 + 5), // Minimum 33px, adjust padding
      true, // Anchor point flag :  center the icon on the cluster center position
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
        let _bounds = map.getBounds();
        // console.log("L443 mapLoaded", mapLoaded)
        // console.log("L444 markers.length", markers.length)
        if (markers && markers.length > 0 && mapLoaded) {
          // replace markers with visibleMarkers
          _bounds = getMarkersBounds(markers);
          // console.log("L446 _bounds", _bounds)
        }
        assignNewMapPosition(_bounds);
        debouncedStoppedMoving(map.getBounds());
        handleMapBounds(_bounds);
      },
    });
    return null;
  };

  //returns a list of markers that are contained within the passed bounds object
  const getMarkersListFromBounds = (
    bounds: { contains: (arg0: L.LatLng) => boolean },
    markersList: Marker[],
  ) => {
    // markersList is an array of objects {id: 72869, lat: 47.79043, lon: 15.91079}
    if (bounds && markersList) {
      return markersList.filter((marker) =>
        bounds.contains(L.latLng(marker.lat, marker.lon)),
      );
    }
    return [];
  };

  function makeDebounced(
    func: (bounds: L.LatLngBounds) => void,
    timeout: number,
  ) {
    //Function for the actual debounce
    let timer: string | number | NodeJS.Timeout | undefined;
    return (...args: [L.LatLngBounds]) => {
      clearTimeout(timer); //Resets the debounce timer --> when moved stopped and moved within the debounce time only one fetch request is made with the last bounds of the map
      timer = setTimeout(() => func(...args), timeout);
    };
  }

  function stoppedMoving(bounds: L.LatLngBounds) {
    handleChange(bounds);
  }

  const debouncedStoppedMoving = useMemo(
    () => makeDebounced(stoppedMoving, 1000),
    [],
  ); //Calls makeDebounce with the function you want to debounce and the debounce time

  const handleChange = (bounds: L.LatLngBounds) => {
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const swLat = southWest.lat.toFixed(6);
    const swLng = southWest.lng.toFixed(6);
    const neLat = northEast.lat.toFixed(6);
    const neLng = northEast.lng.toFixed(6);

    mapChangeHandler(bounds);
    const searchTerm = searchParams.get("search")
      ? searchParams.get("search")
      : null;
    const filterValues = {
      //All Values in the URL
      s: parseFloat(swLat),
      w: parseFloat(swLng),
      n: parseFloat(neLat),
      e: parseFloat(neLng),
      singleDayTour: filter?.singleDayTour,
      multipleDayTour: filter?.multipleDayTour,
      summerSeason: filter?.summerSeason,
      winterSeason: filter?.winterSeason,
      traverse: filter?.traverse,
      difficulty: filter?.difficulty,
      minAscent: filter?.minAscent,
      maxAscent: filter?.maxAscent,
      minDescent: filter?.minDescent,
      maxDescent: filter?.maxDescent,
      minTransportDuration: filter?.minTransportDuration,
      maxTransportDuration: filter?.maxTransportDuration,
      minDistance: filter?.minDistance,
      maxDistance: filter?.maxDistance,
      ranges: filter?.ranges,
      types: filter?.types,
      search: searchTerm,
    };

    if (filterValues == null) {
      searchParams.delete("filter");
      setSearchParams(searchParams);
      // localStorage.removeItem("filterValues")
    } else {
      searchParams.set("filter", JSON.stringify(filterValues));
      setSearchParams(searchParams);
      // localStorage.setItem("filterValues", JSON.stringify(filterValues))
    }
    //pull filtervalues from localStorage and pass it to params for setting
    localStorage.setItem("MapToggle", String(true)); //The map should stay the same after rendering the page
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
      {mapInitialized && !!markers && (
        <MapContainer
          key={time}
          className="leaflet-container"
          ref={mapRef}
          scrollWheelZoom={false} //if you can zoom with you mouse wheel
          zoomSnap={1}
          maxZoom={15} //how many times you can zoom
          center={[centerLat, centerLng]} //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
          zoom={7} //zoom level --> how much it is zoomed out
          style={{ height: "100%", width: "100%" }} //Size of the map
          zoomControl={false}
          whenReady={() => {
            if (mapRef.current && markers.length > 0) {
              const initialBounds = mapRef.current.getBounds();
              handleMapBounds(initialBounds); // state setter in parent "Main"
            }
          }}
        >
          <TileLayer
            url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
            maxZoom={16}
            maxNativeZoom={19}
          />

          {!!activeMarkerRef.current && selectedTour && (
            <Suspense>
              <Popup
                key={`popup_${activeMarkerRef.current.id}`}
                maxWidth={280}
                maxHeight={210}
                className="request-popup"
                offset={L.point([0, -25])}
                position={[
                  activeMarkerRef.current.lat,
                  activeMarkerRef.current.lon,
                ]}
                eventHandlers={{
                  remove: () => (activeMarkerRef.current = null),
                }}
              >
                {selectedTour?.id === activeMarkerRef.current.id && (
                  <PopupCard tour={selectedTour} city={city} />
                )}
              </Popup>
            </Suspense>
          )}
          {/* orange color  (tour track) */}
          {!!gpxTrack &&
            gpxTrack.length > 0 &&
            activeMarkerRef.current && [
              <Polyline
                key="gpx-track" // unique key prop
                pathOptions={{ weight: 6, color: "#FF7663" }}
                positions={gpxTrack}
              />,
            ]}

          {/* blue color  (fromtour) */}
          {!!fromtourGpxTrack &&
            fromtourGpxTrack.length > 0 &&
            activeMarkerRef.current && [
              <Polyline
                key="fromtour-track"
                pathOptions={{
                  weight: 6,
                  color: "#FF7663",
                  opacity: 1,
                  // opacity: !!totourGpxTrack ? 0.5 : 1,
                  lineCap: "square",
                  dashArray: "5,10",
                  dashOffset: "0",
                }}
                positions={fromtourGpxTrack}
              />,
            ]}

          {/* orange color  (totour) */}
          {!!totourGpxTrack &&
            totourGpxTrack.length > 0 &&
            activeMarkerRef.current && [
              <Polyline
                key="totour-track"
                pathOptions={{
                  weight: 6,
                  color: "#FF7663",
                  dashArray: "5,10",
                  dashOffset: "1",
                  opacity: 1,
                  lineCap: "square",
                }}
                positions={totourGpxTrack}
              />,
            ]}

          <MarkerClusterGroup
            // key={new Date().getTime()}
            ref={clusterRef}
            maxClusterRadius={100}
            chunkedLoading //dass jeder marker einzeln geladen wird --> bessere performance
            showCoverageOnHover={false}
            removeOutsideVisibleBounds={true}
            iconCreateFunction={createClusterCustomIcon} //das icon vom CLuster --> also wenn mehrere marker zusammengefasst werden
          >
            {markers.map((mark: Marker) => {
              return (
                <Marker
                  key={mark.id}
                  position={[mark.lat, mark.lon]}
                  ref={markerRef}
                  icon={createStartMarker()}
                  eventHandlers={{
                    click: (e) => handleMarkerClick(e, mark.id),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: any) => {
  return {
    loadTour,
    setTourID: (tourId: number) => dispatch(setTourID(tourId)),
  };
};

const mapStateToProps = (state: {
  tours: { filter: FilterObject; tour: Tour };
}) => {
  return {
    filter: state.tours.filter, //used to get the filter variables
    tour: state.tours.tour,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(TourMapContainer));
