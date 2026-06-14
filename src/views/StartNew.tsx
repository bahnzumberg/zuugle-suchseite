import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import DomainMenu from "../components/DomainMenu";
import LanguageMenu from "../components/LanguageMenu";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Search from "../components/Search/Search";
import { getTLD } from "../utils/globals";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Filter from "../components/Filter/Filter";
import TotalToursHeader from "../components/TotalToursHeader";
import BackgroundImageLoader from "./Start/BackgroundImageLoader";
import SearchParamSync from "../components/SearchParamSync";
import { useSearchTours } from "../hooks/useSearchTours";

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
    showMap,
  } = useSearchTours();

  const tld = getTLD();

  // Refs for measuring and scroll detection
  const heroRef = useRef<HTMLDivElement>(null);
  const fixedBarRef = useRef<HTMLDivElement>(null);
  const blueBarHeaderRef = useRef<HTMLDivElement>(null);

  // The sticky top position = blue bar header height - 50px (search bar overlap)
  const [stickyTop, setStickyTop] = useState(63); // sensible fallback
  const [showFixedBar, setShowFixedBar] = useState(false);

  // Measure the blue bar header height to compute the sticky snap position
  useEffect(() => {
    if (!blueBarHeaderRef.current) return;
    const measure = () => {
      if (blueBarHeaderRef.current) {
        setStickyTop(blueBarHeaderRef.current.offsetHeight - 50);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(blueBarHeaderRef.current);
    return () => observer.disconnect();
  }, []);

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

  return (
    <div>
      <SearchParamSync isSearchResultsPage={false} />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />

      {/* Fixed blue bar – always rendered for measurement, visibility toggled.
          Appears instantly when the hero's sticky search bar reaches snap position. */}
      <Box
        ref={fixedBarRef}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          visibility: showFixedBar ? "visible" : "hidden",
          pointerEvents: showFixedBar ? "auto" : "none",
          backgroundColor: "#fff",
          borderBottom: showFixedBar ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
        }}
      >
        <Box
          ref={blueBarHeaderRef}
          className={"search-result-header-container"}
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
            <LanguageMenu />
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
            <Search setFilterOn={setFilterOn} />
          </Box>
        )}
        <TotalToursHeader loadedTours={loadedTours} setFilterOn={setFilterOn} />
      </Box>

      {/* Hero section – scrolls normally */}
      <Box ref={heroRef}>
        <BackgroundImageLoader sx={{ position: "relative" }} tld={tld}>
          <Box className="rowing">
            <DomainMenu />
            <LanguageMenu />
          </Box>
          <Box className="header-text">
            <Typography variant="h1">{getHeroTitle()}</Typography>
          </Box>
        </BackgroundImageLoader>

        {/* Sticky search bar – starts at hero bottom, scrolls up,
            then snaps at the blue bar position (stickyTop).
            When snapped, the fixed blue bar appears behind it. */}
        <Box
          sx={{
            position: "sticky",
            top: `${stickyTop}px`,
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
              <Search setFilterOn={setFilterOn} />
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
          sx={{ marginTop: { xs: 0, md: 0, lg: "14px" } }}
        >
          <TourCardContainer
            tours={tours}
            hasMore={hasMore}
            fetchMore={fetchMore}
          />
        </Box>
      )}
      <MapBtn />
    </div>
  );
}
