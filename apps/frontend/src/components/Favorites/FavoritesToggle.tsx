import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { darken } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../../hooks/useFavorites";
import SearchBarButton from "../Search/SearchBarButton";

// Lindgrün (Corporate Design) — same literal FilterButton uses for its
// active state, so the hover shade can be derived the same way.
const ACTIVE_BG = "#ccd8a1";

export default function FavoritesToggle() {
  const { t } = useTranslation();
  const { favoritesOnly, toggleFavoritesOnly } = useFavorites();

  const label = favoritesOnly ? t("favorites.showing") : t("favorites.show");
  const icon = favoritesOnly ? (
    <FavoriteRoundedIcon />
  ) : (
    <FavoriteBorderRoundedIcon />
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

  return (
    <SearchBarButton
      icon={icon}
      label={label}
      onClick={toggleFavoritesOnly}
      ariaPressed={favoritesOnly}
      sx={{
        borderRadius: "50px",
        textTransform: "none",
        px: "18px",
        whiteSpace: "nowrap",
        ...stateSx,
      }}
    />
  );
}
