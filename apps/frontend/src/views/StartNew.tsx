import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import Box from "@mui/material/Box";
import DomainMenu from "../components/DomainMenu";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Search from "../components/Search/Search";
import { getTLD } from "../utils/globals";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Filter from "../components/Filter/Filter";
import MaintenanceGuard from "../components/MaintenanceGuard";
import TotalToursHeader from "../components/TotalToursHeader";
import BackgroundImageLoader from "./Start/BackgroundImageLoader";
import SearchParamSync from "../components/SearchParamSync";
import { useSearchTours } from "../hooks/useSearchTours";
import FavoritesToggle from "../components/Favorites/FavoritesToggle";
import FavoritesEmptyState from "../components/Favorites/FavoritesEmptyState";
import MobileQuickNav, {
  type QuickNavSection,
} from "../components/MobileQuickNav";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import { useAppDispatch } from "../hooks";
import { mapUpdated } from "../features/searchSlice";

const TourMapContainer = lazy(
  () => import("../components/Map/TourMapContainer"),
);

export default function StartNew() {
  const {
    tours,
    loadedTours,
    isToursLoading,
    hasMore,
    fetchMore,
    filterOn,
    setFilterOn,
    allCities,
    directLink,
    getHeroTitle,
    totals,
    isTotalsLoading,
    showMap,
    favoritesEmptyVariant,
    favoritesOnly,
  } = useSearchTours();

  const dispatch = useAppDispatch();

  /** Sections the mobile quick-nav scrolls to on the start page. */
  const startSections: QuickNavSection[] = useMemo(
    () => [
      {
        id: "suche",
        selector: ".start-search-area",
        icon: <SearchRoundedIcon sx={{ fontSize: 26 }} />,
        label: "Suche",
        alwaysShow: true,
        noAutoHighlight: true,
        focusSelector: 'input[role="combobox"]',
        skipScroll: true,
        onClick: () => {
          // Focus the visible search input immediately within the user-gesture
          // context so mobile browsers open the keyboard.  StartNew has two
          // <Search> bars (fixed + sticky); pick the one whose computed
          // visibility is not "hidden" (offsetParent doesn't catch
          // visibility:hidden).
          const inputs = document.querySelectorAll<HTMLInputElement>(
            'input[role="combobox"]',
          );
          for (const input of inputs) {
            if (window.getComputedStyle(input).visibility !== "hidden") {
              input.focus();
              return;
            }
          }
        },
      },
      {
        id: "karte",
        selector: ".map-fullscreen-container",
        icon: <MapOutlinedIcon sx={{ fontSize: 26 }} />,
        label: "Karte",
        alwaysShow: true,
        onClick: () => {
          if (!showMap) dispatch(mapUpdated(true));
        },
      },
      {
        id: "touren",
        selector: ".cards-container",
        icon: <HikingRoundedIcon sx={{ fontSize: 26 }} />,
        label: "Touren",
        alwaysShow: true,
      },
    ],
    [showMap, dispatch],
  );

  const tld = getTLD();

  // Refs for scroll detection
  const heroRef = useRef<HTMLDivElement>(null);
  const fixedBarRef = useRef<HTMLDivElement>(null);

  // Sticky snap position = blue bar header height - 50px (search bar overlap)
  const STICKY_TOP = 63;
  const [showFixedBar, setShowFixedBar] = useState(false);

  // Detect when hero has scrolled past → show fixed blue bar instantly
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current || !fixedBarRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      const barHeight = fixedBarRef.current.offsetHeight;
      setShowFixedBar(heroBottom <= barHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mobile: scroll to results after search ──────────────────────────────
  const pendingScrollRef = useRef(false);

  const handleSearchSubmit = useCallback(() => {
    if (window.innerWidth < 600) pendingScrollRef.current = true;
  }, []);

  useEffect(() => {
    if (!pendingScrollRef.current || isToursLoading) return;
    pendingScrollRef.current = false;

    requestAnimationFrame(() => {
      const headerEl = document.querySelector<HTMLElement>(".sticky-header");
      const offset = headerEl?.offsetHeight ?? 160;

      if (tours.length > 0) {
        const cards = document.querySelector(".cards-container");
        if (cards) {
          const top =
            cards.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        if (!showMap) dispatch(mapUpdated(true));
        requestAnimationFrame(() => {
          const map = document.querySelector(".map-fullscreen-container");
          if (map) {
            const top =
              map.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      }
    });
  }, [isToursLoading, tours.length, showMap, dispatch]);

  return (
    <MaintenanceGuard totals={totals} isTotalsLoading={isTotalsLoading}>
      <div>
        <SearchParamSync />
        <Filter showFilter={filterOn} setShowFilter={setFilterOn} />

        {/* Fixed blue bar – always rendered for measurement, visibility toggled.
          Appears instantly when the hero's sticky search bar reaches snap position. */}
        <Box
          ref={fixedBarRef}
          className="sticky-header"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            visibility: showFixedBar ? "visible" : "hidden",
            pointerEvents: showFixedBar ? "auto" : "none",
            backgroundColor: "#fff",
            borderBottom: showFixedBar
              ? "1px solid rgba(0, 0, 0, 0.08)"
              : "none",
          }}
        >
          <Box
            className={"search-result-header-container"}
            sx={
              favoritesOnly
                ? { backgroundColor: "var(--bzb-akelei)" }
                : undefined
            }
          >
            {!!directLink && (
              <Box className={"seo-bar"}>
                <Typography
                  variant={"h1"}
                  sx={{ color: "#fff", fontSize: "18px", marginBottom: "5px" }}
                >
                  {directLink.header}
                </Typography>
                <Typography
                  variant={"h2"}
                  sx={{ fontSize: "14px", color: "#fff" }}
                >
                  {directLink.description}
                </Typography>
              </Box>
            )}
            <Box component={"div"} className="rowing">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DomainMenu />
              </Box>
              <FavoritesToggle />
            </Box>
          </Box>
          {!!allCities && allCities.length > 0 && (
            <Box
              sx={{
                mt: "-50px",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Search
                setFilterOn={setFilterOn}
                onSearchSubmit={handleSearchSubmit}
              />
            </Box>
          )}
          <TotalToursHeader
            loadedTours={loadedTours}
            setFilterOn={setFilterOn}
          />
        </Box>

        {/* Hero section – scrolls normally */}
        <Box ref={heroRef} className="start-search-area">
          <BackgroundImageLoader sx={{ position: "relative" }} tld={tld}>
            <Box className="rowing">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DomainMenu />
              </Box>
              <FavoritesToggle />
            </Box>
            <Box className="header-text">
              <Typography variant="h1">{getHeroTitle()}</Typography>
            </Box>
          </BackgroundImageLoader>

          {/* Sticky search bar – starts at hero bottom, scrolls up,
            then snaps at the blue bar position (STICKY_TOP).
            When snapped, the fixed blue bar appears behind it. */}
          <Box
            sx={{
              position: "sticky",
              top: `${STICKY_TOP}px`,
              zIndex: 90,
              mt: "-50px",
            }}
          >
            {!!allCities && allCities.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Search
                  setFilterOn={setFilterOn}
                  onSearchSubmit={handleSearchSubmit}
                />
              </Box>
            )}
            <Box sx={{ backgroundColor: "#fff" }}>
              <TotalToursHeader
                loadedTours={loadedTours}
                setFilterOn={setFilterOn}
              />
            </Box>
          </Box>
        </Box>

        {showMap && (
          <Box>
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
        {!!tours && tours.length > 0 && (
          <Box
            className="cards-container"
            sx={{ marginTop: { xs: "20px", md: 0, lg: "14px" } }}
          >
            <TourCardContainer
              tours={tours}
              hasMore={hasMore}
              fetchMore={fetchMore}
            />
          </Box>
        )}
        {favoritesEmptyVariant && tours.length === 0 && (
          <FavoritesEmptyState variant={favoritesEmptyVariant} />
        )}
        <MapBtn />
        {/* Spacer so fixed MobileQuickNav doesn't cover content on mobile */}
        <Box sx={{ height: { xs: "56px", sm: 0 } }} />
      </div>
      <MobileQuickNav
        sections={startSections}
        headerSelector=".sticky-header"
      />
    </MaintenanceGuard>
  );
}
