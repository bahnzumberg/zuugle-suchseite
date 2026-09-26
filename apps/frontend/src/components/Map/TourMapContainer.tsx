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
  ImageOverlay,
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
  useGetCityQuery,
  useLazyGetGPXQuery,
  useLazyGetTourQuery,
} from "../../features/apiSlice";
import { MemoizedPopupCard } from "./PopupCard";
import ClusterGroup from "./ClusterGroup";
import ResizableCircle from "./ResizableCircle";
import { MapClickHandler } from "./MapClickHandler";
import { MapBoundsUpdater } from "./MapBoundsUpdater";
import { MapBoundsSync } from "./MapBoundsSync";
import { renderToStaticMarkup } from "react-dom/server";
import { suggestionIconMap } from "../Search/SearchSuggestions";
import { theme } from "../../theme";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { assetUrl } from "../../utils/assetUrl";
import { fetchAsset } from "../../utils/fetchAsset";
import { WeatherMetadata } from "../../models/weatherOverlay";
import {
  WeatherButtonAndDays,
  WeatherLegend,
  WeatherPane,
  WeatherClassWatcher,
  MapZoomWatcher,
  FullscreenControl,
} from "./WeatherControls";

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
 * Creates a Leaflet divIcon for the selected city (home station) marker.
 * Displays a home icon on an orange background badge.
 */
