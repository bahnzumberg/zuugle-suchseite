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
import { hasContent } from "../utils/globals";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { HideMapIcon } from "../icons/HideMapIcon";
import { useIsMobile } from "../utils/muiUtils";

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

  const activeFilter = useSelector(
    (state: RootState) => hasContent(filter) || state.search.geolocation,
  );

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

  const totalToursHeader = () => (
    <Box
      className={"header-line-main"}
      sx={{
        width: "100%",
        position: "relative",
        marginTop: showMap ? "0px" : "80px",
        paddingTop: showMap ? "10px" : "30px",
        paddingBottom: showMap ? "10px" : "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loadedTours?.total != undefined && (
          <>
            <Typography
              color={"black"}
              sx={{ textAlign: "center", paddingTop: "0px" }}
            >
              {Number(loadedTours.total).toLocaleString()}
              {loadedTours.total === 1
                ? ` ${t("main.ergebnis")}`
                : ` ${t("main.ergebnisse")}`}
            </Typography>
            {activeFilter && (
              <Box display={"flex"} alignItems={"center"}>
                &nbsp;{" - "}&nbsp;
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#FF7663",
                    fontWeight: "600",
                    mr: "2px",
                  }}
                  className={"cursor-link"}
                  onClick={() => setFilterOn(true)}
                >
                  {t("filter.filter")}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
      {loadedTours?.total != undefined && (
        <Box
          sx={{
            position: "absolute",
            right: { xs: "8px", md: "24px" },
            top: "50%",
            transform: "translateY(-50%)",
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
      )}
    </Box>
  );

  return (
    <div>
      <SearchParamSync isSearchResultsPage={true} />
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
          {!!allCities && allCities.length > 0 && (
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              display="inline-block"
              sx={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translate(-50%,50%)",
                backgroundColor: "#FFF",
                borderRadius: "15px",
                padding: "12px 24px",
                border: "2px solid #ddd",
                boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
                boxSizing: "border-box",
                width: {
                  md: "600px",
                  lg: "600px",
                },
                maxWidth: {
                  xs: "325px",
                  md: "600px",
                },
              }}
            >
              <Box className={"colCenter"} sx={{ zIndex: 1 }}>
                <Search
                  pageKey="search"
                  isSearchResultsPage={true}
                  setFilterOn={setFilterOn}
                  filterOn={filterOn}
                />
              </Box>
            </Box>
          )}
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
      {totalToursHeader()}
      {!!tours && tours.length > 0 && renderCardContainer()}
    </div>
  );
}
