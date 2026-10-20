/**
 * Embed-only search results view.
 *
 * Reuses the same hooks and components as the main SearchResults page but
 * strips away everything that belongs to the standalone app: DomainMenu,
 * LegalDialog, MaintenanceGuard (the host owns its own error pages), and the
 * SEO bar.
 *
 * The provider filter is locked via EmbedContext — see EmbedSearchParamSync.
 */

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import Search from "../components/Search/Search";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Filter from "../components/Filter/Filter";
import TotalToursHeader from "../components/TotalToursHeader";
import EmbedSearchParamSync from "../components/EmbedSearchParamSync";
import FavoritesToggle from "../components/Favorites/FavoritesToggle";
import FavoritesEmptyState from "../components/Favorites/FavoritesEmptyState";
import MobileQuickNav, { QuickNavSection } from "../components/MobileQuickNav";
import { useSearchTours } from "../hooks/useSearchTours";
import { useAppDispatch } from "../hooks";
import { mapUpdated } from "../features/searchSlice";
import { useEmbed } from "../utils/embedContext";

const TourMapContainer = lazy(
  () => import("../components/Map/TourMapContainer"),
);

export default function EmbedSearchResults() {
  const {
    tours,
    loadedTours,
    isToursLoading,
    hasMore,
    fetchMore,
    filterOn,
    setFilterOn,
    showMap,
    favoritesEmptyVariant,
  } = useSearchTours();

  const dispatch = useAppDispatch();

  const { stickyTop } = useEmbed();
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollToWidgetTop = useCallback(() => {
    const container =
      rootRef.current || document.getElementById("zuugle-embed");
    if (container) {
      const rect = container.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY - stickyTop;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stickyTop]);

  /** Sections the mobile quick-nav scrolls to in embed mode. */
  const searchSections: QuickNavSection[] = useMemo(
    () => [
      {
        id: "suche",
        selector: ".sticky-header",
        icon: <SearchRoundedIcon sx={{ fontSize: 26 }} />,
        label: "Suche",
        alwaysShow: true,
        noAutoHighlight: true,
        focusSelector: 'input[role="combobox"]',
        skipScroll: true,
        onClick: () => {
          scrollToWidgetTop();
          const input = document.querySelector<HTMLInputElement>(
            'input[role="combobox"]',
          );
          input?.focus();
        },
      },
      {
        id: "karte",
        selector: ".map-fullscreen-container",
        icon: <MapOutlinedIcon sx={{ fontSize: 26 }} />,
        label: "Karte",
        alwaysShow: true,
        skipScroll: true,
        onClick: () => {
          if (!showMap) {
            dispatch(mapUpdated(true));
          }
          scrollToWidgetTop();
        },
      },
      {
        id: "touren",
        selector: ".cards-container",
        icon: <HikingRoundedIcon sx={{ fontSize: 26 }} />,
        label: "Touren",
        alwaysShow: true,
        skipScroll: true,
        onClick: () => {
          if (showMap) {
            dispatch(mapUpdated(false));
          }
          scrollToWidgetTop();
        },
      },
    ],
    [showMap, dispatch, scrollToWidgetTop],
  );

  // ── Mobile: space under map so first card tile is not visible (+10px margin) ──
  const [mobileCardsMarginTop, setMobileCardsMarginTop] = useState<number>(0);

  useEffect(() => {
    if (!showMap) {
      setMobileCardsMarginTop(0);
      return;
    }

    let rafId: number;
    const calculateMargin = () => {
      // Only applicable on mobile (< 600px)
      if (window.innerWidth >= 600) {
        setMobileCardsMarginTop(0);
        return;
      }

      const headerEl = document.querySelector<HTMLElement>(".sticky-header");
      const mapEl = document.querySelector<HTMLElement>(
        ".map-fullscreen-container",
      );

      if (!mapEl) {
        // Fallback estimate while map chunk is loading
        const estimatedHeader = headerEl ? headerEl.offsetHeight : 130;
        const estimatedMap = Math.max(300, window.innerHeight - 273);
        const estimatedBottom = stickyTop + estimatedHeader + estimatedMap;
        setMobileCardsMarginTop(
          Math.max(20, window.innerHeight - estimatedBottom),
        );
        rafId = requestAnimationFrame(calculateMargin);
        return;
      }

      const headerHeight = headerEl ? headerEl.offsetHeight : 130;
      const mapHeight = mapEl.offsetHeight;
      const mapBottomAtView = stickyTop + headerHeight + mapHeight;

      // When viewing the map at the top of the widget, map bottom is at mapBottomAtView.
      // Margin collapsing with TourMapContainer's 10px bottom margin results in
      // max(10, margin), and the first card has ~10px internal offset.
      // To ensure the first card tile is placed 10px below the viewport:
      // (mapBottomAtView + margin + 10px) >= window.innerHeight + 10px
      // => margin >= window.innerHeight - mapBottomAtView
      const neededMargin = Math.max(20, window.innerHeight - mapBottomAtView);
      setMobileCardsMarginTop(neededMargin);
    };

    calculateMargin();

    window.addEventListener("resize", calculateMargin);

    const resizeObserver = new ResizeObserver(calculateMargin);
    const headerEl = document.querySelector<HTMLElement>(".sticky-header");
    const mapEl = document.querySelector<HTMLElement>(
      ".map-fullscreen-container",
    );
    if (headerEl) resizeObserver.observe(headerEl);
    if (mapEl) resizeObserver.observe(mapEl);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", calculateMargin);
      resizeObserver.disconnect();
    };
  }, [showMap, stickyTop]);

  // ── Mobile: scroll to results after search ──────────────────────────────
  const pendingScrollRef = useRef(false);

  const handleSearchSubmit = useCallback(() => {
    if (window.innerWidth < 600) pendingScrollRef.current = true;
  }, []);

  useEffect(() => {
    if (!pendingScrollRef.current || isToursLoading) return;
    pendingScrollRef.current = false;

    // In embed mode, keep host header visible at top
    requestAnimationFrame(() => {
      scrollToWidgetTop();
    });
  }, [tours, isToursLoading, showMap, scrollToWidgetTop]);

  return (
    <div ref={rootRef} style={{ width: "100%" }}>
      <EmbedSearchParamSync />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />

      {/* Search bar — sticky at top with white background */}
      <Box
        className="sticky-header"
        sx={{
          position: "sticky",
          top: `${stickyTop}px`,
          zIndex: 100,
          backgroundColor: "#fff",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            pt: { xs: 1, sm: 1.5 },
            pb: { xs: 1, sm: 1.5 },
            px: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Spacer to keep Search centered on desktop while Favorites is on the right */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              minWidth: 0,
            }}
          />

          <Box
            sx={{
              flex: { xs: "1 1 auto", md: "0 0 650px" },
              width: { xs: "100%", md: "650px" },
              maxWidth: "650px",
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Search
              setFilterOn={setFilterOn}
              onSearchSubmit={handleSearchSubmit}
            />
          </Box>

          <Box
            sx={{
              flex: { xs: "0 0 auto", md: 1 },
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              ml: { xs: 1, sm: 1.5 },
              minWidth: 0,
            }}
          >
            <FavoritesToggle />
          </Box>
        </Box>
        <TotalToursHeader loadedTours={loadedTours} setFilterOn={setFilterOn} />
      </Box>

      {showMap && (
        <Box sx={{ width: "100%" }}>
          <Suspense
            fallback={
              <Skeleton variant="rectangular" width="100%" height="100%" />
            }
          >
            <TourMapContainer
              markers={loadedTours?.markers || []}
              pois={loadedTours?.pois || []}
              isLoading={isToursLoading}
            />
          </Suspense>
        </Box>
      )}

      {isToursLoading && tours.length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {favoritesEmptyVariant && tours.length === 0 && (
        <FavoritesEmptyState variant={favoritesEmptyVariant} />
      )}

      {!isToursLoading &&
        loadedTours &&
        !favoritesEmptyVariant &&
        tours.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="body1">Keine Touren gefunden.</Typography>
          </Box>
        )}

      {!!tours && tours.length > 0 && (
        <Box
          className="cards-container"
          sx={{
            marginTop: {
              xs:
                showMap && mobileCardsMarginTop
                  ? `${mobileCardsMarginTop}px`
                  : "20px",
              md: 0,
              lg: "14px",
            },
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <TourCardContainer
            tours={tours}
            hasMore={hasMore}
            fetchMore={fetchMore}
          />
        </Box>
      )}

      <MapBtn />

      {/* Spacer so fixed MobileQuickNav doesn't cover content on mobile */}
      <Box sx={{ height: { xs: "56px", sm: 0 } }} />
      <MobileQuickNav
        sections={searchSections}
        headerSelector=".sticky-header"
      />
    </div>
  );
}
