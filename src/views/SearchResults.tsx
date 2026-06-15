import { lazy, Suspense, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import DomainMenu from "../components/DomainMenu";
import LanguageMenu from "../components/LanguageMenu";
import MapBtn from "../components/Search/MapBtn";
import TourCardContainer from "../components/TourCardContainer";
import Search from "../components/Search/Search";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Filter from "../components/Filter/Filter";
import TotalToursHeader from "../components/TotalToursHeader";
import SearchParamSync from "../components/SearchParamSync";
import { useSearchTours } from "../hooks/useSearchTours";
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
    showMap,
  } = useSearchTours();

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

  return (
    <div>
      <SearchParamSync isSearchResultsPage={true} />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />

      {/* Blue bar – sticky at top */}
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
      <LegalDialog open={legalDialog} onClose={closeLegalDialog} />
    </div>
  );
}
