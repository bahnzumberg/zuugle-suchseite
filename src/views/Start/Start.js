import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { lazy, useEffect, useState, useRef } from "react";
import {
  loadTour,
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
import { useTranslation } from "react-i18next";
import Header from "./Header";
import {
  getPageHeader,
  getTranslatedCountryName,
} from "../../utils/seoPageHelper";
import MapBtn from "../../components/Search/MapBtn";
const RangeCardContainer = lazy(() => import("../../components/RangeCardContainer"));
const KPIContainer = lazy(() => import("../../components/KPIContainer"));
const ScrollingTourCardContainer = lazy(() => import("../../components/ScrollingTourCardContainer"));

function Start({
  loadFavouriteTours,
  favouriteTours,
  loadCities,
  loadTourConnections,
  totalTours,
  loadTour,
  loadTotalTours,
  totalConnections,
  totalCities,
  totalRanges,
  favouriteRanges,
  loadAllCities,
  allCities,
  totalProvider,
  loadRanges,
  noToursAvailable,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();
  const abortController = new AbortController();

  let searchParamCity = "";
  let city = "";

  let _city = searchParams.get("city");
  let totalTourRef = useRef(0);

  useEffect(() => {
    // matomo
    // eslint-disable-next-line no-undef
    _mtm.push({ pagetitel: "Startseite" });
    // network request configuration
    const requestConfig = {
      params: { domain: window.location.host },
      signal: abortController.signal,
    };
    // Async function to load data and handle requests
    const loadData = async () => {
      try {
        totalTourRef.current = await loadTotalTours(requestConfig);
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
            limit: 10,
            city: !!city ? city : undefined,
            ranges: true,
            provider: searchParams.get("p"),
          },
          requestConfig
        );
        setIsLoading(false);
      } catch (error) {
          console.error("Error loading data");
          setIsLoading(false);
      }
    };

    loadData();

    // Return a cleanup function
    return () => {
      // Cancel any ongoing network request when the component unmounts
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!!tour && !!tour.id) {
      if (!!city) {
        loadTour(tour.id, city).then((tourExtracted) => {
          if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
            localStorage.setItem("tourId", tour.id);
            // window.open("/tour?" + searchParams.toString(),"_blank","noreferrer");// removed to use <a> tags
          } else {
            window.location.reload();
          }
        });
      }
    } else {
      window.location.reload();
    }
  };

  const onSelectRange = (range) => {
    if (!!range && !!range.range) {
      navigate(`/suche?range=${range.range}${!!_city ? "&city=" + _city : ""}`);
    }
  };


  const getRangeText = () => {
    if (!!_city && _city.length > 0) {
      return t("start.schoene_wanderungen_nahe");
    } 
    else {
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

  const onClickMap = () => {
    if (!searchParams.get("map")) {
      searchParams.set("map", true);
      setSearchParams(searchParams);
    }
    navigate(`suche?${searchParams.toString()}`);
  };

  const country = getTranslatedCountryName();

  if (noToursAvailable) {
    return (
      <Box>
        <Header totalTours={totalTours} allCities={allCities} />
        <Footer />
      </Box>
    );
  } else if (noToursAvailable === false) {
    return (
      <Box style={{ background: "#fff" }}>
        {getPageHeader({ header: `Zuugle ${t(`${country}`)}` })}
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
            <Box
              sx={{
                marginTop: "20px",
                padding: "30px 10px",
                background: "#EBEBEB",
                borderRadius: "30px",
                // borderBottomLeftRadius: "30px",
                // borderBottomRightRadius: "30px",
              }}
            >
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
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </Box>

            <Box style={{ padding: "30px 40px" }}>
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

            <Box sx={{ marginTop: "80px" }}>
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
          <MapBtn
            onClick={onClickMap}
            mapBtnext={`${t("start_pages.zur_kartenansicht")}`}
            btnSource="start"
          ></MapBtn>
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
  loadTour,
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
