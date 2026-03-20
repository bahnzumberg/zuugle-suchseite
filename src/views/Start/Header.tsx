import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getDomainText, getTLD } from "../../utils/globals";
import BackgroundImageLoader from "./BackgroundImageLoader";
import Search from "../../components/Search/Search";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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
    <>
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
              <Box
                sx={{ display: "flex", justifyContent: "center" }}
                marginTop={"80px"}
              >
                <CircularProgress size={60} sx={{ color: "#FFF" }} />
              </Box>
            ) : (
              <Typography variant="h1">{t("start.wartungsmodus")}</Typography>
            )}
          </Box>
        ) : (
          <>
            <Box className="rowing blueDiv">
              <Suspense fallback={null}>
                <DomainMenu />
                <LanguageMenu />
              </Suspense>
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
          </>
        )}
      </BackgroundImageLoader>
      <Box
        sx={{
          mt: "-30px",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Search pageKey="start" isSearchResultsPage={false} />
      </Box>
    </>
  );
}
