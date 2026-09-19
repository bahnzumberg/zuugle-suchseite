import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import { darken } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../../hooks/useFavorites";
import { useAppDispatch } from "../../hooks";
import { syncDialogOpened } from "../../features/favoritesSlice";
import SearchBarButton from "../Search/SearchBarButton";

// Lindgrün (Corporate Design) — same literal FilterButton uses for its
// active state, so the hover shade can be derived the same way.
const ACTIVE_BG = "#ccd8a1";

// A translucent white pill that reads on the blue search bar. Both buttons
// below are in this state most of the time, so they share the literal.
const INACTIVE_SX = {
  bgcolor: "rgba(255, 255, 255, 0.15)",
  color: "#fff",
  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.28)" },
};

export default function FavoritesToggle() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { favoritesOnly, toggleFavoritesOnly } = useFavorites();

  const label = favoritesOnly ? t("favorites.showing") : t("favorites.show");
  const icon = favoritesOnly ? (
    <ArrowBackRoundedIcon />
  ) : (
    <FavoriteRoundedIcon />
  );

  // Active state mirrors the filter button's language: brand Lindgrün on
  // Bahnblau text.
  const stateSx = favoritesOnly
    ? {
        bgcolor: "var(--bzb-lindgruen)",
        color: "var(--bzb-bahnblau)",
        "&:hover": { bgcolor: darken(ACTIVE_BG, 0.08) },
      }
    : INACTIVE_SX;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
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
      {/* Icon-only at every width: the search bar has no room for a second
          labelled pill on mobile, and the label would wrap the row. 40px to
          match the pill beside it. */}
      <Tooltip title={t("favorites.sync.title")}>
        <IconButton
          onClick={() => dispatch(syncDialogOpened(null))}
          aria-label={t("favorites.sync.title")}
          sx={{ width: 40, height: 40, ...INACTIVE_SX }}
        >
          <CloudSyncRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
