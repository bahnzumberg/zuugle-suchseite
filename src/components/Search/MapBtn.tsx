import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ListIcon from "../../icons/List";
import MapIcon from "../../icons/Map";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import { Link } from "react-router";

const MapBtn = () => {
  const [t] = useTranslation();

  //state to update the text
  const [mapBtnText, setMapBtnText] = useState("");
  const showMap = useSelector((state: RootState) => state.search.map);

  //initialiaze icon
  const iconUsed = !showMap ? <MapIcon /> : <ListIcon />;

  useEffect(() => {
    // Update button text when language changes
    setMapBtnText(
      showMap
        ? t("main_only.kartenansicht_entfernen")
        : t("start_pages.zur_kartenansicht"),
    );
  }, [showMap, t]);

  return (
    <Link to={`/search/?map=${!showMap}`}>
      <Button
        sx={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "40px",
          borderRadius: "50px 50px",
          opacity: 1,
          backgroundColor: "#101010",
          color: "#f1f1f1",
          cursor: "pointer",
          alignItems: "center", // Align vertically
          justifyContent: "space-between", // Space content evenly
          flexDirection: "row", // Text and icon in a row
          margin: "2 auto",
          "@media (min-width: 900px)": {
            bottom: "calc(50px - 3%)", // Move down on screens wider than 900px
          },
        }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="contained"
        variant="contained"
        endIcon={iconUsed}
      >
        <span style={{ paddingLeft: "10px" }}>{mapBtnText}</span>
      </Button>
    </Link>
  );
};
export default MapBtn;
