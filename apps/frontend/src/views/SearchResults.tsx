import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import Box from "@mui/material/Box";
import DomainMenu from "../components/DomainMenu";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Search from "../components/Search/Search";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Filter from "../components/Filter/Filter";
import MaintenanceGuard from "../components/MaintenanceGuard";
import TotalToursHeader from "../components/TotalToursHeader";
import SearchParamSync from "../components/SearchParamSync";
import FavoritesToggle from "../components/Favorites/FavoritesToggle";
import FavoritesEmptyState from "../components/Favorites/FavoritesEmptyState";
import { useSearchTours } from "../hooks/useSearchTours";
import MobileQuickNav, {
  type QuickNavSection,
} from "../components/MobileQuickNav";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import { useAppDispatch } from "../hooks";
import { mapUpdated } from "../features/searchSlice";
import { useSearchParams } from "react-router";
import LegalDialog, {
  type LegalDialogType,
} from "../components/LegalDialog/LegalDialog";

const TourMapContainer = lazy(
  () => import("../components/Map/TourMapContainer"),
);

export default function SearchResults() {
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
    totals,
    isTotalsLoading,
    showMap,
    favoritesEmptyVariant,
    favoritesOnly,
  } = useSearchTours();

  const dispatch = useAppDispatch();

  /** Sections the mobile quick-nav scrolls to on the search results page. */
  const searchSections: QuickNavSection[] = useMemo(
    () => [
      {
        id: "suche",
        selector: ".search-result-header-container",
        icon: <SearchRoundedIcon sx={{ fontSize: 26 }} />,
        label: "Suche",
        alwaysShow: true,
        noAutoHighlight: true,
        focusSelector: 'input[role="combobox"]',
        skipScroll: true,
        onClick: () => {
          // Focus immediately within the user-gesture context so mobile
          // browsers open the keyboard.
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

  // Open legal dialog from ?legal=imprint|privacy query param (used by redirects)
  const [searchParams, setSearchParams] = useSearchParams();
  const [legalDialog, setLegalDialog] = useState<LegalDialogType>(null);

  useEffect(() => {
    const legal = searchParams.get("legal");
    if (legal === "imprint" || legal === "privacy") {
      setLegalDialog(legal);
    }
  }, [searchParams]);

  const closeLegalDialog = () => {
    setLegalDialog(null);
    // Remove ?legal= from URL without a navigation
    if (searchParams.has("legal")) {
      searchParams.delete("legal");
      setSearchParams(searchParams, { replace: true });
    }
  };

  // ── Mobile: scroll to results after search ──────────────────────────────
  const pendingScrollRef = useRef(false);

  const handleSearchSubmit = useCallback(() => {
    if (window.innerWidth < 600) pendingScrollRef.current = true;
  }, []);

  useEffect(() => {
    if (!pendingScrollRef.current || isToursLoading) return;
    pendingScrollRef.current = false;

    // Small delay so the DOM has time to update
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
        // No results → show map
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
    <>
      <MaintenanceGuard totals={totals} isTotalsLoading={isTotalsLoading}>
        <div>
          <SearchParamSync />
          <Filter showFilter={filterOn} setShowFilter={setFilterOn} />

          {/* Blue bar – sticky at top */}
          <Box
            className="sticky-header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              backgroundColor: "#fff",
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
                    sx={{
                      color: "#fff",
                      fontSize: "18px",
                      marginBottom: "5px",
                    }}
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
              sx={{ marginTop: { xs: "76px", md: 0, lg: "14px" } }}
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
      </MaintenanceGuard>
      <MobileQuickNav
        sections={searchSections}
        headerSelector=".sticky-header"
      />
      <LegalDialog open={legalDialog} onClose={closeLegalDialog} />
    </>
  );
}
