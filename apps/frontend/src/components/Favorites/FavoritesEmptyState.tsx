import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { useTranslation } from "react-i18next";
import { useFavoritesTour } from "./useFavoritesTour";

export type FavoritesEmptyVariant = "empty" | "no_matches";

export default function FavoritesEmptyState({
  variant,
}: {
  variant: FavoritesEmptyVariant;
}) {
  const { t } = useTranslation();
  const { startTour } = useFavoritesTour({ enabled: false });

  const heading =
    variant === "empty" ? t("lists.list_empty") : t("search.keine_ergebnisse");

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "60px 20px",
        maxWidth: "420px",
        marginX: "auto",
      }}
    >
      <FavoriteBorderRoundedIcon
        sx={{ fontSize: 48, color: "var(--bzb-lindgruen)", mb: 1 }}
      />
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--bzb-bahnblau)",
          mb: variant === "empty" ? 1 : 0,
        }}
      >
        {heading}
      </Typography>
      {variant === "empty" && (
        <>
          <Typography sx={{ fontSize: "14px", color: "#666", mb: 2 }}>
            {t("lists.list_empty_hint")}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HelpOutlineRoundedIcon />}
            onClick={() => startTour({ force: true })}
            sx={{
              borderRadius: "20px",
              borderColor: "var(--bzb-bahnblau)",
              color: "var(--bzb-bahnblau)",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              py: 0.75,
              "&:hover": {
                borderColor: "var(--bzb-bahnblau)",
                bgcolor: "rgba(37, 73, 128, 0.05)",
              },
            }}
          >
            {t("favorites.tour.help_button")}
          </Button>
        </>
      )}
    </Box>
  );
}
