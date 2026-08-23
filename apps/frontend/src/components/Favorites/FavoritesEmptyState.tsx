import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useTranslation } from "react-i18next";

export type FavoritesEmptyVariant = "empty" | "not_found" | "no_matches";

export default function FavoritesEmptyState({
  variant,
  onReset,
}: {
  variant: FavoritesEmptyVariant;
  onReset?: () => void;
}) {
  const { t } = useTranslation();

  const heading =
    variant === "not_found"
      ? t("lists.list_not_found")
      : variant === "empty"
        ? t("lists.list_empty")
        : t("search.keine_ergebnisse");

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
      {variant === "not_found" && onReset && (
        <Button
          onClick={onReset}
          variant="outlined"
          sx={{
            mt: 2,
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: 700,
            color: "var(--bzb-bahnblau)",
            borderColor: "var(--bzb-bahnblau)",
          }}
        >
          {t("lists.list_not_found_reset")}
        </Button>
      )}
    </Box>
  );
}
