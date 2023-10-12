import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { lazy, useEffect, useState } from "react";
import {
  loadFavouriteTours,
  loadTotalTours,
  loadTourConnections,
  loadTourConnectionsExtended,
} from "../../actions/tourActions";
import { loadAllCities, loadCities } from "../../actions/cityActions";
import { loadRanges } from "../../actions/rangeActions";
import { compose } from "redux";
import { connect } from "react-redux";
import Footer from "../../components/Footer/Footer";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router";
import FooterLinks from "../../components/Footer/FooterLinks";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import {
  getPageHeader,
  listAllCityLinks,
  listAllRangeLinks,
} from "../../utils/seoPageHelper";
const RangeCardContainer = lazy(() =>
  import("../../components/RangeCardContainer")
);
const ScrollingTourCardContainer = lazy(() =>
  import("../../components/ScrollingTourCardContainer")
);
const KPIContainer = lazy(() => import("../../components/KPIContainer"));
const AboutZuugleContainer = lazy(() =>
  import("../../components/AboutZuugleContainer")
);
const UserRecommendationContainer = lazy(() =>
  import("../../components/UserRecommendationContainer")
);
// const Header = lazy(() => import("./Header"));
const SponsoringContainer = lazy(() =>
  import("../../components/SponsoringContainer")
);

function Start({
  loadFavouriteTours,
  favouriteTours,
  loadCities,
  loadTourConnections,
  totalTours,
  loadTotalTours,
  totalConnections,
  totalCities,
  totalRanges,
  favouriteRanges,
  loadAllCities,
  allCities,
  totalProvider,
  loadRanges,
  allRanges,
  noDataAvailable,
  noToursAvailable,
  error,
}) {
  // const [showMaintenance, setShowMaintenance] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  console.log(noToursAvailable, "No Tours Available");

  const { t, i18n } = useTranslation();
  const abortController = new AbortController();

  let searchParamCity = "";
  let city = "";

  let _city = searchParams.get("city");

  useEffect(() => {
    // matomo
    _mtm.push({ pagetitel: "Startseite" });
    // network request configuration
    const requestConfig = {
      params: { domain: window.location.host },
      signal: abortController.signal,
    };
    // Async function to load data and handle requests
    const loadData = async () => {
      try {
        await loadTotalTours(requestConfig);
        await loadAllCities(requestConfig);
        await loadRanges(
          { ignore_limit: true, remove_duplicates: true },
          requestConfig
        );
        getCity();

        if (!!city && !!!searchParamCity) {
          searchParams.set("city", city);
          setSearchParams(searchParams);
        }

        await loadCities({ limit: 5 }, requestConfig);
        await loadFavouriteTours(
          {
            sort: "relevanz",
            limit: 10,
            city: !!city ? city : undefined,
            ranges: true,
            provider: searchParams.get("p"),
          },
          requestConfig
        );
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was canceled:", error.message);
        } else {
          console.error("Error loading data:", error);
        }
      }
    };

    loadData();

    // Return a cleanup function
    // return () => {
    //   // Cancel any ongoing network request when the component unmounts
    //   abortController.abort();
    // };
  }, [totalTours]);

  const getCity = () => {
    searchParamCity = searchParams.get("city");
    city = localStorage.getItem("city");
    if (!!city) {
      return city;
    } else {
      return "";
    }
  };

  const onSelectTour = (tour) => {
    let currentSearchParams = new URLSearchParams(searchParams.toString());
    const city = currentSearchParams.get("city");
    const updatedSearchParams = new URLSearchParams();

    !!tour && localStorage.setItem("tourId", tour.id);

    if (city) {
      updatedSearchParams.set("city", city);
    }
    //console.log(`"Start page ..route :`);//  '/tour?id=18117&city=bad-ischl'
    window.open(
      "/tour?" + updatedSearchParams.toString(),
      "_blank",
      "noreferrer"
    );
  };

  const onSelectRange = (range) => {
    if (!!range && !!range.range) {
      navigate(`/suche?range=${range.range}${!!_city ? "&city=" + _city : ""}`);
    }
  };

  const getRangeText = () => {
    if (!!_city && _city.length > 0) {
      return t("start.schoene_wanderungen_nahe");
    } else {
      return t("start.schoene_wanderungen");
    }
  };

  const getFavouriteToursText = () => {
    if (!!_city && _city.length > 0) {
      return t("start.beliebte_bergtouren_nahe");
    } else {
      return t("start.beliebte_bergtouren");
    }
  };

  // console.log(" L198 noToursAvailable :", noToursAvailable);

  if (noToursAvailable) {
    console.log(
      " L203 inside the true option/ noToursAvailable :",
      noToursAvailable
    );
    console.log(" L203 inside the true option/ totalTours :", totalTours);
    return (
      <Box>
        <Header totalTours={totalTours} allCities={allCities} />
        <Footer />
      </Box>
    );
  }
  // if (!noToursAvailable && noToursAvailable !== null) {
  else if (noToursAvailable === false) {
    console.log(
      " L216 inside the false option / noToursAvailable  :",
      noToursAvailable
    );
    console.log(" L216 inside the false option / totalTours  :", totalTours);
    return (
      <Box>
        {/* {getPageHeader(null)} */}
        {!!allCities && allCities.length > 0 && (
          <Header
            getCity={getCity}
            totalTours={totalTours}
            allCities={allCities}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
        )}

        {!showMobileMenu && (
          <Box elevation={0} className={"header-line"}>
            <Box sx={{ paddingTop: "55px", paddingBottom: "20px" }}>
              <Typography color={"#FFFFFF"} sx={{ textAlign: "center" }}>
                {t("start.zuugle_sucht_fuer_dich_1")} {totalProvider}{" "}
                {t("start.zuugle_sucht_fuer_dich_2")}
              </Typography>
            </Box>
          </Box>
        )}
        {!showMobileMenu && (
          <Box className={"start-body-container"}>
            <Box>
              <Typography
                variant={"h4"}
                sx={{
                  textAlign: "left",
                  paddingBottom: "15px",
                  paddingTop: "15px",
                }}
              >
                {getRangeText()}
              </Typography>
              <RangeCardContainer
                ranges={favouriteRanges}
                onSelectTour={onSelectRange}
              />
            </Box>

            <Box sx={{ marginTop: "20px" }}>
              <Typography
                variant={"h4"}
                sx={{
                  textAlign: "left",
                  paddingTop: "20px",
                  paddingBottom: "15px",
                }}
              >
                {getFavouriteToursText()}
              </Typography>
              <ScrollingTourCardContainer
                tours={favouriteTours}
                onSelectTour={onSelectTour}
                loadTourConnections={loadTourConnections}
                city={searchParams.get("city")}
              />
            </Box>

            <Box sx={{ marginTop: "20px" }}>
              <AboutZuugleContainer />
            </Box>

            <Box sx={{ marginTop: "20px" }}>
              <UserRecommendationContainer />
            </Box>

            <Box sx={{ marginTop: "20px" }}>
              <SponsoringContainer />
            </Box>

            <Box sx={{ marginTop: "20px" }}>
              <KPIContainer
                totalTours={totalTours}
                totalConnections={totalConnections}
                totalRanges={totalRanges}
                totalCities={totalCities}
                city={searchParams.get("city")}
                totalProvider={totalProvider}
              />
            </Box>
          </Box>
        )}
        {!showMobileMenu && (
          <FooterLinks
            links={["hello"]}
            //links={listAllCityLinks(allCities, searchParams)}
          />
        )}
        {!showMobileMenu && (
          <FooterLinks links={listAllRangeLinks(allRanges, searchParams)} />
        )}
        {!showMobileMenu && <Footer />}
      </Box>
    );
  }
}

