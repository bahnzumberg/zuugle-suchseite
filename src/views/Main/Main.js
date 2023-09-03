import * as React from "react";
import { lazy, useEffect, useState, useMemo, useCallback } from "react";
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
import { getFilterFromParams, getFilterProp } from "../../utils/globals";
import CircularProgress from "@mui/material/CircularProgress";
// import {useBackListener} from "../../utils/backListener";
import TourMapContainer from "../../components/Map/TourMapContainer";
import * as PropTypes from "prop-types";
import { loadGPX } from "../../actions/fileActions";
import { IconButton, Typography } from "@mui/material";
import {
  checkIfSeoPageCity,
  checkIfSeoPageRange,
  getPageHeader,
} from "../../utils/seoPageHelper";
import { loadRanges } from "../../actions/rangeActions";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import ClearSearchIcon from "../../icons/ClearSearchIcon";
import ClearFilterIcon from "../../icons/ClearFilterIcon";
import { ArrowLeft } from "@mui/icons-material";
import ArrowBefore from "../../icons/ArrowBefore";

// import { SearchFilter } from "../../components/SearchFilter/SearchFilter";
// import SearchContainer from "../../views/Start/SearchContainer";

const SearchFilter = lazy(() =>
  import("../../components/SearchFilter/SearchFilter")
);
// const Search = lazy(() => import("../../components/Search/Search"));
const Search = lazy(() => import("../../components/Search/Search"));
const ResultBar = lazy(() => import("../../components/ResultBar"));
const TourCardContainer = lazy(() =>
  import("../../components/TourCardContainer")
);

function Fragment(props) {
  return null;
}

Fragment.propTypes = { children: PropTypes.node };

//describe :
// imports various components from MUI, React Router, and other custom components.
// uses hooks, such as useState and useEffect, to manage component state and perform side effects.
// defines a function that counts the number of active filters in the search.
// uses the react-redux library to connect the component to the Redux store.
// defines functions that dispatch Redux actions to load tours, cities, ranges, filters, tour connections, and GPX files.
// defines functions that dispatch Redux actions to show and hide modals.
// defines a function that handles a click on a tour card to open the tour detail view.
// uses the react-router-dom library to handle navigation and URL parameters.
// defines functions that track page views and events using the Matomo tracker.
// uses the Helmet component to manage the document head of the app.
// renders various child components, such as the search bar, tour cards, and tour map.

