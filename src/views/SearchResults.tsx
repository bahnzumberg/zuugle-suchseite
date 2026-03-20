import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Link } from "react-router";
// Importiere die Karten-Komponente jetzt dynamisch
const TourMapContainer = lazy(
  () => import("../components/Map/TourMapContainer"),
);
import debounce from "lodash.debounce";
import DomainMenu from "../components/DomainMenu";
import LanguageMenu from "../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import MapBtn from "../components/Search/MapBtn";
import { useGetCitiesQuery, useLazyGetToursQuery } from "../features/apiSlice";
import { Tour } from "../models/Tour";
import { RootState } from "..";
import SearchParamSync from "../components/SearchParamSync";
import {
  boundsUpdated,
  cityUpdated,
  mapUpdated,
} from "../features/searchSlice";
import { useAppDispatch } from "../hooks";
import TourCardContainer from "../components/TourCardContainer";
import Search from "../components/Search/Search";
import {
  DirectLink,
  extractCityFromLocation,
  getTranslatedCountryName,
  usePageHeader,
} from "../utils/seoPageHelper";
import { CustomIcon } from "../icons/CustomIcon";
import { hasContent } from "../utils/globals";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Filter from "../components/Filter/Filter";

export default function SearchResults() {
  const { t } = useTranslation();
  const filter = useSelector((state: RootState) => state.filter);
  const search = useSelector((state: RootState) => state.search);
  const showMap = useSelector((state: RootState) => state.search.map);
  const provider = useSelector((state: RootState) => state.search.provider);

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
    <Box className={"header-line-main"} sx={{ width: "100%" }}>
      <Box
        sx={{
          paddingTop: showMap ? "12px" : "2px",
          paddingBottom: "5.5px",
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
    </Box>
  );

  return (
    <div>
      <SearchParamSync isSearchResultsPage={true} />
      <Filter showFilter={filterOn} setShowFilter={setFilterOn} />
      <Box
        className={"search-result-header-container"}
        sx={{
          pb: "30px",
          zIndex: 10,
          position: "relative",
        }}
      >
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
        <Box
          component={"div"}
          className="rowing"
          sx={{
            height: "100%",
            boxSizing: "border-box",
            py: "15px",
            px: {
              xs: "15px",
              sm: "30px",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: "16px", cursor: "pointer" }}>
              <Link
                to={"/" + (provider ? `?p=${provider}` : "")}
                aria-label={t("start.zurueck")}
              >
                <CustomIcon
                  name="arrowBefore"
                  style={{ stroke: "#fff", width: "34px", height: "34px" }}
                />
              </Link>
            </Box>
            <DomainMenu />
          </Box>
          <LanguageMenu />
        </Box>
      </Box>
      {!!allCities && allCities.length > 0 && (
        <Box
          sx={{
            mt: "-30px",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            backgroundColor: "#f7f7f7",
          }}
        >
          <Search
            pageKey="search"
            isSearchResultsPage={true}
            setFilterOn={setFilterOn}
          />
        </Box>
      )}
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
      <MapBtn
        handleClick={() => {
          if (showMap) {
            dispatch(boundsUpdated(null));
          }
          dispatch(mapUpdated(!showMap));
        }}
      />
    </div>
  );
}
