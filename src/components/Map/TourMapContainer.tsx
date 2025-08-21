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
import { useSelector } from "react-redux";
import { formatMapClusterNumber } from "../../utils/map_utils";
import "./popup-style.css";
import { getTopLevelDomain } from "../../utils/globals";
import useMediaQuery from "@mui/material/useMediaQuery";
import "/src/config.js";
import { Tour } from "../../models/Tour";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import { boundsUpdated } from "../../features/searchSlice";
import {
  useLazyGetGPXQuery,
  useLazyGetTourQuery,
} from "../../features/apiSlice";

const PopupCard = lazy(() => import("./PopupCard"));

// There is also a Marker defined in leaflet. Should we use that instead?
export interface Marker {
  id: number;
  lat: number;
  lon: number;
}

export interface TourMapContainerProps {
  markers: Marker[];
}

/**
 * Displays map with markers of tours. Updates bounds which triggers an update of loaded tours in Main.tsx.
 */
export default function TourMapContainer({ markers }: TourMapContainerProps) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [triggerTourDetails, { data: tourDetails }] = useLazyGetTourQuery();
  const [triggerGPX, { data: track }] = useLazyGetGPXQuery();
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
  const [centerLat, setCenterLat] = useState(
    (default_LatSW + default_LatNE) / 2,
  );
  const [centerLng, setCenterLng] = useState(
    (default_LngSW + default_LngNE) / 2,
  );

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const city = useSelector((state: RootState) => state.search.city);

  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (tourDetails) setSelectedTour(tourDetails);
  }, [tourDetails]);

  const createStartMarker = () => {
    return L.icon({
      iconUrl: "app_static/img/startpunkt.png", //the acutal picture
      // shadowUrl: "app_static/img/pin-shadow.png", //the shadow of the icon
      iconSize: [33, 45], //size of the icon
      iconAnchor: [16, 46],
    });
  };

  const getMarkersBounds = (markers: Marker[]) => {
    const _bounds = L.latLngBounds([]);
    if (markers.length > 0) {
      markers.forEach((marker) => {
        if (marker.lat && marker.lon) {
          _bounds.extend([marker.lat, marker.lon]);
        }
      });
    }
    return _bounds;
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
      const track = await triggerGPX(url).unwrap();
      setGpxTrack(track);
    } else {
      setGpxTrack([]);
    }
  };

  const handleTotourGpxTrack = async (url: string) => {
    if (url) {
      const track = await triggerGPX(url).unwrap();
      setTotourGpxTrack(track);
    } else {
      setTotourGpxTrack([]);
    }
  };

  const handleFromtourGpxTrack = async (url: string) => {
    if (url) {
      const track = await triggerGPX(url).unwrap();
      setTotourGpxTrack(track);
    } else {
      setFromtourGpxTrack([]);
    }
  };

  const handleMarkerClick = useCallback(
    async (e: L.LeafletMouseEvent, marker: Marker) => {
      console.log("handleMarkerClick", e, marker);
      if (!mapLoaded) {
        console.warn("Map is still loading, please wait.");
        return;
      }
      if (!marker.id) return;

      activeMarkerRef.current = marker;

      try {
        const _tour = await triggerTourDetails({
          id: marker.id,
          city: city?.value ?? "no-city",
        }).unwrap();

        console.log("_tour", _tour);
        if (_tour.gpx_file) await handleGpxTrack(_tour.gpx_file);
        if (_tour.totour_gpx_file)
          await handleTotourGpxTrack(_tour.totour_gpx_file);
        if (_tour.fromtour_gpx_file)
          await handleFromtourGpxTrack(_tour.fromtour_gpx_file);
      } catch (error) {
        console.error("Error fetching tour details:", error);
      }
    },
    [
      mapLoaded,
      city,
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
      },
    });
    return null;
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
    dispatch(
      boundsUpdated({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
        east: bounds.getEast(),
      }),
    );
  }

  const debouncedStoppedMoving = useMemo(
    () => makeDebounced(stoppedMoving, 1000),
    [],
  ); //Calls makeDebounce with the function you want to debounce and the debounce time

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
      {markers && (
        <MapContainer
          className="leaflet-container"
          ref={mapRef}
          scrollWheelZoom={false} //if you can zoom with you mouse wheel
          zoomSnap={1}
          maxZoom={15} //how many times you can zoom
          center={[centerLat, centerLng]} //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
          zoom={7} //zoom level --> how much it is zoomed out
          style={{ height: "100%", width: "100%" }} //Size of the map
          zoomControl={false}
        >
          <TileLayer
            url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
            maxZoom={16}
            maxNativeZoom={19}
          />

          {activeMarkerRef.current && selectedTour && (
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
                  <PopupCard tour={selectedTour} city={city?.value || ""} />
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
                    click: (e) => handleMarkerClick(e, mark),
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