function createSelectedCityIcon(): L.DivIcon {
  const bg = theme.palette.lindgruen.main;
  const homeIconHtml = renderToStaticMarkup(
    <HomeRoundedIcon
      style={{
        color: "#fff",
        fontSize: "22px",
      }}
    />,
  );

  return L.divIcon({
    html: `
      <div style="background:${bg};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.35);border:2px solid #fff;">
        ${homeIconHtml}
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
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
  const shouldFetchSelectedCity = !!city?.value && city.value !== "no-city";
  const { data: selectedCity } = useGetCityQuery(city?.value ?? "", {
    skip: !shouldFetchSelectedCity,
  });
  const searchWithType = useSelector(
    (state: RootState) => state.search.searchWithType,
  );
  const [markersInvalidated, setMarkersInvalidated] = useState(false);
  const [isUserMoving, setIsUserMoving] = useState(false);
  const dispatch = useAppDispatch();

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

  // --- Weather overlay state ---
  const [weatherMetadata, setWeatherMetadata] =
    useState<WeatherMetadata | null>(null);
  const [isWeatherActive, setIsWeatherActive] = useState(false);
  const [selectedWeatherDate, setSelectedWeatherDate] = useState<string | null>(
    null,
  );
  const [currentZoom, setCurrentZoom] = useState(7);

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

  // Load weather metadata
  useEffect(() => {
    let isMounted = true;
    fetchAsset(assetUrl("weather/weather_metadata.json"))
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: WeatherMetadata | null) => {
        if (!isMounted || !data) return;
        setWeatherMetadata(data);
        if (data.days && data.days.length > 0) {
          setSelectedWeatherDate(data.days[0].date);
        }
      })
      .catch((err) => {
        console.warn("Could not load weather metadata:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleWeather = useCallback(() => {
    setIsWeatherActive((prev) => {
      const next = !prev;
      if (next && !selectedWeatherDate && weatherMetadata?.days?.[0]) {
        setSelectedWeatherDate(weatherMetadata.days[0].date);
      }
      return next;
    });
  }, [selectedWeatherDate, weatherMetadata]);

  const activeWeatherDay = useMemo(() => {
    if (!weatherMetadata?.days) return null;
    return (
      weatherMetadata.days.find((d) => d.date === selectedWeatherDate) ??
      weatherMetadata.days[0] ??
      null
    );
  }, [weatherMetadata, selectedWeatherDate]);

  const activeOverlayUrl = useMemo(() => {
    if (!activeWeatherDay) return null;
    return assetUrl(`weather/${activeWeatherDay.file}`);
  }, [activeWeatherDay]);

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
        iconUrl: assetUrl("/img/startpunkt-map.svg"),
        iconSize: [30, 38],
        iconAnchor: [15, 38],
      }),
    [],
  );

  const selectedCityIcon = useMemo(() => createSelectedCityIcon(), []);
  const selectedCityPosition = useMemo(() => {
    if (
      typeof selectedCity?.lat !== "number" ||
      typeof selectedCity?.lon !== "number"
    ) {
      return null;
    }
    return L.latLng(selectedCity.lat, selectedCity.lon);
  }, [selectedCity?.lat, selectedCity?.lon]);
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
      className={`map-fullscreen-container ${isWeatherActive ? "weather-active-map" : ""}`}
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
        className={`leaflet-container ${isWeatherActive ? "weather-active-map" : ""}`}
        zoomSnap={1}
        maxZoom={15} //how many times you can zoom
        center={mapCenter}
        zoom={7} //zoom level --> how much it is zoomed out
        style={{ height: "100%", width: "100%" }} //Size of the map
        zoomControl={false}
      >
        <WeatherPane />
        <WeatherClassWatcher isActive={isWeatherActive} />
        <MapZoomWatcher onZoomChange={setCurrentZoom} />
        <TileLayer
          url="https://opentopo.bahnzumberg.at/{z}/{x}/{y}.png"
          maxZoom={17}
          maxNativeZoom={17}
          attribution='<a href="https://github.com/sletuffe/OpenTopoMap">&copy; OpenTopoMap-R</a> <a href="https://openmaps.fr/donate">❤️ Donation</a> <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a>'
        />
        {isWeatherActive &&
          activeOverlayUrl &&
          weatherMetadata?.bounds &&
          currentZoom <= (weatherMetadata.maxZoom ?? 12) && (
            <ImageOverlay
              key={activeOverlayUrl}
              url={activeOverlayUrl}
              bounds={weatherMetadata.bounds}
              opacity={0.65}
              pane="weatherPane"
            />
          )}
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
                      color: "#001D47",
                      opacity: isActive ? 1 : 0.7,
                      ...(isActive
                        ? {}
                        : {
                            dashArray: "8,6",
                            lineCap: "square",
                          }),
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
                      color: "#001D47",
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
                      color: "#001D47",
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

        {gpxTrack.length > 0 && (
          <Polyline
            key="gpx-track"
            pathOptions={{ weight: 6, color: "#001D47" }}
            positions={gpxTrack}
          />
        )}

        {fromtourGpxTrack.length > 0 && (
          <Polyline
            key="fromtour-track"
            pathOptions={{
              weight: 6,
              color: "#001D47",
              opacity: 1,
              // opacity: !!totourGpxTrack ? 0.5 : 1,
              lineCap: "square",
              dashArray: "5,10",
              dashOffset: "0",
            }}
            positions={fromtourGpxTrack}
          />
        )}

        {totourGpxTrack.length > 0 && (
          <Polyline
            key="totour-track"
            pathOptions={{
              weight: 6,
              color: "#001D47",
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

        {selectedCityPosition && (
          <LeafletMarker
            key={`selected-city-${city?.value ?? ""}`}
            position={selectedCityPosition}
            icon={selectedCityIcon}
          >
            <Tooltip direction="top" offset={[0, -22]}>
              {selectedCity?.label ?? city?.label}
            </Tooltip>
          </LeafletMarker>
        )}

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
        <WeatherButtonAndDays
          metadata={weatherMetadata}
          isActive={isWeatherActive}
          selectedDate={selectedWeatherDate}
          currentZoom={currentZoom}
          onToggleActive={toggleWeather}
          onSelectDate={setSelectedWeatherDate}
        />
        <WeatherLegend metadata={weatherMetadata} isActive={isWeatherActive} />
      </MapContainer>
    </Box>
  );
}
