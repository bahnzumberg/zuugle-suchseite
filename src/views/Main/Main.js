import * as React from "react";
import { lazy, useEffect, useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import { compose } from "redux";
import { connect, useSelector } from "react-redux";
import {
  clearTours,
  loadFilter,
  loadTour,
  loadTourConnections,
  loadTourConnectionsExtended,
  loadTours,
} from "../../actions/tourActions";
import { hideModal, showModal } from "../../actions/modalActions";
import { loadAllCities } from "../../actions/cityActions";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
import TourMapContainer from "../../components/Map/TourMapContainer";
import { Typography } from "@mui/material";
import {
  checkIfSeoPageCity,
  getPageHeader,
  getCityLabel,
} from "../../utils/seoPageHelper";
import { loadRanges } from "../../actions/rangeActions";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import ArrowBefore from "../../icons/ArrowBefore";
// import { consoleLog, getValuesFromParams } from "../../utils/globals";
import MapBtn from "../../components/Search/MapBtn";
// import {getMapData} from '../../actions/crudActions';
// import NoData from "../../components/NoData";
import { createIdArray } from "../../utils/map_utils";

const Search = lazy(() => import("../../components/Search/Search"));
const TourCardContainer = lazy(() =>
  import("../../components/TourCardContainer")
);

export function Main({
  loadTours,
  loadTour,
  loadAllCities,
  tours,
  totalTours,
  loadTourConnections,
  filter,
  pageTours,
  loading,
  allCities,
  loadRanges,
  tour,
  // clearTours,
  // allRanges,
  // showModal,
  // hideModal,
  // loadFilter,
  // isLoadingFilter,
  // loadTour,
  // loadTourConnectionsExtended,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [directLink, setDirectLink] = useState(null);

  const [activeFilter, setActiveFilter] = useState(false); // State used inside Search and TourCardContainer

  const [filterValues, setFilterValues] = useState(null); // pass this to both Search and TourCardContainer
  const [counter, setCounter] = useState(0);

  const [mapInitialized, setMapInitialized] = useState(false);

  const markers = useSelector((state) => state.tours.markers); // move to props

  const [scrollToTop, setScrollToTop] = useState(false);

  const [showMap, setShowMap] = useState(false);
  const [markersSubList, setMarkersSubList] = useState(createIdArray(markers));
  const [mapBounds, setMapBounds] = useState(null);
  const [markersChanged, setMarkersChanged] = useState(false);
  const [showCardContainer, setShowCardContainer] = useState(true)
  
   // filter values in localStorage:
  let filterCountLocal = !!localStorage.getItem("filterCount")
    ? localStorage.getItem("filterCount")
    : null;
  let filterValuesLocal = !!localStorage.getItem("filterValues")
    ? localStorage.getItem("filterValues")
    : null;

  useEffect(() => {
    setShowMap(searchParams.get("map") === "true" ? true : false);
  }, [searchParams]);

  // useEffect(() => {
  //   if (scrollToTop) {
  //     window.scrollTo({ top: 0 , behavior: 'smooth'});
  //   }
  // }, [scrollToTop]);
  
  
  useEffect(() => {
    loadAllCities();
    loadRanges({ ignore_limit: true, remove_duplicates: true });
    let searchParamCity = searchParams.get("city");
    const city = localStorage.getItem("city");
    if (!!city && !!!searchParamCity) {
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
    var _mtm = (window._mtm = window._mtm || []);
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
      } else if (!!!city || !!!city.value) {
        setDirectLink(null);
      }
    }
  }, [allCities]);

  //updates the state of activeFilter, filterValues based on the searchParams and filter values whenever there is a change in either searchParams or filter.
  useEffect(() => {
    !!filterCountLocal && filterCountLocal > 0
      ? setActiveFilter(true)
      : setActiveFilter(false);
    !!filterValuesLocal
      ? setFilterValues(filterValuesLocal)
      : setFilterValues({});
  }, [filterCountLocal, filterValuesLocal, searchParams]);

  const backBtnHandler = (e) => {
    e.preventDefault();
    if (!!searchParams.get("map")) {
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

  const onSelectTour = (tour) => {
    const city = !!searchParams.get("city") ? searchParams.get("city") : null;
    if (!!tour && !!tour.id) {
      // if(!!city){
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
  const onSelectTourById = useCallback((id) => {
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
        // onMarkersSubListChange={handleMarkersSubListChange}
        markersSubList={markersSubList}
        setMarkersSubList={setMarkersSubList}
        handleMapBounds={handleMapBounds}
        handleChangedMarkers={handleChangedMarkers}
        setMapBounds={setMapBounds}
        mapBounds={mapBounds}
        handleShowCardContainer={handleShowCardContainer}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, tours, totalTours, mapBounds]);

  const toggleMapHandler = () => {
    if (searchParams.has("map") && searchParams.get("map") === "true") {
      // removeMapParam
      searchParams.delete("map");
      //add filter values from localStorage ?  here or inside the mapcontainer ?
      setSearchParams(searchParams);
      setShowMap(false);
    }else{
      searchParams.set('map', true)
      //add filterValues from localStorage ? here or inside the mapcontainer ?
      setSearchParams(searchParams)
      setShowMap(true)
      }
    window.scrollTo({ top: 0 , behavior: 'smooth'});
  }

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
        loadTourConnections={loadTourConnections}
        city={searchParams.get("city")}
        loadTours={loadTours}
        pageTours={pageTours}
        loading={loading}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        showMap={showMap} //to be used for other features
        mapBounds={mapBounds}
        markersChanged={markersChanged}
      />
    </Box>
  );

  let marginTopCards = showMap ? "20px" : "255px";
  const paddingTopValue = showMap ? "3.3%" : "10.2%";
  const largeScreenPaddingTop = showMap ? "1.42%" : "2.36%";
  const paddingBottomValue = "25.5px";

  const totalToursHeader = () => (
    <Box elevation={0} className={"header-line-main"}>
          <Box
            sx={{
              // paddingTop: paddingTop,
              paddingTop: paddingTopValue,
              // paddingBottom: "25.5px",
              paddingBottom: paddingBottomValue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              '@media (min-width: 900px)': {
                paddingTop: largeScreenPaddingTop,
              },
            }}
          >
            <Typography color={"black"} sx={{ textAlign: "center",paddingTop: "0px" }}>
              {!!showCardContainer? Number(totalTours).toLocaleString() : 0}{" "}
              {totalTours === 1 ? ` ${t("main.ergebnis")}` : ` ${t("main.ergebnisse")}`}
            </Typography>
            {(!!filterCountLocal && filterCountLocal > 0 )   
            // {(!!filterCountLocal && filterCountLocal > 0 && (!!!onlyMapParams) )   
            && (
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
              // md: "165px",
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
                  <MapBtn showMap={showMap} onClick={toggleMapHandler} btnSource="main"/>
                </>
              )}
            </>
          ) : (
            !!tours &&
            tours.length > 0 && showCardContainer &&(
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
  loadAllCities,
  showModal,
  hideModal,
  loadTourConnections,
  loadTourConnectionsExtended,
  loadFilter,
  loadTour,
  clearTours,
  loadRanges,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    tours: state.tours.tours,
    allCities: state.cities.all_cities,
    allRanges: state.ranges.ranges,
    filter: state.tours.filter,
    totalTours: state.tours.total,
    pageTours: state.tours.page,
    tour: state.tours.tour,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Main);
