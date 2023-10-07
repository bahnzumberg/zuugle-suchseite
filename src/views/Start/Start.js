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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const { t, i18n } = useTranslation();
  const abortController = new AbortController();

  let searchParamCity = "";
  let city = "";

  let _city = searchParams.get("city");

  const getCity = () => {
    searchParamCity = searchParams.get("city");
    city = localStorage.getItem("city");
    if (!!city) {
      return city;
    } else {
      return "";
    }
  };

  useEffect(() => {
    _mtm.push({ pagetitel: "Startseite" });

    const requestConfig = {
      params: { domain: window.location.host },
      signal: abortController.signal,
    };

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

    return () => {
      abortController.abort();
    };
  }, [totalTours]);

  const onSelectTour = (tour) => {
    let currentSearchParams = new URLSearchParams(searchParams.toString());
    const city = currentSearchParams.get("city");
    const updatedSearchParams = new URLSearchParams();

    !!tour && localStorage.setItem("tourId", tour.id);

    if (city) {
      updatedSearchParams.set("city", city);
    }

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

  if (noToursAvailable) {
    return (
      <Box>
        <Header totalTours={totalTours} allCities={allCities} />
        <Footer />
      </Box>
    );
  } else {
    return (
      <Box>
        {getPageHeader(null)}
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
          <FooterLinks links={listAllCityLinks(allCities, searchParams)} />
        )}
        {!showMobileMenu && (
          <FooterLinks links={listAllRangeLinks(allRanges, searchParams)} />
        )}
        {!showMobileMenu && <Footer />}
      </Box>
    );
  }
}

const mapDispatchToProps = {
  loadFavouriteTours,
  loadCities,
  loadRanges,
  loadTourConnectionsExtended,
  loadTourConnections,
  loadTotalTours,
  loadAllCities,
};

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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Start);
