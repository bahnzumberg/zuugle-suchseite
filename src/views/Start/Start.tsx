import { Box, Skeleton, Typography } from "@mui/material";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { compose } from "redux";
import { loadRanges } from "../../actions/rangeActions";
import { loadFavouriteTours, loadTour } from "../../actions/tourActions";
import { useResponsive } from "../../utils/globals";
import {
  getPageHeader,
  getTranslatedCountryName,
} from "../../utils/seoPageHelper";
import Header from "./Header";
import "/src/config.js";
import { useGetTotalsQuery } from "../../features/apiSlice";

const RangeCardContainer = lazy(
  () => import("../../components/RangeCardContainer"),
);
const KPIContainer = lazy(() => import("../../components/KPIContainer"));
const ScrollingTourCardContainer = lazy(
  () => import("../../components/ScrollingTourCardContainer"),
);
const MapBtn = lazy(() => import("../../components/Search/MapBtn"));
const Footer = lazy(() => import("../../components/Footer/Footer"));

function Start({
  loadFavouriteTours,
  favouriteTours,
  loadTour,
  favouriteRanges,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: totals } = useGetTotalsQuery();

  const getCity = () => {
    return localStorage.getItem("city") || searchParams.get("city") || "";
  };

  const city = getCity();

  const { t } = useTranslation();
  const abortController = new AbortController();

  const isMobile = useResponsive();

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
        if (city) {
          searchParams.set("city", city);
          setSearchParams(searchParams);
        }

        await loadFavouriteTours(
          {
            limit: 10,
            city,
            ranges: true,
            provider: searchParams.get("p"),
          },
          requestConfig,
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
  }, [searchParams]);

  const onSelectTour = (tour) => {
    if (tour?.id) {
      if (city) {
        loadTour(tour.id, city).then((tourExtracted) => {
          if (tourExtracted?.data?.tour) {
            localStorage.setItem("tourId", tour.id);
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
    if (range?.range) {
      navigate(`/search?range=${range.range}${city ? "&city=" + city : ""}`);
    }
  };

  const getRangeText = () => {
    if (city?.length > 0) {
      return t("start.schoene_wanderungen_nahe");
    } else {
      return t("start.schoene_wanderungen");
    }
  };

  const getFavouriteToursText = () => {
    if (city?.length > 0) {
      return t("start.beliebte_bergtouren_nahe");
    } else {
      return t("start.beliebte_bergtouren");
    }
  };

  const onClickMap = () => {
    if (!searchParams.get("map")) {
      // console.log("setting map");
      searchParams.set("map", true);
      setSearchParams(searchParams);
    }
    navigate(`search?${searchParams.toString()}`);
  };

  const country = getTranslatedCountryName();

  if (totals?.total_tours === 0) {
    return (
      <Suspense
        fallback={
          <div
            style={{
              height: "100%",
              width: "100%",
            }}
          ></div>
        }
      >
        <Box>
          <Header totalTours={totals?.total_tours} />
          <Footer />
        </Box>
      </Suspense>
    );
  }

  if (totals?.total_tours !== 0) {
    return (
      <>
        <Box style={{ background: "#fff" }}>
          {getPageHeader({ header: `Zuugle ${t(`${country}`)}` })}
          <Header
            totalTours={totals?.total_tours}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
        </Box>
        <Suspense
          fallback={
            <Skeleton variant="rectangular" width="100vw" height="50vh" />
          }
        >
          <Box style={{ background: "#fff" }}>
            <Box elevation={0} className={"header-line"}>
              <Box
                sx={{
                  paddingTop: "55px",
                  paddingBottom: "20px",
                }}
              >
                <Typography color={"#FFFFFF"} sx={{ textAlign: "center" }}>
                  {t("start.zuugle_sucht_fuer_dich_1")} {totals?.total_provider}{" "}
                  {t("start.zuugle_sucht_fuer_dich_2")}
                </Typography>
              </Box>
            </Box>
            <Box className={"start-body-container"}>
              <Box
                sx={{
                  marginTop: "20px",
                  padding: isMobile ? "30px 20px" : "30px 10px",
                  background: "#EBEBEB",
                  borderRadius: "30px",
                }}
              >
                <Typography
                  variant={"h4"}
                  sx={{
                    textAlign: "left",
                    paddingTop: "20px",
                    paddingBottom: "15px",
                    marginLeft: !isMobile ? "64px" : null,
                  }}
                >
                  {getFavouriteToursText()}
                </Typography>
                <ScrollingTourCardContainer
                  tours={favouriteTours}
                  onSelectTour={onSelectTour}
                  city={searchParams.get("city")}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  isMobile={isMobile}
                  provider={searchParams.get("p")}
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
                  totalTours={totals?.total_tours || 0}
                  totalConnections={totals?.total_connections || 0}
                  totalCities={totals?.total_cities || 0}
                  totalProvider={totals?.total_provider || 0}
                />
              </Box>
            </Box>
          </Box>
          <MapBtn
            onClick={onClickMap}
            mapBtnext={`${t("start_pages.zur_kartenansicht")}`}
            btnSource="start"
          />
          <Footer />
        </Suspense>
      </>
    );
  }
}

const mapDispatchToProps = {
  loadFavouriteTours,
  loadRanges,
  loadTour,
};

const mapStateToProps = (state) => {
  return {
    loading: state.tours.loading,
    favouriteTours: state.tours.favouriteTours,
    favouriteRanges: state.tours.favouriteRanges,
    allRanges: state.ranges.ranges,
    noDataAvailable: state.tours.noDataAvailable,
    error: state.tours.error,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Start);
