import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { getDomainText, getTLD } from "../utils/globals";
import BackgroundImageLoader from "../views/Start/BackgroundImageLoader";
import type { TotalResponse } from "../features/apiSlice";

export interface MaintenanceGuardProps {
  totals?: TotalResponse;
  isTotalsLoading: boolean;
  children: React.ReactNode;
}

/**
 * Wraps page content and shows a maintenance screen when the API
 * returns no tours (totals undefined or total_tours === 0).
 * Used on both `/` and `/search` to avoid duplicating the check.
 */
export default function MaintenanceGuard({
  totals,
  isTotalsLoading,
  children,
}: MaintenanceGuardProps) {
  const { t } = useTranslation();
  const tld = getTLD();

  const isMaintenanceMode =
    !isTotalsLoading && (totals === undefined || totals.total_tours === 0);

  if (isTotalsLoading && totals === undefined) {
    // Initial load – show a spinner on the hero background
    return (
      <BackgroundImageLoader sx={{ position: "relative" }} tld={tld}>
        <Box className="header-text">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img
              src="https://cdn.zuugle.at/img/zuugle_weiss.svg"
              height="16px"
              width="29px"
              alt="Zuugle"
              loading="lazy"
            />
            <Typography sx={{ fontSize: "16px", color: "#FFF", ml: 1 }}>
              {getDomainText()}
            </Typography>
          </Box>
          <Box
            sx={{
              marginTop: "80px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#FFF" }} />
          </Box>
        </Box>
      </BackgroundImageLoader>
    );
  }

  if (isMaintenanceMode) {
    return (
      <BackgroundImageLoader sx={{ position: "relative" }} tld={tld}>
        <Box className="header-text">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img
              src="https://cdn.zuugle.at/img/zuugle_weiss.svg"
              height="16px"
              width="29px"
              alt="Zuugle"
              loading="lazy"
            />
            <Typography sx={{ fontSize: "16px", color: "#FFF", ml: 1 }}>
              {getDomainText()}
            </Typography>
          </Box>
          <Typography variant="h1">{t("start.wartungsmodus")}</Typography>
        </Box>
      </BackgroundImageLoader>
    );
  }

  return <>{children}</>;
}
