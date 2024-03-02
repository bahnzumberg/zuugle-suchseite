import * as React from "react";
import { lazy, useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { compose } from "redux";
import { connect } from "react-redux";
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
import CircularProgress from "@mui/material/CircularProgress";
import TourMapContainer from "../../components/Map/TourMapContainer";
import * as PropTypes from "prop-types";
import { loadGPX } from "../../actions/fileActions";
import { IconButton, Typography } from "@mui/material";
import {
  checkIfSeoPageCity,
  // checkIfSeoPageRange,
  getPageHeader,
  getCityLabel,
} from "../../utils/seoPageHelper";
import { loadRanges } from "../../actions/rangeActions";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import ArrowBefore from "../../icons/ArrowBefore";

const Search = lazy(() => import("../../components/Search/Search"));
const TourCardContainer = lazy(() =>
  import("../../components/TourCardContainer")
);


function Fragment(props) {
  return null;
}

Fragment.propTypes = { children: PropTypes.node };

export function Main({
  loadTours,
  loadTour,
  loadAllCities,
  tours,
  showModal,
  hideModal,
  totalTours,
  loadTourConnections,
  filter,
  pageTours,
  loading,
  allCities,
  clearTours,
  allRanges,
  loadRanges,
  // loadFilter,
  // isLoadingFilter,
  // loadGPX,
  // loadTour,
  // loadTourConnectionsExtended,
}) {


try {
  if (typeof filter === "string" && filter.length > 0) {
    filter = JSON.parse(filter);
    // Valid JSON data
  } else if (typeof filter === "object") {
    // Object is already valid --> do nothing
  } else {
    filter = {};
  }
} catch (error) {
  // case of JSON parsing error
  console.error(" Main : Error parsing JSON:", error);
  filter = {}; 
}


  const navigate = useNavigate();
  const location = useLocation();
  const { t }    = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [mapView, setMapView]           = useState(false);
  const [directLink, setDirectLink]     = useState(null);
  const [tourID, setTourID]             = useState(null);
  const [activeFilter, setActiveFilter] = useState(false); // State used inside Search and TourCardContainer
 
  const [filterValues, setFilterValues] = useState(null); // pass this to both Search and TourCardContainer
  const [counter, setCounter] = useState(null); 


  const handleArrowClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete('range');
    navigate({ search: `?${currentParams.toString()}` });
  };

  let filterCountLocal = !!localStorage.getItem("filterCount") ? localStorage.getItem("filterCount") : null;
  let filterValuesLocal = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : null; 

  let cityLabel ="";

  //describe:
  // this useEffect sets up the initial state for the component by loading cities and ranges data and setting up search param in local state (searchParams)
  //details:
  // code sets up a React useEffect hook that runs only once when the component is mounted. The hook performs several operations:
  // It calls the loadAllCities function, which loads a list of all cities from table cities , it goes through loadAllCities() in cityActions.js which in turn calls loadList() fcn in crudActions.js, this fcn makes an axios call to the database and sets the store state accordingly.
  // It calls the loadRanges function with two options: ignore_limit and remove_duplicates, which loads the ranges data into the store state using loadRanges() inside rangeActions.js which in turn uses loadList() fcn in crudActions.js .
  // It gets the city value from local storage and the city search parameter from the URL query string, if it exists.
  // If there is a city value in local storage and no city search parameter in the URL query string, it sets the city search parameter in the URL query string to the value in local storage using the setSearchParams state method.
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
    if(!!location && !!allCities && allCities.length > 0){
      cityLabel = location && allCities ? t(`${getCityLabel(location, allCities)}`) : "VV";
      getPageHeader({ header: `Zuugli boy ${cityLabel}` });
    }
  },[allCities,location])

  
  useEffect(() => {
    var _mtm = window._mtm = window._mtm || [];
    _mtm.push({'pagetitel': "Suche"});
  }, []);


  useEffect(() => {
    if (
      !!location &&
      location.pathname &&
      allCities &&
      allCities.length > 0 
    ) {

      const city = checkIfSeoPageCity(location, allCities);
      if (!!city && city.value) {
        searchParams.set("city", city.value);
        setSearchParams(searchParams);
        setDirectLink({
          header: t(`main.oeffi_bergtouren_fuer_cityname`, { "city.label": city.label }),
          description: t(`main.alle_bergtouren_von_cityname`, { "city.label": city.label }),
        });
      }
      else if(!!!city || !!!city.value){
        setDirectLink(null);
      }
    }
    // if (location && location.pathname !== "/suche") {
    //   navigate("/");
    // }
  }, [allCities]);

  //updates the state of activeFilter, filterValues and mapView based on the searchParams and filter values whenever there is a change in either searchParams or filter.
  useEffect(() => {
    !!filterCountLocal && filterCountLocal > 0 ? setActiveFilter(true) : setActiveFilter(false);
    !!filterValuesLocal ? setFilterValues(filterValuesLocal) : setFilterValues({});
    //updates the state of mapView based on the value of map in searchParams. If map is equal to "true", then mapView is set to true, otherwise it remains set to initial value of false.
    setMapView(searchParams.get("map") == "true");
  }, [filterCountLocal,filterValuesLocal, searchParams]);

  const goToStartPage = () => {
    navigate(`/?${searchParams.toString()}`);
  };

  const onSelectTour = (tour) => {
    const city = !!searchParams.get("city") ? searchParams.get("city") : null;
    if (!!tour && !!tour.id ) {
      // if(!!city){
        loadTour(tour.id, city)
          .then((tourExtracted) => {
            if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
              localStorage.setItem("tourId", tour.id);
              // window.open("/tour?" + searchParams.toString());
            }else{
              goToStartPage();
            }
          })
    }else{
      goToStartPage();
    }
  };

  //description:
  //This is a callback function that selects a tour with a specific id
  const onSelectTourById = (id) => {
    onSelectTour({ id: id });
  };

  const memoTourMapContainer = useMemo(() => {
    return (
      <TourMapContainer
        tours={tours}
        loadGPX={loadGPX}
        onSelectTour={onSelectTourById}
        loading={loading}
        setTourID={setTourID}
        tourID={tourID}
      />
    );
  }, tourID);

 
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
            <Typography variant={"h2"} sx={{ fontSize: "14px" , color: "#fff"}}>
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
              xs: "170px",
              md: "150px",
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
                  replace
                  onClick={handleArrowClick}
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
                  activeFilter = {activeFilter}
                  filterValues = {filterValues}
                  setFilterValues = {setFilterValues}
                  counter = {counter}
                  setCounter = {setCounter}
                />
              </Box>
            </Box>
          )}
        </Box>
        <Box elevation={0} className={"header-line-main"}>
          <Box
            sx={{
              paddingTop: "51px",
              paddingBottom: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color={"black"} sx={{ textAlign: "center" }}>
              {Number(totalTours).toLocaleString()}{" "}
              {totalTours == 1 ? ` ${t("main.ergebnis")}` : ` ${t("main.ergebnisse")}`}
            </Typography>
            {(!!filterCountLocal && filterCountLocal > 0)  
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
      </Box>
      {!!loading && !!!mapView && (
        <Box sx={{ textAlign: "center", padding: "30px" }}>
          <CircularProgress />
        </Box>
      )}
      {!!tours && tours.length > 0 && (
        <>
          {/* //either display 100% size map or display the TourCardContainer */}
          {!!mapView ? (
            <Box className={"map-container"}>{memoTourMapContainer}</Box>
          ) : (
            <Box
              className={
                "cards-container" +
                (!!directLink && !!directLink.header ? " seo-page" : "")
              }
              sx={{
                marginTop: {
                  xs: "20px",
                  md: "250px",
                },
              }}
            >
              <TourCardContainer
                onSelectTour={onSelectTour}
                tours={tours}
                loadTourConnections={loadTourConnections}
                city={searchParams.get("city")}
                loadTours={loadTours}
                totalTours={totalTours}
                pageTours={pageTours}
                loading={loading}
                total={totalTours}
                filterValues={filterValues}
                setFilterValues={setFilterValues}
              />
            </Box>
          )}
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
  loadGPX,
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
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Main);
