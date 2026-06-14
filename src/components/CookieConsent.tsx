import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const STORAGE_KEY = "zuugle_cookie_consent";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== "accepted",
  );

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        backgroundColor: "var(--bzb-bahnblau)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: 3,
        py: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.9rem",
          lineHeight: 1.4,
          maxWidth: 700,
          textAlign: "center",
        }}
      >
        {t("cookie_consent.text")}
      </Typography>
      <Button
        variant="outlined"
        onClick={handleAccept}
        sx={{
          color: "#fff",
          borderColor: "#fff",
          whiteSpace: "nowrap",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.15)",
            borderColor: "#fff",
          },
        }}
      >
        {t("cookie_consent.accept")}
      </Button>
    </Box>
  );
}
