import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  ZoomControl,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import {
  formatMapClusterNumber,
  getDefaultBoundsForDomain,
  getMarkersBounds,
  toLatLngBounds,
  useDebouncedCallback,
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
import PopupCard from "./PopupCard";
import ClusterGroup from "./ClusterGroup";
import ResizableCircle from "./ResizableCircle";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { MapPinAreaIcon } from "@phosphor-icons/react";

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
  const { t } = useTranslation();
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
  const dispatch = useAppDispatch();

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
      iconUrl: "https://cdn.zuugle.at/img/startpunkt.png", //the acutal picture
      iconSize: [33, 45], //size of the icon
      iconAnchor: [16, 46],
    });
  };

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

  const processedMarkers = markers.map((mark) => ({
    id: mark.id,
    position: L.latLng(mark.lat, mark.lon),
    icon: createStartMarker(),
    onClick: () => setActiveMarker(mark),
  }));

  function updateBounds(bounds: L.LatLngBounds) {
    dispatch(
      boundsUpdated({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
        east: bounds.getEast(),
      }),
    );
  }

  const updateBoundsDebounced = useDebouncedCallback(updateBounds, 1000);

  function MapBoundsSync() {
    const map = useMapEvents({
      moveend() {
        updateBoundsDebounced(map.getBounds());
      },
    });

    return null;
  }

  function ClickHandler() {
    const map = useMapEvents({
      click(e) {
        setClickPosition(e.latlng);
      },
    });

    return (
      clickPosition && (
        <Popup position={clickPosition} className="area-search" autoPan={false}>
          <Button
            startIcon={<MapPinAreaIcon />}
            onClick={(e) => {
              const bounds = map.getBounds();
              const widthInMeters = map.distance(
                bounds.getNorthWest(),
                bounds.getNorthEast(),
              );
              const heightInMeters = map.distance(
                bounds.getSouthWest(),
                bounds.getNorthWest(),
              );
              const radius = Math.min(heightInMeters, widthInMeters) / 8;
              handlePoiSearch(clickPosition, radius);
              e.stopPropagation();
            }}
          >
            {t("main.areaSearchTrigger")}
          </Button>
        </Popup>
      )
    );
  }

  function handlePoiSearch(coords: L.LatLng, radius: number) {
    setClickPosition(null);
    dispatch(poiUpdated({ lat: coords.lat, lng: coords.lng, radius: radius }));
    setMarkersInvalidated(true);
  }

  function MapBoundsUpdater() {
    const map = useMap();
    const bounds = useSelector((state: RootState) => state.search.bounds);

    useEffect(() => {
      // case 1: bounds are active and no poi search is active
      if (!poi && bounds) {
        const current = map.getBounds();
        const newBounds = toLatLngBounds(bounds);

        const latDiff = Math.abs(
          current.getCenter().lat - newBounds.getCenter().lat,
        );
        const lngDiff = Math.abs(
          current.getCenter().lng - newBounds.getCenter().lng,
        );
        const threshold = 0.0001;

        if (latDiff > threshold || lngDiff > threshold) {
          map.fitBounds(newBounds, { animate: true });
        }
      }
      // case 2: poi search is active and tours are loaded
      if (poi && !markersInvalidated && !clickPosition) {
        const markerBounds = getMarkersBounds(markers);
        const poiBounds = L.latLng(poi.lat, poi.lng).toBounds(poi.radius * 3);
        markerBounds.extend(poiBounds);
        map.fitBounds(markerBounds, { animate: true });
      }
    }, [bounds, poi, markers]);

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
        {!poi && <MapBoundsSync />}
        <MapBoundsUpdater />
        <ClickHandler />

        {selectedTour && activeMarker && (
          <Popup
            key={`popup_${selectedTour.id}`}
            maxWidth={280}
            maxHeight={210}
            className="request-popup"
            offset={L.point([0, -25])}
            position={[activeMarker.lat, activeMarker.lon]}
            autoPan={false}
            eventHandlers={{
              remove: () => setActiveMarker(null),
            }}
          >
            <PopupCard tour={selectedTour} city={city?.value || ""} />
          </Popup>
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
