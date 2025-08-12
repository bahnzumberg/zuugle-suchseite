import * as React from "react";
import { lazy, useEffect, useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadTour, loadTours } from "../../actions/tourActions";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import TourMapContainer from "../../components/Map/TourMapContainer";
import { Typography } from "@mui/material";
import {
  checkIfSeoPageCity,
  getPageHeader,
  getCityLabel,
} from "../../utils/seoPageHelper";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import ArrowBefore from "../../icons/ArrowBefore";
import MapBtn from "../../components/Search/MapBtn";
import "/src/config.js";
import { FilterObject } from "../../components/Filter/Filter";
import { Tour } from "../../components/TourCard";
import { useGetCitiesQuery, useGetTotalsQuery } from "../../features/apiSlice";

const Search = lazy(() => import("../../components/Search/Search"));
const TourCardContainer = lazy(
  () => import("../../components/TourCardContainer"),
);

export interface MainProps {
  loadTours: any;
  loadTour: any;
  tours: any;
  filter: FilterObject;
  pageTours: any;
  loading: boolean;
}

export function Main({
  loadTours,
  loadTour,
  tours,
  filter,
  pageTours,
  loading,
}: MainProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [directLink, setDirectLink] = useState(null);

  const [activeFilter, setActiveFilter] = useState(false); // State used inside Search and TourCardContainer

  const [filterValues, setFilterValues] = useState(
    localStorage.getItem("filterValues") ?? null,
  ); // pass this to both Search and TourCardContainer
  //initial value for filterValues should be
  // console.log("L54 filterValues :", filterValues)

  const [counter, setCounter] = useState(0);

  const [mapInitialized, setMapInitialized] = useState(false); //MAP

  const [showMap, setShowMap] = useState(false); //MAP
  const [mapBounds, setMapBounds] = useState(null); //MAP
  const [markersChanged, setMarkersChanged] = useState(false); //MAP
  const [showCardContainer, setShowCardContainer] = useState(true); //MAP
  const [filterOn, setFilterOn] = useState(false);

  const isMobile = useMediaQuery("(max-width:678px)");

  const filterValuesLocal = localStorage.getItem("filterValues")
    ? localStorage.getItem("filterValues")
    : null;

  const { data: allCities = [] } = useGetCitiesQuery({});
  const { totalTours } = useGetTotalsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      totalTours: data?.total_tours ?? 0,
    }),
  });

  //MAP  setting showMap
  useEffect(() => {
    setShowMap(searchParams.get("map") === "true" ? true : false);
  }, [searchParams]);

  useEffect(() => {
    const searchParamCity = searchParams.get("city");
    const city = localStorage.getItem("city");
    if (!!city && !searchParamCity) {
      searchParams.set("city", city);
      setSearchParams(searchParams);
    }
  }, []);

  useEffect(() => {
    if (!!location && !!allCities && allCities.length > 0) {
      const cityLabel =
        location && allCities
          ? t(`${getCityLabel(location, allCities)}`)
          : "VV";
      getPageHeader({ header: `Zuugli boy ${cityLabel}` });
    }
  }, [allCities, location]);

  useEffect(() => {
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Suche" });
  }, []);

  useEffect(() => {
    if (!!location && location.pathname && allCities && allCities.length > 0) {
      const city = checkIfSeoPageCity(location, allCities);
      if (!!city && city.value) {
        searchParams.set("city", city.value);
        setSearchParams(searchParams);
        setDirectLink({
          header: t(`main.oeffi_bergtouren_fuer_cityname`, {
            "city.label": city.label,
          }),
          description: t(`main.alle_bergtouren_von_cityname`, {
            "city.label": city.label,
          }),
        });
      } else if (!city || !city.value) {
        setDirectLink(null);
      }
    }
  }, [allCities]);

  //updates the state of the boolean activeFilter based on localStorage values of "filterValues" .
  useEffect(() => {
    const _filterCountLocal = getFilterCount();
    !!_filterCountLocal && _filterCountLocal > 0
      ? setActiveFilter(true)
      : setActiveFilter(false);
    !!filterValuesLocal
      ? setFilterValues(filterValuesLocal)
      : setFilterValues({});
  }, [filterValuesLocal, searchParams]);

  const getFilterCount = () => {
    const filterCountLocal = localStorage.getItem("filterCount")
      ? localStorage.getItem("filterCount")
      : null;

    return filterCountLocal;
  };

  const backBtnHandler = (e) => {
    e.preventDefault();
    if (searchParams.get("map")) {
      searchParams.delete("map");
    }
    if (searchParams.get("range")) {
      searchParams.delete("range");
    }
    setSearchParams(searchParams);
    goToStartPage();
  };

  const goToStartPage = () => {
    //remove map param here
    navigate(`/?${searchParams.toString()}`, { replace: true });
  };

  const onSelectTour = (tour: Tour) => {
    const city = searchParams.get("city") ? searchParams.get("city") : null;
    if (!!tour && !!tour.id) {
      loadTour(tour.id, city).then((tourExtracted) => {
        if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
          localStorage.setItem("tourId", tour.id);
          // window.open("/tour?" + searchParams.toString());
        } else {
          goToStartPage();
        }
      });
    } else {
      goToStartPage();
    }
  };

  //with id only // as code enhancement,create one function for both map and card containers
  const onSelectMapTour = async (markerId) => {
    const city = !!searchParams.get("city") ? searchParams.get("city") : null;
    const id = markerId.id;
    let retTour = null;
    if (!!id) {
      await loadTour(id, city).then((tourExtracted) => {
        if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
          retTour = tourExtracted;
          localStorage.setItem("tourId", id);
        } else {
          goToStartPage();
        }
      });
      return retTour;
    } else {
      goToStartPage();
    }
  };

  //Map-related : a callback function that selects a tour with a specific id
  const onSelectTourById = useCallback((id: number) => {
    const resultedData = onSelectMapTour({ id: id });
    return resultedData;
  }, []);

  //Map-related : callback to set the state of "mapBounds" inside Map Container
  const handleMapBounds = useCallback((bounds) => {
    setMapBounds(bounds);
  }, []);

  //Map-related : callback to set the state of "markersChanged" inside Map Container
  const handleChangedMarkers = useCallback((value) => {
    setMarkersChanged(value);
  }, []);

  //Map-related : callback to set the state of "markersChanged" inside Map Container
  const handleShowCardContainer = useCallback((value) => {
    setShowCardContainer(value);
  }, []);

  const memoTourMapContainer = useMemo(() => {
    return (
      <TourMapContainer
        tours={tours}
        filter={filter}
        setMapInitialized={setMapInitialized}
        mapInitialized={mapInitialized}
        loadTour={loadTour}
        onSelectTour={onSelectTourById}
        handleMapBounds={handleMapBounds}
        handleChangedMarkers={handleChangedMarkers}
        setMapBounds={setMapBounds}
        mapBounds={mapBounds}
        handleShowCardContainer={handleShowCardContainer}
      />
    );
  }, [filter, tours, totalTours]);
  // }, [filter, tours, totalTours, mapBounds]);

  const toggleMapHandler = () => {
    if (searchParams.has("map") && searchParams.get("map") === "true") {
      // removeMapParam
      searchParams.delete("map");
      //add filter values from localStorage ?  here or inside the mapcontainer ?
      setSearchParams(searchParams);
      setShowMap(false);
    } else {
      searchParams.set("map", true);
      //add filterValues from localStorage ? here or inside the mapcontainer ?
      setSearchParams(searchParams);
      setShowMap(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderCardContainer = () => (
    <Box
      className="cards-container"
      sx={{
        marginTop: {
          xs: marginTopCards,
          md: marginTopCards,
        },
        padding: "25px",
      }}
    >
      <TourCardContainer
        onSelectTour={onSelectTour}
        tours={tours}
        city={searchParams.get("city")}
        loadTours={loadTours}
        pageTours={pageTours}
        loading={loading}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        showMap={showMap} //to be used for other features
        mapBounds={mapBounds}
        markersChanged={markersChanged}
        isMobile={isMobile}
      />
    </Box>
  );

  let marginTopCards = showMap ? "20px" : "180px";

  const totalToursHeader = () => (
    <Box elevation={0} className={"header-line-main"} sx={{ width: "100%" }}>
      <Box
        sx={{
          paddingTop: showMap ? "3.3%" : "10.2%",
          paddingBottom: "5.5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "@media (min-width: 900px)": {
            paddingTop: showMap ? "1.42%" : "2.36%",
            // paddingTop: largeScreenPaddingTop,
          },
        }}
      >
        {!!totalTours && (
          <>
            <Typography
              color={"black"}
              sx={{ textAlign: "center", paddingTop: "0px" }}
            >
              {!!showCardContainer ? Number(totalTours).toLocaleString() : " "}{" "}
              {totalTours === 1
                ? ` ${t("main.ergebnis")}`
                : ` ${t("main.ergebnisse")}`}
            </Typography>
            {getFilterCount() && getFilterCount() > 0 && (
              <Box display={"flex"} alignItems={"center"}>
                &nbsp;{" - "}&nbsp;
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#FF7663",
                    fontWeight: "600",
                    mr: "2px",
                  }}
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
        {/* new top header */}
        {/* {getPageHeader({ header: `Zuugle ${cityLabel}` })} */}
        <Box
          className="newHeader"
          sx={{
            height: {
              xs: "110px",
              md: "110px",
            },
          }}
          position={"relative"}
        >
          <Box component={"div"} className="rowing blueDiv">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: "16px", cursor: "pointer" }}>
                <Link
                  to={{
                    pathname: "/",
                  }}
                  onClick={backBtnHandler}
                  replace
                >
                  <ArrowBefore
                    style={{ stroke: "#fff", width: "34px", height: "34px" }}
                  />
                </Link>
              </Box>
              <DomainMenu />
            </Box>
            <LanguageMenu pageKey="main" />
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
              <Box elevation={1} className={"colCenter"}>
                <Search
                  isMain={true}
                  page="main"
                  activeFilter={activeFilter}
                  filterValues={filterValues}
                  setFilterValues={setFilterValues}
                  counter={counter}
                  setCounter={setCounter}
                  mapBounds={mapBounds}
                  filterOn={filterOn}
                  setFilterOn={setFilterOn}
                />
              </Box>
            </Box>
          )}
        </Box>
        {!showMap && totalToursHeader()}
      </Box>

      {/* {!!tours && tours.length > 0 && ( */}
      {!!totalTours && totalTours > 0 ? (
        <>
          {!!showMap ? (
            <>
              <Box className={"map-container"}>{memoTourMapContainer}</Box>
              {totalToursHeader()}
              {!!tours && tours.length > 0 && (
                <>
                  {showCardContainer && renderCardContainer()}
                  <MapBtn
                    showMap={showMap}
                    onClick={toggleMapHandler}
                    btnSource="main"
                  />
                </>
              )}
            </>
          ) : (
            !!tours &&
            tours.length > 0 &&
            showCardContainer && (
              <>
                {renderCardContainer()}
                <MapBtn
                  showMap={showMap}
                  onClick={toggleMapHandler}
                  btnSource="main"
                />
              </>
            )
          )}
        </>
      ) : (
        <>
          {!!showMap && memoTourMapContainer}
          {!!showMap && totalToursHeader()}
        </>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  loadTours,
  loadTour,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    tours: state.tours.tours,
    allRanges: state.ranges.ranges,
    filter: state.tours.filter,
    pageTours: state.tours.page,
    tour: state.tours.tour,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Main);
