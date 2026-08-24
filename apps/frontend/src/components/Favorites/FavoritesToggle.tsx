import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { darken } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../../hooks/useFavorites";
import SearchBarButton from "../Search/SearchBarButton";

// Lindgrün (Corporate Design) — same literal FilterButton uses for its
// active state, so the hover shade can be derived the same way.
const ACTIVE_BG = "#ccd8a1";

export default function FavoritesToggle() {
  const { t } = useTranslation();
  const { favoritesOnly, toggleFavoritesOnly, isOnlyLocal } = useFavorites();

  const label = favoritesOnly ? t("favorites.showing") : t("favorites.show");
  const icon = favoritesOnly ? (
    <ArrowBackRoundedIcon />
  ) : (
    <FavoriteRoundedIcon />
  );

  // Active state mirrors the filter button's language (brand Lindgrün, Bahnblau
  // text); inactive is a translucent white pill that reads on the blue bar.
  const stateSx = favoritesOnly
    ? {
        bgcolor: "var(--bzb-lindgruen)",
        color: "var(--bzb-bahnblau)",
        "&:hover": { bgcolor: darken(ACTIVE_BG, 0.08) },
      }
    : {
        bgcolor: "rgba(255, 255, 255, 0.15)",
        color: "#fff",
        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.28)" },
      };

  const showOnlyLocalNotice = favoritesOnly && isOnlyLocal;

  return (
    <Box
      sx={{
        display: "inline-flex",
        position: "relative",
        alignItems: "center",
      }}
    >
      <SearchBarButton
        icon={icon}
        label={label}
        onClick={toggleFavoritesOnly}
        ariaPressed={favoritesOnly}
        sx={{
          borderRadius: "50px",
          textTransform: "none",
          px: "18px",
          fontWeight: 400,
          whiteSpace: "nowrap",
          ...stateSx,
        }}
      />
      {showOnlyLocalNotice && (
        <Typography
          sx={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            fontSize: "11px",
            lineHeight: 1.2,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "right",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {t("favorites.only_local")}
        </Typography>
      )}
    </Box>
  );
}
