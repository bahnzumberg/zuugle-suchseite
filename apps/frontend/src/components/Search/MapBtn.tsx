import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { RootState } from "../..";
import { useAppDispatch } from "../../hooks";
import { useIsMobile } from "../../utils/muiUtils";
import { boundsUpdated, mapUpdated } from "../../features/searchSlice";
import { HideMapIcon } from "../../icons/HideMapIcon";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { t } from "i18next";
import Button from "@mui/material/Button";

const MapBtn = () => {
  const showMap = useSelector((state: RootState) => state.search.map);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  const iconSize = { fontSize: 22 };
  const icon = showMap ? (
    <HideMapIcon sx={iconSize} />
  ) : (
    <MapOutlinedIcon sx={iconSize} />
  );

  const mapBtnText = isMobile
    ? icon
    : showMap
      ? t("main_only.kartenansicht_entfernen")
      : t("start_pages.zur_kartenansicht");

  const handleClick = () => {
    if (!isSearchPage) {
      // Navigate to /search and show the map there
      navigate("/search?map=true");
      return;
    }
    if (showMap) {
      dispatch(boundsUpdated(null));
    }
    dispatch(mapUpdated(!showMap));
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      aria-label={
        showMap
          ? t("main_only.kartenansicht_entfernen")
          : t("start_pages.zur_kartenansicht")
      }
      color="primary"
      startIcon={isMobile ? undefined : icon} // show icon as main content on mobile
      sx={{
        padding: "8px 20px",
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "50px 50px",
        margin: "2 auto",
        bottom: "8px",
        backgroundColor: "#712579",
        "&:hover": {
          backgroundColor: "#254980",
        },
      }}
    >
      {mapBtnText}
    </Button>
  );
};
export default MapBtn;
