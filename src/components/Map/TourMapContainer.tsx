import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import {
  formatMapClusterNumber,
  getDefaultBoundsForDomain,
} from "../../utils/map_utils";
import "./popup-style.css";
import { getTopLevelDomain, useIsMobile } from "../../utils/globals";
import { Tour } from "../../models/Tour";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import { boundsUpdated, poiUpdated } from "../../features/searchSlice";
import {
  useLazyGetGPXQuery,
  useLazyGetTourQuery,
} from "../../features/apiSlice";
import { MemoizedPopupCard } from "./PopupCard";
import ClusterGroup from "./ClusterGroup";
import ResizableCircle from "./ResizableCircle";
import { MapClickHandler } from "./MapClickHandler";
import { MapBoundsUpdater } from "./MapBoundsUpdater";
import { MapBoundsSync } from "./MapBoundsSync";
import { useSearchParams } from "react-router";

// There is also a Marker defined in leaflet. Should we use that instead?
export interface Marker {
  id: number;
  lat: number;
  lon: number;
}

export interface TourMapContainerProps {
  markers: Marker[];
  isLoading: boolean;
}

/**
 * Displays map with markers of tours. Updates bounds which triggers an update of loaded tours in Main.tsx.
 */
export default function TourMapContainer({
  markers,
  isLoading,
}: TourMapContainerProps) {
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
  const [clickPosition, setClickPosition] = useState<L.LatLng | null>(null);
  const poi = useSelector((state: RootState) => state.search.poi);
  const city = useSelector((state: RootState) => state.search.city);
  const [markersInvalidated, setMarkersInvalidated] = useState(false);
  const [isUserMoving, setIsUserMoving] = useState(false);
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const provider = searchParams.get("p");

  useEffect(() => {
    if (!isLoading) {
      setMarkersInvalidated(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!activeMarker) {
      setGpxTrack([]);
      setTotourGpxTrack([]);
      setFromtourGpxTrack([]);
      setSelectedTour(null);
      return;
    }

    setClickPosition(null);
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

  const createClusterCustomIcon = function (cluster: L.MarkerCluster) {
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

  const startMarker = useMemo(
    // created once for the whole component lifetime
    () =>
      L.icon({
        iconUrl: "https://cdn.zuugle.at/img/startpunkt.png",
        iconSize: [33, 45],
        iconAnchor: [16, 46],
      }),
    [],
  );

  const handleMarkerClick = useCallback((mark: Marker) => {
    setActiveMarker((prev) => (prev?.id === mark.id ? null : mark));
  }, []);

  const processedMarkers = useMemo(
    () =>
      markers.map((mark) => ({
        id: mark.id,
        position: L.latLng(mark.lat, mark.lon),
        icon: startMarker,
        onClick: () => handleMarkerClick(mark),
      })),
    [markers, startMarker, handleMarkerClick],
  );

  const handlePoiSearch = useCallback(
    (coords: L.LatLng, radius: number) => {
      setClickPosition(null);
      dispatch(poiUpdated({ lat: coords.lat, lng: coords.lng, radius }));
      setMarkersInvalidated(true);
    },
    [dispatch],
  );

  const updateBounds = useCallback(
    (b: L.LatLngBounds) => {
      dispatch(
        boundsUpdated({
          north: b.getNorth(),
          south: b.getSouth(),
          west: b.getWest(),
          east: b.getEast(),
        }),
      );
    },
    [dispatch],
  );

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
        zoomSnap={1}
        maxZoom={15} //how many times you can zoom
        center={mapCenter}
        zoom={7} //zoom level --> how much it is zoomed out
        style={{ height: "100%", width: "100%" }} //Size of the map
        zoomControl={false}
      >
        <TileLayer
          url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
          maxZoom={16}
          maxNativeZoom={19}
        />
        {!poi && (
          <MapBoundsSync
            setIsUserMoving={setIsUserMoving}
            updateBounds={updateBounds}
          />
        )}
        <MapBoundsUpdater
          isUserMoving={isUserMoving}
          poi={poi}
          markers={markers}
          markersInvalidated={markersInvalidated}
        />
        <MapClickHandler
          clickPosition={clickPosition}
          setClickPosition={setClickPosition}
          handlePoiSearch={handlePoiSearch}
        />
        <MemoizedPopupCard
          tour={selectedTour}
          city={city?.value || ""}
          provider={provider}
          activeMarker={activeMarker}
          setActiveMarker={setActiveMarker}
        />

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

        <ClusterGroup
          markers={processedMarkers}
          createClusterCustomIcon={createClusterCustomIcon}
          options={{
            maxClusterRadius: 100,
            chunkedLoading: true,
            showCoverageOnHover: false,
            removeOutsideVisibleBounds: true,
          }}
        />
        {poi && (
          <ResizableCircle
            center={poi}
            initialRadius={poi.radius}
            onRadiusChange={(radius) => {
              dispatch(poiUpdated({ ...poi, radius: radius }));
            }}
            onRemove={(map: L.Map) => {
              dispatch(poiUpdated(null));
              updateBounds(map.getBounds());
            }}
          />
        )}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </Box>
  );
}
