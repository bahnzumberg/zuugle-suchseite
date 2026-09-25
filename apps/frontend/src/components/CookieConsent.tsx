import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useConsent } from "../hooks/useConsent";

export default function CookieConsent() {
  const { t } = useTranslation();
  const { consentLevel, acceptEssential, acceptAll } = useConsent();

  // Banner is only visible when the user has not yet decided
  if (consentLevel !== null) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        backgroundColor: "#ccd8a1",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        flexWrap: "wrap",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.875rem",
          lineHeight: 1.5,
          maxWidth: 620,
          textAlign: "center",
          color: "#000",
        }}
      >
        {t("cookie_consent.text")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          onClick={acceptEssential}
          aria-label={t("cookie_consent.accept_essential")}
          sx={{
            backgroundColor: "#aab5d7",
            color: "#000",
            whiteSpace: "nowrap",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#9aa5c7",
              boxShadow: "none",
            },
          }}
        >
          {t("cookie_consent.accept_essential")}
        </Button>

        <Button
          variant="contained"
          onClick={acceptAll}
          aria-label={t("cookie_consent.accept_all")}
          sx={{
            backgroundColor: "var(--bzb-akelei)",
            whiteSpace: "nowrap",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "var(--bzb-bahnblau)",
            },
          }}
        >
          {t("cookie_consent.accept_all")}
        </Button>
      </Box>
    </Box>
  );
}
