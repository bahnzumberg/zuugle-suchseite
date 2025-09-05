import { Box, Skeleton, Typography } from "@mui/material";
import React, { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useIsMobile } from "../../utils/globals";
import {
  getPageHeader,
  getTranslatedCountryName,
} from "../../utils/seoPageHelper";
import Header from "./Header";
import {
  useGetTotalsQuery,
  useLazyGetToursQuery,
} from "../../features/apiSlice";
import { RootState } from "../..";
import StartTourCardContainer from "../../components/StartTourCardContainer";
import { useSelector } from "react-redux";
import SearchParamSync from "../../components/SearchParamSync";
import { useAppDispatch } from "../../hooks";
import { mapUpdated } from "../../features/searchSlice";

const RangeCardContainer = lazy(
  () => import("../../components/RangeCardContainer"),
);
const KPIContainer = lazy(() => import("../../components/KPIContainer"));

const MapBtn = lazy(() => import("../../components/Search/MapBtn"));
const Footer = lazy(() => import("../../components/Footer/Footer"));

export default function Start() {
  const citySlug = useSelector((state: RootState) => state.search.citySlug);
  const city = useSelector((state: RootState) => state.search.city);
  const provider = useSelector((state: RootState) => state.search.provider);
  const dispatch = useAppDispatch();

  const { data: totals, isFetching: isTotalsLoading } = useGetTotalsQuery();
  const [
    triggerLoadTours,
    {
      data: loadedTours = { tours: [], ranges: [], total: 0 },
      isFetching: isToursLoading,
    },
  ] = useLazyGetToursQuery();

  const { t } = useTranslation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Startseite" });
  }, []);

  useEffect(() => {
    dispatch(mapUpdated(false));
  }, []);

  useEffect(() => {
    triggerLoadTours({
      limit: 10,
      city: citySlug ?? "",
      provider: provider || undefined,
      ranges: true,
    });
  }, [citySlug, provider]);

  const getRangeText = () => {
    if (city) {
      return t("start.schoene_wanderungen_nahe");
    } else {
      return t("start.schoene_wanderungen");
    }
  };

  const getFavouriteToursText = () => {
    if (city) {
      return t("start.beliebte_bergtouren_nahe");
    } else {
      return t("start.beliebte_bergtouren");
    }
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
          <Header
            totalTours={totals?.total_tours}
            totalToursFromCity={loadedTours.total}
            isLoading={isTotalsLoading}
          />
          <Footer />
        </Box>
      </Suspense>
    );
  }

  if (totals?.total_tours !== 0) {
    return (
      <>
        <SearchParamSync isMain={false} />
        <Box style={{ background: "#fff" }}>
          {getPageHeader({ header: `Zuugle ${t(`${country}`)}` })}
          <Header
            totalTours={totals?.total_tours || 0}
            totalToursFromCity={loadedTours.total}
            isLoading={isTotalsLoading}
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
                <StartTourCardContainer
                  tours={loadedTours.tours}
                  city={city?.value || ""}
                  isLoading={isToursLoading}
                  isMobile={isMobile}
                  provider={provider}
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
                <RangeCardContainer ranges={loadedTours.ranges} />
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
          <Link to={`/search/?map=true` + (provider ? `&p=${provider}` : "")}>
            <MapBtn />
          </Link>
          <Footer />
        </Suspense>
      </>
    );
  }
}
