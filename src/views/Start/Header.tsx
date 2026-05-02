import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { getDomainText, getTLD } from "../../utils/globals";
import BackgroundImageLoader from "./BackgroundImageLoader";
import Search from "../../components/Search/Search";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { TotalResponse } from "../../features/apiSlice";

const DomainMenu = lazy(() => import("../../components/DomainMenu"));
const LanguageMenu = lazy(() => import("../../components/LanguageMenu"));

export interface HeaderProps {
  totals?: TotalResponse;
  isLoading?: boolean;
}
export default function Header({ totals, isLoading }: HeaderProps) {
  const { t } = useTranslation();
  const tld = getTLD();

  return (
    <>
      <BackgroundImageLoader sx={{ position: "relative" }} tld={tld}>
        {totals === undefined || totals.total_tours === 0 ? (
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
            {isLoading ? (
              <Box
                sx={{
                  marginTop: "80px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={60} sx={{ color: "#FFF" }} />
              </Box>
            ) : (
              <Typography variant="h1">{t("start.wartungsmodus")}</Typography>
            )}
          </Box>
        ) : (
          <>
            <Box className="rowing">
              <DomainMenu />
              <LanguageMenu />
            </Box>

            <Box className="header-text">
              <Typography variant="h1" sx={{ height: "162px" }}>
                {totals?.tours_country.toLocaleString()}{" "}
                {t("start.tourenanzahl_untertitel")}
              </Typography>
            </Box>
          </>
        )}
      </BackgroundImageLoader>
      <Box
        sx={{
          mt: "-50px",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Search />
      </Box>
    </>
  );
}