//description:
// mapDispatchToProps is an object used in Redux to map action creators to the props of a component. In this code, it maps the action creators loadFavouriteTours, loadCities, loadRanges, loadTourConnectionsExtended, loadTourConnections, loadTotalTours, and loadAllCities to the props of the component. This means that when the component is connected to the Redux store, it will have access to these action creators as props, which it can use to dispatch actions to the store.
// For example, if the component needs to load some data from an API, it can call the loadFavouriteTours action creator, which will dispatch an action to the store that triggers the data loading process. This pattern makes it easier to reuse action creators across multiple components and to test the components in isolation.
const mapDispatchToProps = {
  loadFavouriteTours,
  loadCities,
  loadRanges,
  loadTourConnectionsExtended,
  loadTourConnections,
  loadTotalTours,
  loadAllCities,
};

// description:
// This is a constant called mapStateToProps which is a function that takes in a state object as an argument. This function returns an object that contains properties derived from the state object, specifically properties that are related to tours, ranges, cities, and other data related to tours and their connections.
const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    favouriteTours: state.tours.favouriteTours,
    favouriteRanges: state.tours.favouriteRanges,
    allRanges: state.ranges.ranges,
    totalTours: state.tours.total_tours,
    totalConnections: state.tours.total_connections,
    totalRanges: state.tours.total_ranges,
    totalCities: state.tours.total_cities,
    allCities: state.cities.all_cities,
    totalProvider: state.tours.total_provider,
    noDataAvailable: state.tours.noDataAvailable,
    noToursAvailable: state.tours.noToursAvailable,
    error: state.tours.error,
  };
};

// description:
// The code exports a higher-order component (HOC) that is the result of composing the "Start" component with the "connect" function from the "react-redux" library. The "connect" function connects the "Start" component to the Redux store, allowing it to access the state stored in the store and dispatch actions to the store.
// The "connect" function takes two arguments: "mapStateToProps" and "mapDispatchToProps". "mapStateToProps" is a function that maps the state in the Redux store to the props in the "Start" component. "mapDispatchToProps" is an object that maps the dispatch actions to the props in the "Start" component.
// The result of this composition is a new component that has access to the state in the Redux store and the ability to dispatch actions to the store, and is then exported for use in other parts of the application.
export default compose(
  connect(
    //connects the component Start to the redux store
    mapStateToProps,
    mapDispatchToProps
  )
)(Start);

// description
// This code defines a React component that returns a conditional rendering based on the value of totalTours. If totalTours is equal to 0, the component returns a Box component with a Header and a Footer component.
// Otherwise, it returns a Box component with several other components:
// getPageHeader(null)
// Header with totalTours and allCities props
// A Box with a white text that says "Zuugle sucht für dich in {totalProvider} Tourenportalen nach Öffi-Bergtouren".
// A RangeCardContainer component with favouriteRanges and onSelectTour props.
// A ScrollingTourCardContainer component with favouriteTours, onSelectTour, loadTourConnections, and city props.
// An AboutZuugleContainer component.
// A UserRecommendationContainer component.
// A SponsoringContainer component.
// A KPIContainer component with totalTours, totalConnections, totalRanges, totalCities, city, and totalProvider props.
// A FooterLinks component with listAllCityLinks(allCities, searchParams) as the links prop.
// A FooterLinks component with listAllRangeLinks(allRanges, searchParams) as the links prop.
// A Footer component.
