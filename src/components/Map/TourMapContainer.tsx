import * as React from "react";
import { useEffect, useState, lazy, Suspense, useRef } from "react";
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
import {
  formatMapClusterNumber,
  getDefaultBoundsForDomain,
  useDebouncedCallback,
} from "../../utils/map_utils";
import "./popup-style.css";
import { getTopLevelDomain, useIsMobile } from "../../utils/globals";
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
  const isMobile = useIsMobile();
  const [triggerTourDetails, { data: tourDetails }] = useLazyGetTourQuery();
  const [triggerGPX] = useLazyGetGPXQuery();
  const domain = getTopLevelDomain();
  const mapCenter = getDefaultBoundsForDomain(domain).center;
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
  const [gpxTrack, setGpxTrack] = useState<L.LatLngExpression[]>([]);
  const [totourGpxTrack, setTotourGpxTrack] = useState<L.LatLngExpression[]>(
    [],
  );
  const [fromtourGpxTrack, setFromtourGpxTrack] = useState<
    L.LatLngExpression[]
  >([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const city = useSelector((state: RootState) => state.search.city);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeMarker) {
      setGpxTrack([]);
      setTotourGpxTrack([]);
      setFromtourGpxTrack([]);
      setSelectedTour(null);
      return;
    }

    const loadTracks = async () => {
      try {
        const tour = await triggerTourDetails({
          id: String(activeMarker.id),
          city: city?.value ?? "no-city",
        }).unwrap();

        setSelectedTour(tour);
        setGpxTrack(
          tour.gpx_file ? await triggerGPX(tour.gpx_file).unwrap() : [],
        );
        setTotourGpxTrack(
          tour.totour_gpx_file
            ? await triggerGPX(tour.totour_gpx_file).unwrap()
            : [],
        );
        setFromtourGpxTrack(
          tour.fromtour_gpx_file
            ? await triggerGPX(tour.fromtour_gpx_file).unwrap()
            : [],
        );
      } catch (err) {
        console.error("Error loading tour details or GPX:", err);
      }
    };

    loadTracks();
  }, [activeMarker, city]);

  useEffect(() => {
    if (tourDetails) setSelectedTour(tourDetails);
  }, [tourDetails]);

  const createStartMarker = () => {
    return L.icon({
      iconUrl: "/app_static/img/startpunkt.png", //the acutal picture
      // shadowUrl: "app_static/img/pin-shadow.png", //the shadow of the icon
      iconSize: [33, 45], //size of the icon
      iconAnchor: [16, 46],
    });
  };

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

  const debouncedBoundsUpdate = useDebouncedCallback(
    (bounds: L.LatLngBounds) => {
      dispatch(
        boundsUpdated({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          west: bounds.getWest(),
          east: bounds.getEast(),
        }),
      );
    },
    1000,
  ); // 1 second debounce

  function MapBoundsSync() {
    const map = useMapEvents({
      moveend() {
        debouncedBoundsUpdate(map.getBounds());
      },
    });

    return null;
  }

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
      <MapContainer
        className="leaflet-container"
        scrollWheelZoom={false} //if you can zoom with you mouse wheel
        zoomSnap={1}
        maxZoom={15} //how many times you can zoom
        center={mapCenter} //coordinates where the map will be centered --> what you will see when you render the map --> man sieht aber keine änderung wird also whs irgendwo gesetzt xD
        zoom={7} //zoom level --> how much it is zoomed out
        style={{ height: "100%", width: "100%" }} //Size of the map
        zoomControl={false}
      >
        <TileLayer
          url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
          maxZoom={16}
          maxNativeZoom={19}
        />
        <MapBoundsSync />

        {selectedTour && activeMarker && (
          <Suspense>
            <Popup
              key={`popup_${selectedTour.id}`}
              maxWidth={280}
              maxHeight={210}
              className="request-popup"
              offset={L.point([0, -25])}
              position={[activeMarker.lat, activeMarker.lon]}
              eventHandlers={{
                remove: () => setActiveMarker(null),
              }}
            >
              <PopupCard tour={selectedTour} city={city?.value || ""} />
            </Popup>
          </Suspense>
        )}
        {/* orange color  (tour track) */}
        {gpxTrack.length > 0 && (
          <Polyline
            key="gpx-track" // unique key prop
            pathOptions={{ weight: 6, color: "#FF7663" }}
            positions={gpxTrack}
          />
        )}

        {/* blue color  (fromtour) */}
        {fromtourGpxTrack.length > 0 && (
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
          />
        )}

        {/* orange color  (totour) */}
        {totourGpxTrack.length > 0 && (
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
          />
        )}

        <MarkerClusterGroup
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
                icon={createStartMarker()}
                eventHandlers={{
                  click: () => setActiveMarker(mark),
                }}
              ></Marker>
            );
          })}
        </MarkerClusterGroup>
        <ZoomControl position="bottomright" />
      </MapContainer>
    </Box>
  );
}
