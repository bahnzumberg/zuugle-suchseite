import * as React from "react";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import MapIcon from "../../icons/Map";
import ListIcon from "../../icons/List";

import { useTranslation } from "react-i18next";



const MapBtn = ({ children, onClick, showMap}) => {

  const [t, i18n] = useTranslation();

  //state to update the text
  const [mapBtnext,setMapBtnText] = useState("");

  //initialiaze icon
  const iconUsed = !showMap ? <MapIcon /> : <ListIcon /> ;


  useEffect(() => {
    // Update button text when language changes
    setMapBtnText(showMap ? t("main.kartenansicht_entfernen") : t("main.zur_kartenansicht"));
  }, [showMap, t]);
  

  return (
    <Button
      sx={{
        position: "fixed",
        bottom: "20px",
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
      }}
      onClick={onClick}
      aria-label="contained"
      variant="contained"
      endIcon={!!iconUsed && iconUsed}
    >
      <span style={{ paddingLeft: "10px" }}>
        {children}
        {mapBtnext}
      </span> 
    </Button>
  );
};
export default MapBtn;