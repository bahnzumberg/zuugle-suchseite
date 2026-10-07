/**
 * Embed-only search results view.
 *
 * Reuses the same hooks and components as the main SearchResults page but
 * strips away everything that belongs to the standalone app: DomainMenu,
 * FavoritesToggle, LegalDialog, MaintenanceGuard (the host owns its own
 * error pages), and the SEO bar.
 *
 * The provider filter is locked via EmbedContext — see EmbedSearchParamSync.
 */

import { lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Search from "../components/Search/Search";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Filter from "../components/Filter/Filter";
import TotalToursHeader from "../components/TotalToursHeader";
import EmbedSearchParamSync from "../components/EmbedSearchParamSync";
import { useSearchTours } from "../hooks/useSearchTours";

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
    allCities,
    showMap,
  } = useSearchTours();

  return (
    <div>
      <EmbedSearchParamSync />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />

      {/* Search bar — sticky at top */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#fff",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box className={"search-result-header-container"}>
          {/* No DomainMenu, no FavoritesToggle — just the BzB logo slot */}
          <Box
            component={"div"}
            className="rowing"
            sx={{
              justifyContent: "center",
              minHeight: 46,
            }}
          />
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