export function Main({
  loadTours,
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
  //if filter is a string then convert to object
  if (typeof filter === "string") {
    filter = JSON.parse(filter);
    // console.log('Filter is string : ')
  } else if (typeof filter === "object") {
    filter = filter;
    // console.log('Filter is object : ')
  } else {
    filter = {};
  }
  //clgs
  // console.log("L99: Main , totalTours upon entry:",totalTours)
  // console.log("L100: Main , tours.length upon entry:",tours.length)
  // console.log("L101: Main , filter upon entry:",filter)
  // console.log("L102: Main , allCities:",allCities)
  // console.log("L103: Main , allRanges:",allRanges)

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // const { trackPageView, trackEvent } = useMatomo()

  const [detailOpen, setDetailOpen] = useState(false);
  const [tour, setTour] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterActive, setFilterActive] = React.useState(0);
  const [mapView, setMapView] = React.useState(false);
  const [directLink, setDirectLink] = React.useState(null);
  const [tourID, setTourID] = useState(null);

  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const paramsFromStartPage = new URLSearchParams(location.search);
  // alternative code for useBacklistener
  // useBackListener = () => {
  //     navigate("/");
  //   };
  // useBackListener(navigate, () => {
  //     navigate("/");
  // });
  // useBackListener(({ location }) => {
  //     navigate('/');
  // });

  //Matomo related
  // useEffect(() => {
  //     const city = searchParams.get('city');
  //     myTrackPageView("Main", trackPageView, city);
  // }, [])

  //describe:
  // this useEffect sets up the initial state for the component by loading cities and ranges data and setting up search param in local state (searchParams)
  //details:
  // code sets up a React useEffect hook that runs only once when the component is mounted. The hook performs several operations:
  // It calls the loadAllCities function, which loads a list of all cities from table cities , it goes through loadAllCities() in cityActions.js which in turn calls loadList() fcn in crudActions.js, this fcn makes an axios call to the database and sets the store state accordingly.
  // It calls the loadRanges function with two options: ignore_limit and remove_duplicates, which loads the ranges data into the store state using loadRanges() inside rangeActions.js which in turn uses loadList() fcn in crudActions.js .
  // It gets the city value from local storage and the city search parameter from the URL query string, if it exists.
  // If there is a city value in local storage and no city search parameter in the URL query string, it sets the city search parameter in the URL query string to the value in local storage using the setSearchParams state method.
  useEffect(() => {
    loadAllCities(); // working
    loadRanges({ ignore_limit: true, remove_duplicates: true }); // working
    let searchParamCity = searchParams.get("city");
    const city = localStorage.getItem("city");
    if (!!city && !!!searchParamCity) {
      searchParams.set("city", city);
      setSearchParams(searchParams);
    }
  }, []);

  //description:
  // updating the state of searchParams and directLink based on the current location object and the arrays allCities and allRanges.
  //using the location object to check if the user has landed on a specific page for a city or mountain range. If the user has landed on one of these pages, the code updates the search parameters to reflect the city or mountain range in the URL and sets the directLink object to display a specific header and description based on the page the user is on.
  useEffect(() => {
    !!location && console.log("L158: Main , location :", location);
    !!location.pathname &&
      console.log("L159: Main , location.pathname :", location.pathname);

    if (
      !!location &&
      location.pathname &&
      allCities &&
      allCities.length > 0 &&
      allRanges &&
      allRanges.length > 0
    ) {
      console.log("L169: Main, inside the if of useEffect");
      // description
      // calling the functions checkIfSeoPageCity and checkIfSeoPageRange with the current location and arrays allCities and allRanges as arguments to determine the current city and mountain range (if any) based on the pathname property of the location object.
      const city = checkIfSeoPageCity(location, allCities);
      const range = checkIfSeoPageRange(location, allRanges);
      //clg
      console.log("Main/ city:", searchParams.get("city")); // working
      !!range && console.log("Main/ range:", searchParams.get("range")); // not working, do we need it?
      if (!!city && city.value) {
        searchParams.set("city", city.value);
        setSearchParams(searchParams);
        setDirectLink({
          header: `Öffi-Bergtouren für ${city.label}`,
          description: `Alle Bergtouren, die du von ${city.label} aus, mit Bahn und Bus, erreichen kannst.`,
        });
      } else if (!!range && !!range.range) {
        searchParams.set("range", range.range);
        setSearchParams(searchParams);
        setDirectLink({
          header: `Gebirgsgruppe ${range.range}`,
          description: `Alle Bergtouren in der Gebirgsgruppe "${range.range}".`,
        });
      } else if (location && location.pathname !== "/suche") {
        navigate("/");
      }
    }
  }, [allCities && allRanges]);

  //description
  // This hook is essentially checking if the user navigated to the current page from a tour detail page, and if so, it extracts the tour object from the location state and sets it in the tour local state. The detailOpen state is set to true to open the tour detail modal by default when the page loads.
  // The hook depends on the location object, so it is set as a dependency in the dependency array. This ensures that the hook is executed whenever the location object changes, which could happen if the user navigates to a different page.
  useEffect(() => {
    if (!!location && !!location.state && !!location.state.tour) {
      setTour(location.state.tour);
      setDetailOpen(true);
    }
  }, [location]);

  //description:
  //useEffect updates the state of filterActive and mapView based on the searchParams and filter values whenever there is a change in either searchParams or filter.
  useEffect(() => {
    //description:
    //setFilterActive(countFilterActive()) updates the state of filterActive by calling the function countFilterActive() which returns the count of active filters by looping through the filter object and counting the number of properties that have a value other than null or undefined.
    setFilterActive(localStorage.getItem("activeFilter"));
    //descriptions:
    //updates the state of mapView based on the value of map in searchParams. If map is equal to "true", then mapView is set to true, otherwise it remains set to initial value of false.
    setMapView(searchParams.get("map") == "true");
  }, [searchParams || filter]);

  //descriptions:
  //calculates the number of active filters currently applied to the search results. It does this by comparing the filter options currently selected by the user to the default filter options.
  const countFilterActive = () => {
    //description:
    //The function first retrieves the current filter options from the URL search parameters using getFilterFromParams(searchParams).
    // It initializes a variable called count to 0, which will keep track of the number of active filters.
    // It then checks each filter option to see if it is different from the default filter option. If it is different, it increments the count variable.
    // Finally, the function returns the value of count.

    let count = 0;
    // console.log("L172: Main filter:",filter);

    const _filter = getFilterFromParams(searchParams);
    if (!!_filter && !!filter) {
      if (!(!!_filter?.singleDayTour && !!_filter?.multipleDayTour)) {
        count++;
      }
      if (!(!!_filter?.summerSeason && !!_filter?.winterSeason)) {
        count++;
      }
      if (_filter?.difficulty != 10) {
        count++;
      }
      if (!!_filter?.children) {
        count++;
      }
      if (!!_filter?.traverse) {
        count++;
      }
      if (
        _filter?.maxAscent != getFilterProp(filter, "maxAscent") ||
        _filter?.minAscent != getFilterProp(filter, "minAscent")
      ) {
        count++;
      }
      if (
        _filter?.maxDescent != getFilterProp(filter, "maxDescent") ||
        _filter?.minDescent != getFilterProp(filter, "minDescent")
      ) {
        count++;
      }
      if (
        _filter?.maxTransportDuration !=
          getFilterProp(filter, "maxTransportDuration") ||
        _filter?.minTransportDuration !=
          getFilterProp(filter, "minTransportDuration")
      ) {
        count++;
      }
      if (
        _filter?.minDistance != getFilterProp(filter, "minDistance") ||
        _filter?.maxDistance != getFilterProp(filter, "maxDistance")
      ) {
        count++;
      }
      if (_filter?.ranges?.length != filter?.ranges?.length) {
        count++;
      }
      if (_filter?.types?.length != filter?.types?.length) {
        count++;
      }
      if (_filter?.languages?.length != filter?.languages?.length) {
        count++;
      }
    }
    return count;
  };

  const onSelectTour = (tour) => {
    let currentSearchParams = new URLSearchParams(searchParams.toString());
    const city = currentSearchParams.get("city");
    const search = currentSearchParams.get("search");
    const updatedSearchParams = new URLSearchParams();
    updatedSearchParams.set("id", tour.id);

    if (city) {
      updatedSearchParams.set("city", city);
    }

    window.open("/tour?" + updatedSearchParams.toString());
  };

  //description:
  //This is a callback function that selects a tour with a specific id
  const onSelectTourById = (id) => {
    onSelectTour({ id: id });
  };

  // const handleClearFilter = () => {
  //   setFilterActive("")
  // }
  const memoTourMapContainer = useMemo(() => {
    // console.log("L 273 tourID : " + tourID)
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
      {/* description
        getPageHeader() is imported from seoPageHelper.js This is a function that returns a JSX element containing the page (Head Tags /meta data). The directLink prop is inside one of the useEffects() hooks above and now passed as an argument to this getPageHeader, it is used to customize the header text and link based on the current page URL.  */}
      {/* clg */}
      {/*{console.log("directLink L 230:",directLink) }*/}{" "}
      {/*  seems to be always on null value */}
      {getPageHeader(directLink)}
      <Box sx={{ width: "100%" }} className={"search-result-header-container"}>
        {!!directLink && (
          <Box className={"seo-bar"}>
            <Typography
              variant={"h1"}
              sx={{ color: "#000000", fontSize: "18px", marginBottom: "5px" }}
            >
              {directLink.header}
            </Typography>
            <Typography variant={"text"} sx={{ fontSize: "14px" }}>
              {directLink.description}
            </Typography>
          </Box>
        )}
        {/* new top header */}
        <Box
          className="newHeader"
          sx={{
            height: {
              xs: "170px",
              md: "150px",
            }, // Set the desired height for the newHeader
          }}
          position={"relative"}
        >
          <Box comoponent={"div"} className="rowing blueDiv">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ mr: "16px", cursor: "pointer" }}>
                <Link
                  to={{
                    pathname: "/",
                    search: paramsFromStartPage.toString(),
                  }}
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
                <Search isMain={true} page="main" />
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
              {totalTours}{" "}
              {totalTours == 1 ? " Ergebnis " : ` ${t("main.ergebnisse")}`}
            </Typography>
            {filterActive && (
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
                  {t("Filtered")}
                </Typography>
                {/* <Box sx={{ cursor: "pointer", display: "flex" }} onclick={() => { handleClearFilter() }}>
                  <ClearFilterIcon />
                </Box> */}
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
          {/* //description: 
                //either display 100% size map or display the TourCardContainer 
				*/}
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
              {console.log("total passed to TourCardContainer", totalTours)}
              {console.log(
                "tours.length passed to TourCardContainer",
                tours.length
              )}
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
  //clg
  // console.log("Main L333 list of ALL tours : state.tours.tours :", state.tours.tours)
  // console.log("Main L334 : Store state mapping, state.tours.total :", state.tours.total)
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
