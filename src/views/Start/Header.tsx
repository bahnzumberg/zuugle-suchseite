import { Box, CircularProgress, Typography } from "@mui/material";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getDomainText, getTLD } from "../../utils/globals";
import BackgroundImageLoader from "./BackgroundImageLoader";
import Search from "../../components/Search/Search";
import { useSelector } from "react-redux";
import { RootState } from "../..";

const DomainMenu = lazy(() => import("../../components/DomainMenu"));
const LanguageMenu = lazy(() => import("../../components/LanguageMenu"));

export interface HeaderProps {
  totalTours: number;
  totalToursFromCity: number;
  isLoading?: boolean;
}
export default function Header({
  totalTours,
  totalToursFromCity,
  isLoading,
}: HeaderProps) {
  const { t } = useTranslation();
  const city = useSelector((state: RootState) => state.search.city);

  const tld = getTLD();

  return (
    <BackgroundImageLoader sx={{ position: "relative" }} tld={tld}>
      {totalTours === 0 ? (
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
            <CircularProgress />
          ) : (
            <Typography variant="h1">{t("start.wartungsmodus")}</Typography>
          )}
        </Box>
      ) : (
        <>
          <Box className="rowing blueDiv">
            <DomainMenu />
            <LanguageMenu />
          </Box>

          <Box className="header-text">
            <Typography variant="h1" sx={{ height: "162px" }}>
              {!city
                ? totalTours.toLocaleString()
                : totalToursFromCity.toLocaleString()}{" "}
              {t(
                !city
                  ? "start.tourenanzahl_untertitel"
                  : "start.tourenanzahl_untertitel_city",
                { capCity: city?.label },
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#FFF",
              position: "absolute",
              bottom: 0,
              transform: "translate(-50%, 50%)",
              display: "inline-flex",
              borderRadius: "20px",
              p: "12px 15px",
              border: "2px solid #ddd",
              width: "100%",
              maxWidth: { xs: "325px", md: "600px" },
              boxSizing: "border-box",
              boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Search pageKey="start" isMain={false} />
            </Box>
          </Box>
        </>
      )}
    </BackgroundImageLoader>
  );
}
