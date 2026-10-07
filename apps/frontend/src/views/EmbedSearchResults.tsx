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
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Search from "../components/Search/Search";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Filter from "../components/Filter/Filter";
import TotalToursHeader from "../components/TotalToursHeader";
import EmbedSearchParamSync from "../components/EmbedSearchParamSync";
import FavoritesToggle from "../components/Favorites/FavoritesToggle";
import FavoritesEmptyState from "../components/Favorites/FavoritesEmptyState";
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
    showMap,
    favoritesEmptyVariant,
  } = useSearchTours();

  return (
    <div style={{ width: "100%" }}>
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
        <Box
          sx={{
            pt: 0,
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
            <Search setFilterOn={setFilterOn} />
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
            marginTop: { xs: 0, md: 0, lg: "14px" },
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
    </div>
  );
}
