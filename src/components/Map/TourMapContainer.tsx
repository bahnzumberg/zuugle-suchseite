import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  ZoomControl,
  Marker as LeafletMarker,
  Tooltip,
  useMap,
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
import { getTopLevelDomain } from "../../utils/globals";
import { Tour } from "../../models/Tour";
import { Marker } from "../../models/mapTypes";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import {
  boundsUpdated,
  geolocationUpdated,
  searchWithTypeUpdated,
} from "../../features/searchSlice";
import {
  PoiResult,
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
import { renderToStaticMarkup } from "react-dom/server";
import { suggestionIconMap } from "../Search/SearchSuggestions";
import { theme } from "../../theme";

// Re-export Marker for backward compatibility
export type { Marker };

/**
 * Creates a Leaflet divIcon for a POI based on its type.
 * Renders the MUI icon as HTML and wraps it in a styled container.
 */
function createPoiIcon(type: PoiResult["type"]): L.DivIcon {
  const pinColor = theme.palette.primary.dark;
  const iconColor = "#ffff";
  const IconComponent = suggestionIconMap[type] as
    | React.ElementType
    | undefined;
  const iconHtml = IconComponent
    ? renderToStaticMarkup(
        <IconComponent
          style={{ width: "20px", height: "20px", color: iconColor }}
        />,
      )
    : `<span style="font-size: 15px; font-weight: 700; color: ${iconColor}; line-height: 1;">?</span>`;

  return L.divIcon({
    html: `
      <div style="width: 38px; height: 48px; position: relative; display: flex; align-items: center; justify-content: center;">
        <svg width="38" height="48" viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg" style="position: absolute; inset: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.22));">
          <path d="M19 46C19 46 5 31 5 18.5C5 11.6 11.1 6 19 6C26.9 6 33 11.6 33 18.5C33 31 19 46 19 46Z" fill="${pinColor}" stroke="rgba(0,0,0,0.16)"/>
        </svg>
        <div style="position: absolute; top: 9px; left: 9px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
          ${iconHtml}
        </div>
      </div>
    `,
    className: "",
    iconSize: [38, 48],
    iconAnchor: [19, 46],
    popupAnchor: [0, -40],
  });
}

/**
 * Invalidates the map size when the trigger value changes (e.g. fullscreen toggle).
 */
function MapSizeInvalidator({ trigger }: { trigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) {
      setTimeout(() => map.invalidateSize(), 150);
    }
  }, [trigger, map]);
  return null;
}

/**
 * Leaflet Control: Fullscreen toggle button rendered inside the map.
 */
