import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import SearchContainer from "./SearchContainer";
import { useEffect, useState } from "react";
import { getDomainText, useResponsive } from "../../utils/globals";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getTotalCityTours } from "../../actions/crudActions";

const LINEAR_GRADIENT =
  "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";

export default function Header({
  totalTours,
  // getCity,
  allCities,
  showMobileMenu,
  setShowMobileMenu,
}) {
  
  const [searchParams, setSearchParams] = useSearchParams();
  let city = searchParams.get("city");
  const [capCity, setCapCity] = useState(city);
  const [totalToursFromCity, setTotalToursFromCity] = React.useState(0);

  let tld = "";
  let domain = window.location.hostname;
  if (domain.indexOf("zuugle.de") > 0) {
    tld = "de";
  } else if (domain.indexOf("zuugle.si") > 0) {
    tld = "si";
  } else if (domain.indexOf("zuugle.it") > 0) {
    tld = "it";
  } else if (domain.indexOf("zuugle.ch") > 0) {
    tld = "ch";
  } else if (domain.indexOf("zuugle.fr") > 0) {
    tld = "fr";
  } else {
    tld = "at";
  }

  const [backgroundImage, setBackgroundImage] = useState(
    `${LINEAR_GRADIENT} url(/app_static/img/background_start_tiny_${tld}.jpeg)`
  );
  const _isMobile = useResponsive();
  const { t, i18n } = useTranslation();

  function updateCapCity(newCity) {
    setCapCity(newCity);
  }

  useEffect(() => {
    getCity();
    if (!!city) {
      getTotalCityTours(city).then((data) => {
        setTotalToursFromCity(data.tours_city);
      });
    }
  }, [city]);

  useEffect(() => {
    city = searchParams.get("city");
    if (!!city && !!allCities && allCities.length > 0) {
      const cityObj = allCities.find((e) => e.value == city); // find the city object in array "allCities"
      if (!!cityObj) {
        updateCapCity(cityObj.label);
        searchParams.set("city", city);
      }
    }
  }, [searchParams, city, allCities]);

  useEffect(() => {
    if (!!_isMobile) {
      setBackgroundImage(
        `${LINEAR_GRADIENT} url(/app_static/img/background_start_mobil_${tld}.webp)`
      );
    } else {
      setBackgroundImage(
        `${LINEAR_GRADIENT} url(/app_static/img/background_start_small_${tld}.webp)`
      );
    }
  }, [_isMobile, tld]);

  const getCity = () => {
    city = localStorage.getItem("city");
    if (!!city) {
      return city;
    } else {
      return "XXX";
    }
  };

  if (totalTours === 0) {
    return (
      <Box
        className={"header-container"}
        style={{ backgroundImage: backgroundImage }}
      >
        <Box className={"header-text"}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
          >
            <img
              src={`/app_static/img/logo-white.png`}
              height={"16px"}
              width={"29px"}
              alt="logo"
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
    );
  } else {
    return (
      <Box
        className={"header-container"}
        sx={{ position: "relative" }}
        style={{ backgroundImage: backgroundImage }}
      >
        <Box component={"div"} className="rowing countryDiv">
          <DomainMenu />
          <LanguageMenu />
        </Box>
        <Box className={"header-text"}>
          <Typography variant={"h1"} height={"162px"}>
            {!!totalToursFromCity && totalToursFromCity !== 0
              ? totalToursFromCity.toLocaleString() +
                " " +
                t("start.tourenanzahl_untertitel_city", { capCity })
              : !!totalTours &&
                totalTours !== 0 &&
                totalTours.toLocaleString() +
                  " " +
                  t("start.tourenanzahl_untertitel")}
          </Typography>
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
                goto={"/suche"}
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
                updateCapCity={updateCapCity}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}
