import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import SearchContainer from "./SearchContainer";
import { useEffect, useState } from "react";
import { getDomainText, useResponsive, get_meta_data, getTopLevelDomain, get_currLanguage } from "../../utils/globals";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getTotalCityTours } from "../../actions/crudActions";
import { Helmet } from "react-helmet";
import "/src/config.js";

const LINEAR_GRADIENT =
  "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";

export default function Header({
  totalTours,
  allCities = [],
  showMobileMenu,
  setShowMobileMenu,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  let city = searchParams.get("city");

  const [capCity, setCapCity] = useState(city);
  const [totalToursFromCity, setTotalToursFromCity] = React.useState(0);
  const [loading, setLoading] = useState(false);

  let tld = getTopLevelDomain();
  
  const _isMobile = useResponsive();
  const { t, i18n } = useTranslation();

  function updateCapCity(newCity) {
    setCapCity(newCity);
  }

  useEffect(() => {
    let _city = getCity();
    if (!!_city) {
      setLoading(true);
      getTotalCityTours(city).then((data) => {
        setTotalToursFromCity(data.tours_city);
        if (!!data.tours_city && data.tours_city > 0) setLoading(false);
      });
    }
  }, [city]);

  useEffect(() => {
    if (!!city && !!allCities && allCities.length > 0) {
      const cityObj = allCities.find((e) => e.value === city); // find the city object in array "allCities"
      if (!!cityObj) {
        updateCapCity(cityObj.label);
        searchParams.set("city", city);
      }
    }
  }, [searchParams, city, allCities]);


  const backgroundImage = !!_isMobile
    ? `${LINEAR_GRADIENT} url(/app_static/img/background_start_mobil_${tld}.webp)`
    : `${LINEAR_GRADIENT} url(/app_static/img/background_start_small_${tld}.webp)`;

  const preloadUrl = !!_isMobile
    ? `/app_static/img/background_start_mobil_${tld}.webp`
    : `/app_static/img/background_start_small_${tld}.webp`;

  const getCity = () => {
    let _city = searchParams.get("city")
      ? searchParams.get("city")
      : localStorage.getItem("city")
      ? localStorage.getItem("city")
      : null;

    return _city;
  };

  const meta = get_meta_data('Start');
  const currLanguage = get_currLanguage();

  if (totalTours === 0) {
    return (
      <>
        <Helmet>
          <link rel="preload" href={preloadUrl} as="image" />
          {meta}
        </Helmet>
        <Box
          className={"header-container"}
          style={{ backgroundImage: backgroundImage }}
        >
          <Box className={"header-text"}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <img
                src={`/app_static/img/logo-white.png`}
                height={"16px"}
                width={"29px"}
                alt="Zuugle"
              />
              <Typography
                style={{
                  fontSize: "16px",
                  color: "#FFF",
                  lineHeight: "16px",
                  marginLeft: "5px",
                }}
              >
                {getDomainText()}
              </Typography>
            </Box>
            <Typography variant={"h1"}>{t("start.wartungsmodus")}</Typography>
          </Box>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Helmet>
          <link rel="preload" href={preloadUrl} as="image" />
          {meta}
          <title>{t("start.helmet_title")}</title>
          <meta http-equiv="content-language" content="{currLanguage}" />
        </Helmet>
        <Box
          className={"header-container"}
          sx={{ position: "relative" }}
          style={{ backgroundImage: backgroundImage }}
        >
          <Box component={"div"} className="rowing blueDiv">
            <DomainMenu />
            <LanguageMenu pageKey='start'/>
          </Box>
          <Box className={"header-text"}>
            <>
              {!loading && !!totalTours && totalToursFromCity === 0 && (
                <Typography variant={"h1"} height={"162px"}>
                  {!!totalTours &&
                    totalTours !== 0 &&
                    totalTours.toLocaleString() +
                      " " +
                      t("start.tourenanzahl_untertitel")}
                </Typography>
              )}
              {!loading && !!totalToursFromCity && (
                <Typography variant={"h1"} height={"162px"}>
                  {!!totalToursFromCity &&
                    totalToursFromCity !== 0 &&
                    totalToursFromCity.toLocaleString() +
                      " " +
                      t("start.tourenanzahl_untertitel_city", { capCity })}
                </Typography>
              )}
            </>
          </Box>
          {!!allCities && allCities.length > 0 && (
            <Box
              sx={{
                backgroundColor: "#FFF",
                position: "absolute",
                bottom: "0",
                transform: "translate(-50%, 50%)",
                display: "inline-flex",
                borderRadius: "20px",
                padding: "12px 15px",
                border: "2px solid #ddd",
                width: "100%",
                maxWidth: { xs: "325px", md: "600px" },
                boxSizing: "border-box",
                boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <SearchContainer
                  pageKey="start"
                  page="start"
                  goto={"/search"}
                  showMobileMenu={showMobileMenu}
                  setShowMobileMenu={setShowMobileMenu}
                  updateCapCity={updateCapCity}
                />
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  }
}
