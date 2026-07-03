import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { getTLD } from "../utils/globals";
import BackgroundImageLoader from "../views/Start/BackgroundImageLoader";
import DomainMenu from "./DomainMenu";
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
            <DomainMenu />
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
            <DomainMenu />
          </Box>
          <Typography variant="h1">{t("start.wartungsmodus")}</Typography>
        </Box>
      </BackgroundImageLoader>
    );
  }

  return <>{children}</>;
}
