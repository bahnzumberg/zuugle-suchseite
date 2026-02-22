import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
// Importiere die Karten-Komponente jetzt dynamisch
const TourMapContainer = lazy(
  () => import("../components/Map/TourMapContainer"),
);
import debounce from "lodash.debounce";
import DomainMenu from "../components/DomainMenu";
import LanguageMenu from "../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import IconButton from "@mui/material/IconButton";
import { useGetCitiesQuery, useLazyGetToursQuery } from "../features/apiSlice";
import { Tour } from "../models/Tour";
import { RootState } from "..";
import SearchParamSync from "../components/SearchParamSync";
import { cityUpdated, mapUpdated } from "../features/searchSlice";
import { useAppDispatch } from "../hooks";
import TourCardContainer from "../components/TourCardContainer";
import Search from "../components/Search/Search";
import {
  DirectLink,
  extractCityFromLocation,
  getTranslatedCountryName,
  usePageHeader,
} from "../utils/seoPageHelper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { HideMapIcon } from "../icons/HideMapIcon";
import { useIsMobile } from "../utils/muiUtils";

import Filter from "../components/Filter/Filter";

export default function SearchResults() {
  const { t } = useTranslation();
  const filter = useSelector((state: RootState) => state.filter);
  const search = useSelector((state: RootState) => state.search);
  const showMap = useSelector((state: RootState) => state.search.map);
  const isMobile = useIsMobile();

  const [tours, setTours] = useState<Tour[]>([]);
  const [triggerLoadTours, { data: loadedTours, isFetching: isToursLoading }] =
    useLazyGetToursQuery();
  const [triggerMoreTours] = useLazyGetToursQuery();
  const [filterOn, setFilterOn] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();

  usePageHeader({
    header: `Zuugle ${t("main.ergebnisse")}`,
    description: t("main.oeffi_bergtouren_fuer_cityname", {
      "city.label": search.city?.label || t(getTranslatedCountryName()),
    }),
  });

  const debouncedTrigger = useMemo(
    () =>
      debounce((params) => {
        triggerLoadTours(params);
      }, 1000),
    [triggerLoadTours],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPageTours(1);
    setHasMore(true);
    const params = {
      city: search.citySlug || "",
      filter: filter,
      search: search.searchPhrase || "",
      bounds: search.bounds || undefined,
      map: showMap || undefined,
      provider: search.provider || undefined,
      currLanguage: search.language || undefined,
      geolocation: search.geolocation || undefined,
    };
    debouncedTrigger(params);
    // Cleanup to cancel pending debounced calls
    return () => {
      debouncedTrigger.cancel();
    };
  }, [filter, search]);

  useEffect(() => {
    setTours(loadedTours?.tours || []);
  }, [loadedTours]);

  const [pageTours, setPageTours] = useState(1);

  useEffect(() => {
    if (pageTours > 1) {
      const moreTours = triggerMoreTours({
        city: search.citySlug || "",
        filter: filter,
        search: search.searchPhrase || "",
        bounds: search.bounds || undefined,
        map: showMap || undefined,
        provider: search.provider || undefined,
        page: pageTours,
        currLanguage: search.language || undefined,
        geolocation: search.geolocation || undefined,
      }).unwrap();
      moreTours.then((data) => {
        if (!data.tours || data.tours.length === 0) {
          setHasMore(false);
          return;
        }
        setTours([...tours, ...data.tours]);
      });
    }
  }, [pageTours]);

  const [directLink, setDirectLink] = useState<DirectLink | null>(null);

  const { data: allCities = [] } = useGetCitiesQuery();

  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Suche" });
  }, []);

  useEffect(() => {
    if (!allCities) return;
    const city = extractCityFromLocation(location, allCities);
    if (city) {
      dispatch(cityUpdated(city));
      setDirectLink({
        header: t(`main.oeffi_bergtouren_fuer_cityname`, {
          "city.label": city.label,
        }),
        description: t(`main.alle_bergtouren_von_cityname`, {
          "city.label": city.label,
        }),
      });
    } else {
      setDirectLink(null);
    }
  }, [location, allCities]);

  const renderCardContainer = () => (
    <Box
      className="cards-container"
      sx={{
        padding: "25px",
      }}
    >
      <TourCardContainer
        tours={tours}
        hasMore={hasMore}
        fetchMore={() => setPageTours(pageTours + 1)}
      />
    </Box>
  );

  return (
    <div>
      <SearchParamSync isSearchResultsPage={true} />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />
      <Box sx={{ width: "100%" }} className={"search-result-header-container"}>
        {!!directLink && (
          <Box className={"seo-bar"}>
            <Typography
              variant={"h1"}
              sx={{ color: "#fff", fontSize: "18px", marginBottom: "5px" }}
            >
              {directLink.header}
            </Typography>
            <Typography variant={"h2"} sx={{ fontSize: "14px", color: "#fff" }}>
              {directLink.description}
            </Typography>
          </Box>
        )}
        <Box className="newHeader" height={"80px"} position={"relative"}>
          <Box component={"div"} className="rowing blueDiv">
            <DomainMenu />
            <LanguageMenu />
          </Box>
        </Box>
      </Box>

      {showMap && (
        <Box className={"map-container"}>
          <Suspense
            fallback={
              <Skeleton variant="rectangular" width="100%" height="100%" />
            }
          >
            <TourMapContainer
              markers={loadedTours?.markers || []}
              isLoading={isToursLoading}
            />
          </Suspense>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          backgroundColor: "#FFF",
          padding: { xs: "12px 16px", md: "16px 24px" },
          borderBottom: "1px solid #ddd",
          boxShadow: "rgba(100, 100, 111, 0.1) 0px 2px 8px 0px",
        }}
      >
        {/* Left spacer for centering on desktop */}
        <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />

        {/* Center group: Search + Results count */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 2 },
            width: { xs: "100%", md: "600px" },
          }}
        >
          <Search setFilterOn={setFilterOn} />
          {loadedTours?.total != undefined && (
            <Typography
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
                fontSize: { xs: "0.875rem", md: "1rem" },
                flexShrink: 0,
              }}
            >
              {Number(loadedTours.total).toLocaleString()}
              {loadedTours.total === 1
                ? ` ${t("main.ergebnis")}`
                : ` ${t("main.ergebnisse")}`}
            </Typography>
          )}
        </Box>

        {/* Right: Map button */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            order: { xs: -1, md: 0 },
            mb: { xs: 1.5, md: 0 },
          }}
        >
          {isMobile ? (
            <IconButton
              onClick={() => dispatch(mapUpdated(!showMap))}
              color="success"
            >
              {showMap ? <HideMapIcon /> : <MapOutlinedIcon />}
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              onClick={() => dispatch(mapUpdated(!showMap))}
              color="success"
              startIcon={showMap ? <HideMapIcon /> : <MapOutlinedIcon />}
            >
              {showMap
                ? t("main_only.kartenansicht_entfernen")
                : t("start_pages.zur_kartenansicht")}
            </Button>
          )}
        </Box>
      </Box>
      {!!tours && tours.length > 0 && renderCardContainer()}
    </div>
  );
}
