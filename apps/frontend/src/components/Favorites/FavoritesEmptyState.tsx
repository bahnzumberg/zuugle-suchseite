import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useTranslation } from "react-i18next";

export type FavoritesEmptyVariant = "empty" | "no_matches";

export default function FavoritesEmptyState({
  variant,
}: {
  variant: FavoritesEmptyVariant;
}) {
  const { t } = useTranslation();

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
        <Typography sx={{ fontSize: "14px", color: "#666" }}>
          {t("lists.list_empty_hint")}
        </Typography>
      )}
    </Box>
  );
}
