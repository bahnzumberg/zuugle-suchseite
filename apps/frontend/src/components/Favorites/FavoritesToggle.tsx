import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import { darken, lighten } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useFavorites } from "../../hooks/useFavorites";
import { useAppDispatch } from "../../hooks";
import { syncDialogOpened } from "../../features/favoritesSlice";
import SearchBarButton from "../Search/SearchBarButton";
import { useEmbed } from "../../utils/embedContext";
import { theme } from "../../theme";

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

const inactiveEmbedColor = theme.palette.secondary.main;
const INACTIVE_EMBED_SX = {
  bgcolor: lighten(inactiveEmbedColor, 0.9),
  color: inactiveEmbedColor,
  border: `1px solid ${lighten(inactiveEmbedColor, 0.3)}`,
  boxShadow: `0 1px 4px ${lighten(inactiveEmbedColor, 0.7)}`,
  "&:hover": {
    bgcolor: lighten(inactiveEmbedColor, 0.84),
    color: darken(inactiveEmbedColor, 0.08),
    borderColor: inactiveEmbedColor,
    boxShadow: `0 2px 8px ${lighten(inactiveEmbedColor, 0.62)}`,
  },
};

const ACTIVE_EMBED_SX = {
  bgcolor: "var(--bzb-lindgruen)",
  color: "var(--bzb-bahnblau)",
  border: "1px solid transparent",
  boxShadow: "0 1px 4px rgba(37,73,128,0.25)",
  "&:hover": {
    bgcolor: darken(ACTIVE_BG, 0.08),
    boxShadow: "0 2px 8px rgba(37,73,128,0.3)",
  },
};

export interface FavoritesToggleProps {
  hideSync?: boolean;
}

export default function FavoritesToggle({
  hideSync,
}: FavoritesToggleProps = {}) {
  const { isEmbed } = useEmbed();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesOnly, toggleFavoritesOnly } = useFavorites();

  const label = favoritesOnly ? t("favorites.showing") : t("favorites.show");
  const icon = favoritesOnly ? (
    <ArrowBackRoundedIcon />
  ) : (
    <FavoriteRoundedIcon />
  );

  // Active state mirrors the filter button's language: brand Lindgrün on
  // Bahnblau text.
  const stateSx = isEmbed
    ? favoritesOnly
      ? ACTIVE_EMBED_SX
      : INACTIVE_EMBED_SX
    : favoritesOnly
      ? {
          bgcolor: "var(--bzb-lindgruen)",
          color: "var(--bzb-bahnblau)",
          "&:hover": { bgcolor: darken(ACTIVE_BG, 0.08) },
        }
      : INACTIVE_SX;

  const showSync = !isEmbed && !hideSync;

  const handleToggle = () => {
    // When on a different page (e.g. the start page), the user wants to
    // enter favorites mode. Toggle first, then navigate — wrapping the
    // navigation in a microtask so the Redux store has committed the new
    // state before React Router mounts the search page.
    if (location.pathname !== "/search") {
      if (!favoritesOnly) {
        toggleFavoritesOnly();
      }
      // Microtask ensures the store update is visible to the new route.
      queueMicrotask(() => navigate("/search"));
    } else {
      toggleFavoritesOnly();
    }
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      {/* Sync button: only visible in favorites mode, positioned left of the
          toggle pill so the labelled "Zurück" button stays at the far right. */}
      {showSync && favoritesOnly && (
        <Tooltip title={t("favorites.sync.title")}>
          <IconButton
            onClick={() => dispatch(syncDialogOpened(null))}
            aria-label={t("favorites.sync.title")}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "var(--bzb-bahnblau)",
              color: "#fff",
              "&:hover": { bgcolor: "#1a3a5c" },
            }}
          >
            <CloudSyncRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
      <SearchBarButton
        icon={icon}
        label={label}
        onClick={handleToggle}
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
    </Box>
  );
}
