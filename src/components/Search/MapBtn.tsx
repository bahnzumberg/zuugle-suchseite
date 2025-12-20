import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import { CustomIcon } from "../../icons/CustomIcon";

const MapBtn = ({ handleClick }: { handleClick?: () => void }) => {
  const [t] = useTranslation();

  //state to update the text
  const [mapBtnText, setMapBtnText] = useState("");
  const showMap = useSelector((state: RootState) => state.search.map);

  //initialiaze icon
  const iconUsed = !showMap ? (
    <CustomIcon name="map" />
  ) : (
    <CustomIcon name="list" />
  );

  useEffect(() => {
    // Update button text when language changes
    setMapBtnText(
      showMap
        ? t("main_only.kartenansicht_entfernen")
        : t("start_pages.zur_kartenansicht"),
    );
  }, [showMap, t]);

  return (
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
      onClick={handleClick}
      aria-label="contained"
      variant="contained"
      endIcon={iconUsed}
    >
      <span style={{ paddingLeft: "10px" }}>{mapBtnText}</span>
    </Button>
  );
};
export default MapBtn;
