import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { darken, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

// Lindgrün (Corporate Design) — same literal FilterButton uses for its
// active state, so the hover shade can be derived the same way.
const ACTIVE_BG = "#ccd8a1";

// Design scaffolding only: toggles its own appearance to show the two states.
// It does not yet filter the result list down to favorites.
export default function FavoritesToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [showing, setShowing] = useState(false);

  const toggle = () => {
    setShowing((v) => !v);
    // TODO: switch the result list between all tours and saved favorites
  };

  const label = showing ? t("favorites.showing") : t("favorites.show");
  const icon = showing ? (
    <FavoriteRoundedIcon />
  ) : (
    <FavoriteBorderRoundedIcon />
  );

  // Active state mirrors the filter button's language (brand Lindgrün, Bahnblau
  // text); inactive is a translucent white pill that reads on the blue bar.
  const stateSx = showing
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

  if (isXs) {
    return (
      <IconButton
        onClick={toggle}
        aria-label={label}
        aria-pressed={showing}
        sx={{ width: 40, height: 40, ...stateSx }}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <Button
      onClick={toggle}
      aria-pressed={showing}
      startIcon={icon}
      sx={{
        height: 40,
        borderRadius: "50px",
        textTransform: "none",
        fontWeight: 700,
        px: "18px",
        whiteSpace: "nowrap",
        ...stateSx,
      }}
    >
      {label}
    </Button>
  );
}
