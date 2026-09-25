import { type MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useTranslation } from "react-i18next";
import { useFavorites } from "../../hooks/useFavorites";

interface FavoriteButtonProps {
  tourId: number | string;
  // "icon": circular heart for the tour card. "labeled": text button for the
  // details page.
  variant: "icon" | "labeled";
  // "compact" is for the map popup, where the heart sits inline next to the
  // title instead of as a top-right overlay and has less room to spare.
  size?: "default" | "compact";
}

export default function FavoriteButton({
  tourId,
  variant,
  size = "default",
}: FavoriteButtonProps) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const numericTourId = Number(tourId);
  const saved = isFavorite(numericTourId);

  const toggle = (e: MouseEvent) => {
    // Tour cards wrap the whole tile in a link; keep the click from navigating.
    e.preventDefault();
    e.stopPropagation();
    void toggleFavorite(numericTourId);
  };

  const label =
    variant === "labeled"
      ? t(saved ? "favorites.saved" : "favorites.save")
      : t(saved ? "favorites.remove" : "favorites.add");

  const icon = saved ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />;

  if (variant === "icon") {
    const dimension = size === "compact" ? 26 : 36;
    const iconSize = size === "compact" ? 16 : 20;
    return (
      <IconButton
        onClick={toggle}
        data-tour-id={tourId}
        aria-label={label}
        aria-pressed={saved}
        sx={{
          width: dimension,
          height: dimension,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          "&:hover": { bgcolor: "#fff" },
          // Unsaved is a neutral grey outline ("you could save this"); saving
          // adds the brand color, so the color arriving is itself the state
          // cue. The circle stays white so the filled Akelei heart is visible.
          "& svg": {
            fontSize: iconSize,
            color: saved ? "var(--bzb-akelei)" : "rgba(0,0,0,0.55)",
            transition: "transform 0.2s ease",
          },
          "&:active svg": { transform: "scale(0.8)" },
          "@media (prefers-reduced-motion: reduce)": {
            "& svg": { transition: "none" },
          },
        }}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <Button
      onClick={toggle}
      data-tour-id={tourId}
      aria-pressed={saved}
      variant={saved ? "contained" : "outlined"}
      startIcon={icon}
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "14px",
        px: "16px",
        flexShrink: 0,
        whiteSpace: "nowrap",
        color: saved ? "#fff" : "var(--bzb-akelei)",
        bgcolor: saved ? "var(--bzb-akelei)" : "transparent",
        borderColor: "var(--bzb-akelei)",
        "&:hover": {
          bgcolor: saved ? "#5a1d61" : "rgba(113, 37, 121, 0.06)",
          borderColor: "var(--bzb-akelei)",
        },
      }}
    >
      {label}
    </Button>
  );
}
