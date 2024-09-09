import React, { lazy, useState, useCallback, useEffect } from "react";
import { getDomainText, getTLD } from "../../utils/globals";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getTotalCityTours } from "../../actions/crudActions";
import "/src/config.js";
import BackgroundImageLoader from "./BackgroundImageLoader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const DomainMenu = lazy(() => import("../../components/DomainMenu"));
const LanguageMenu = lazy(() => import("../../components/LanguageMenu"));
const SearchContainer = lazy(() => import("./SearchContainer"));

export default function Header({
	totalTours,
	allCities = [],
	showMobileMenu,
	setShowMobileMenu,
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");

  const [capCity, setCapCity] = useState(city);
  const [totalToursFromCity, setTotalToursFromCity] = useState(0);

  const tld = getTLD();

  const updateCapCity = useCallback((newCity) => {
    setCapCity(newCity);
  }, []);

  const getCity = useCallback(() => {
    return searchParams.get("city") || localStorage.getItem("city") || null;
  }, [searchParams]);

  useEffect(() => {
    if (getCity()) {
      getTotalCityTours(city).then((data) => {
        setTotalToursFromCity(data.tours_city);
      });
  
      if (allCities?.length > 0) {
        const cityObj = allCities.find((e) => e.value === city);
        if (cityObj) {
          updateCapCity(cityObj.label);
          searchParams.set("city", city);
        }
      }
    }
  }, [city, getCity, allCities, updateCapCity, searchParams]);
  

  if (totalTours === 0) {
    return (
      <BackgroundImageLoader className="header-container" tld={tld}>
        <Box className="header-text">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img
              src="/app_static/img/logo-white.png"
              height="16px"
              width="29px"
              alt="Zuugle"
              loading="eager"
            />
            <Typography sx={{ fontSize: "16px", color: "#FFF", ml: 1 }}>
              {getDomainText()}
            </Typography>
          </Box>
          <Typography variant="h1">{t("start.wartungsmodus")}</Typography>
        </Box>
      </BackgroundImageLoader>
    );
  }

  return (
    <BackgroundImageLoader
      className="header-container"
      sx={{ position: "relative" }}
      tld={tld}
    >
      <Box className="rowing blueDiv">
        <DomainMenu />
        <LanguageMenu />
      </Box>
      <Box className="header-text">
        {totalTours > 0 && (
          <Typography variant="h1" sx={{ height: "162px" }}>
            {totalTours.toLocaleString()}{" "}
            {t(
              totalToursFromCity === 0
                ? "start.tourenanzahl_untertitel"
                : "start.tourenanzahl_untertitel_city",
              { capCity }
            )}
          </Typography>
        )}
      </Box>
      {allCities.length > 0 && (
        <Box
          sx={{
            bgcolor: "#FFF",
            position: "absolute",
            bottom: 0,
            transform: "translate(-50%, 50%)",
            display: "inline-flex",
            borderRadius: "20px",
            p: "12px 15px",
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
              goto="/search"
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
              updateCapCity={updateCapCity}
            />
          </Box>
        </Box>
      )}
    </BackgroundImageLoader>
  );
}
