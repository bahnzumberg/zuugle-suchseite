import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import SearchContainer from "./SearchContainer";
import { useEffect, useState } from "react";
import { getDomainText, isResponsive } from "../../utils/globals";
import DomainMenu from "../../components/DomainMenu";
import LanguageMenu from "../../components/LanguageMenu";
import { useTranslation } from "react-i18next";

const LINEAR_GRADIENT =
  "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";

// description
//Header.js is a React component that renders the header section of a web page. It receives two props, totalTours and allCities, and conditionally renders different elements based on the value of totalTours. If totalTours is 0, it displays a maintenance message. Otherwise, it displays a heading that indicates the total number of tours available in the website and a search container for cities. The component also sets a background image using the backgroundImage state variable, which changes depending on the device's responsiveness. The component makes use of other React components from the Material-UI library such as Box and Typography, and a custom SearchContainer component. It also makes use of some utility functions from the utils/globals module.

export default function Header({
  totalTours,
  allCities,
  showMobileMenu,
  setShowMobileMenu,
}) {
  // const [fSearchQuery, setFSearchQuery] = React.useState("");
  // const [showFirstMenu, setShowFirstMenu] = React.useState(false);
  // const [firstMenuOptions, setFirstMenuOptions] = React.useState([
  // 	"GroBer Patel",
  // 	"GroBer Priel",
  // 	"GroBer Pythrgas",
  // ]);
  // const [secondSearchQuery, setSecondSearchQuery] = React.useState("");
  // const [showSecondMenu, setShowSecondMenu] = React.useState(false);
  // const [secondMenuOptions, setSecondMenuOptions] = React.useState([
  // 	"GroBer Patel",
  // 	"GroBer Priel",
  // 	"GroBer Pythrgas",
  // ]);
  const [backgroundImage, setBackgroundImage] = useState(
    `${LINEAR_GRADIENT} url(/app_static/img/background_start_tiny.jpeg)`
  );
  const _isMobile = isResponsive();
  const { t, i18n } = useTranslation();

  // const secondMenu = [
  // 	{ id: 0, name: "Über Zuugle" },
  // 	{ id: 1, name: "Impressum" },
  // 	{ id: 2, name: "Datenschutz" },
  // ];

  useEffect(() => {
    if (!!_isMobile) {
      setBackgroundImage(
        `${LINEAR_GRADIENT} url(/app_static/img/background_start_mobil.webp)`
      );
    } else {
      setBackgroundImage(
        `${LINEAR_GRADIENT} url(/app_static/img/background_start_small.webp)`
      );
    }
  }, [_isMobile]);

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
        <Box comoponent={"div"} className="rowing countryDiv">
          <DomainMenu />
          <LanguageMenu />
        </Box>
        <Box className={"header-text"}>
          <Typography variant={"h1"} height={"162px"}>
            {totalTours.toLocaleString()} {t("start.tourenanzahl_untertitel")}
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
                goto={"/suche"}
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}