function FullscreenControl({
  isFullscreen,
  onToggle,
}: {
  isFullscreen: boolean;
  onToggle: () => void;
}) {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent map interactions from propagating through the button
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
  }, [map]);

  return (
    // leaflet-top leaflet-left positions the div in the top-left corner.
    // marginTop of 38px compensates for the -38px margin-top on .map-container
    // which causes the top of the map to be visually hidden behind the white bar.
    <div
      className="leaflet-top leaflet-left"
      style={{ pointerEvents: "auto", marginTop: "38px" }}
    >
      <div ref={containerRef} className="leaflet-control leaflet-bar">
        <button
          onClick={onToggle}
          title={isFullscreen ? "Vollbild beenden" : "Vollbild"}
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#333">
            {isFullscreen ? (
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            ) : (
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

export interface TourMapContainerProps {
  markers: Marker[];
  pois: PoiResult[];
  isLoading: boolean;
}

/**
 * Displays map with markers of tours. Updates bounds which triggers an update of loaded tours in SearchResults.
 */
export default function TourMapContainer({
  markers,
  pois,
  isLoading,
}: TourMapContainerProps) {
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
  const geolocation = useSelector(
    (state: RootState) => state.search.geolocation,
  );
  const city = useSelector((state: RootState) => state.search.city);
  const searchWithType = useSelector(
    (state: RootState) => state.search.searchWithType,
  );
  const [markersInvalidated, setMarkersInvalidated] = useState(false);
  const [isUserMoving, setIsUserMoving] = useState(false);
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const provider = searchParams.get("p");

  // --- Multi-track state ---
  const [allGpxTracks, setAllGpxTracks] = useState<
    Record<
      number,
      {
        gpx: L.LatLngExpression[];
        totour: L.LatLngExpression[];
        fromtour: L.LatLngExpression[];
      }
    >
  >({});
  const loadingRef = useRef<Set<number>>(new Set());
  const loadedTrackIdsRef = useRef<Set<number>>(new Set());

  // --- Fullscreen state ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenTrigger, setFullscreenTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldShowTracks = markers.length < 30 && markers.length > 0;
  const markerIds = useMemo(
    () =>
      markers
        .map((m) => m.id)
        .sort((a, b) => a - b)
        .join(","),
    [markers],
  );

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

  // --- Load GPX tracks for all visible markers when zoomed in ---
  useEffect(() => {
    if (!shouldShowTracks) return;

    let cancelled = false;

    const markersToLoad = markers.filter(
      (m) =>
        !loadedTrackIdsRef.current.has(m.id) && !loadingRef.current.has(m.id),
    );

    if (markersToLoad.length === 0) return;

    const loadAll = async () => {
      for (const marker of markersToLoad) {
        if (cancelled) return;

        loadingRef.current.add(marker.id);
        try {
          const tour = await triggerTourDetails({
            id: String(marker.id),
            city: city?.value ?? "no-city",
          }).unwrap();

          if (cancelled) return;

          const [gpx, totour, fromtour] = await Promise.all([
            tour.gpx_file
              ? triggerGPX(tour.gpx_file).unwrap()
              : Promise.resolve([] as [number, number][]),
            tour.totour_gpx_file
              ? triggerGPX(tour.totour_gpx_file).unwrap()
              : Promise.resolve([] as [number, number][]),
            tour.fromtour_gpx_file
              ? triggerGPX(tour.fromtour_gpx_file).unwrap()
              : Promise.resolve([] as [number, number][]),
          ]);

          if (cancelled) return;

          loadedTrackIdsRef.current.add(marker.id);
          setAllGpxTracks((prev) => ({
            ...prev,
            [marker.id]: { gpx, totour, fromtour },
          }));
        } catch (err) {
          console.error(`Error loading tracks for marker ${marker.id}:`, err);
        } finally {
          loadingRef.current.delete(marker.id);
        }
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [shouldShowTracks, markerIds, city]);

  // --- Fullscreen handling ---
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      setFullscreenTrigger((prev) => prev + 1);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const createClusterCustomIcon = useCallback((cluster: L.MarkerCluster) => {
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
  }, []);

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

  const handleGeolocationSearch = useCallback(
    (coords: L.LatLng, radius: number) => {
      setClickPosition(null);
      dispatch(
        geolocationUpdated({ lat: coords.lat, lng: coords.lng, radius }),
      );
      // if search with type hut or peak is active, clear it
      if (searchWithType?.type === "hut" || searchWithType?.type === "peak") {
        dispatch(searchWithTypeUpdated(null));
      }
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
      ref={containerRef}
      className="map-fullscreen-container"
      style={{
        height: isFullscreen ? "100vh" : "600px",
        maxHeight: isFullscreen ? "none" : "60vh",
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
          maxZoom={17}
          maxNativeZoom={17}
          attribution='<a href="https://github.com/sletuffe/OpenTopoMap">&copy; OpenTopoMap-R</a> <a href="https://openmaps.fr/donate">❤️ Donation</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a>'
        />
        {!geolocation && pois.length === 0 && (
          <MapBoundsSync
            setIsUserMoving={setIsUserMoving}
            updateBounds={updateBounds}
          />
        )}
        <MapBoundsUpdater
          isUserMoving={isUserMoving}
          geolocation={geolocation}
          markers={markers}
          pois={pois}
          markersInvalidated={markersInvalidated}
        />
        <MapClickHandler
          clickPosition={clickPosition}
          setClickPosition={setClickPosition}
          handlePoiSearch={handleGeolocationSearch}
        />
        <MemoizedPopupCard
          tour={selectedTour}
          city={city?.value || ""}
          provider={provider}
          activeMarker={activeMarker}
          setActiveMarker={setActiveMarker}
        />

        {/* Multi-track polylines (all visible tracks when < 30 markers) */}
        {shouldShowTracks &&
          markers.map((marker) => {
            const tracks = allGpxTracks[marker.id];
            if (!tracks) return null;
            const handleTrackClick = () => handleMarkerClick(marker);
            const isActive = activeMarker?.id === marker.id;
            return (
              <Fragment key={`multi-${marker.id}`}>
                {tracks.gpx.length > 0 && (
                  <Polyline
                    className="track-clickable"
                    pathOptions={{
                      weight: isActive ? 6 : 4,
                      color: "#FF7663",
                      opacity: isActive ? 1 : 0.7,
                    }}
                    positions={tracks.gpx}
                    eventHandlers={{ click: handleTrackClick }}
                  />
                )}
                {tracks.totour.length > 0 && (
                  <Polyline
                    className="track-clickable"
                    pathOptions={{
                      weight: isActive ? 6 : 4,
                      color: "#FF7663",
                      opacity: isActive ? 1 : 0.7,
                      dashArray: "5,10",
                      dashOffset: "1",
                      lineCap: "square",
                    }}
                    positions={tracks.totour}
                    eventHandlers={{ click: handleTrackClick }}
                  />
                )}
                {tracks.fromtour.length > 0 && (
                  <Polyline
                    className="track-clickable"
                    pathOptions={{
                      weight: isActive ? 6 : 4,
                      color: "#FF7663",
                      opacity: isActive ? 1 : 0.7,
                      dashArray: "5,10",
                      dashOffset: "0",
                      lineCap: "square",
                    }}
                    positions={tracks.fromtour}
                    eventHandlers={{ click: handleTrackClick }}
                  />
                )}
              </Fragment>
            );
          })}

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
            chunkedLoading: false,
            showCoverageOnHover: false,
            removeOutsideVisibleBounds: true,
          }}
        />

        {/* Render POI markers */}
        {pois.map((poi) => (
          <LeafletMarker
            key={`poi-${poi.type}-${poi.lat}-${poi.lon}`}
            position={L.latLng(poi.lat, poi.lon)}
            icon={createPoiIcon(poi.type)}
          >
            <Tooltip direction="top" offset={[0, -36]}>
              {poi.name}
            </Tooltip>
          </LeafletMarker>
        ))}

        {geolocation && (
          <ResizableCircle
            center={geolocation}
            initialRadius={geolocation.radius}
            onRadiusChange={(radius) => {
              dispatch(geolocationUpdated({ ...geolocation, radius: radius }));
            }}
            onRemove={(map: L.Map) => {
              dispatch(geolocationUpdated(null));
              updateBounds(map.getBounds());
            }}
          />
        )}
        <ZoomControl position="bottomright" />
        <MapSizeInvalidator trigger={fullscreenTrigger} />
        <FullscreenControl
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
        />
      </MapContainer>
    </Box>
  );
}
