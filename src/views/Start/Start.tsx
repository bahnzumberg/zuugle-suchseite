import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useIsMobile } from "../../utils/muiUtils";
import {
  usePageHeader,
  getTranslatedCountryName,
} from "../../utils/seoPageHelper";
import Header from "./Header";
import {
  useGetTotalsQuery,
  useLazyGetToursQuery,
} from "../../features/apiSlice";
import { RootState } from "../..";
import StartTourCardContainer from "../../components/StartTourCardContainer";
import { useSelector } from "react-redux";
import SearchParamSync from "../../components/SearchParamSync";
import { useAppDispatch } from "../../hooks";
import { mapUpdated } from "../../features/searchSlice";
import RangeCardContainer from "../../components/RangeCardContainer";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// Dynamische Imports für nicht-kritische Komponenten
import KPIContainer from "../../components/KPIContainer";
import MapBtn from "../../components/Search/MapBtn";
import Footer from "../../components/Footer/Footer";

export default function Start() {
  const { t } = useTranslation();
  const citySlug = useSelector((state: RootState) => state.search.citySlug);
  const city = useSelector((state: RootState) => state.search.city);
  const provider = useSelector((state: RootState) => state.search.provider);
  const language = useSelector((state: RootState) => state.search.language);
  const dispatch = useAppDispatch();

  // Flag to prevent multiple API calls during initialization
  const [isInitialized, setIsInitialized] = useState(false);

  usePageHeader({
    header: `Zuugle ${city?.label || t(getTranslatedCountryName())}`,
    description: t("index.zuugle_description"),
  });

  const { data: totals, isFetching: isTotalsLoading } = useGetTotalsQuery(
    citySlug || undefined,
  );
  const [
    triggerLoadTours,
    {
      data: loadedTours = { tours: [], ranges: [], total: 0 },
      isFetching: isToursLoading,
    },
  ] = useLazyGetToursQuery();

  const isMobile = useIsMobile();

  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Startseite" });
  }, []);

  useEffect(() => {
    dispatch(mapUpdated(false));
  }, []);

  // Wait for SearchParamSync to finish updating Redux before allowing API calls
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only trigger after initialization to prevent duplicate calls
    if (!isInitialized) return;

    triggerLoadTours({
      limit: 10,
      city: citySlug ?? "",
      provider: provider || undefined,
      ranges: true,
      currLanguage: language || undefined,
    });
  }, [citySlug, provider, language, isInitialized]);

  const getRangeText = () => {
    if (city) {
      return t("start.schoene_wanderungen_nahe");
    } else {
      return t("start.schoene_wanderungen");
    }
  };

  const getFavouriteToursText = () => {
    if (city) {
      return t("start.beliebte_bergtouren_nahe");
    } else {
      return t("start.beliebte_bergtouren");
    }
  };

  return (
    <>
      <SearchParamSync isMain={false} />
      <Box style={{ background: "#fff" }}>
        <Header
          totalTours={totals?.tours_country || 0}
          totalToursFromCity={totals?.tours_city || 0}
          isLoading={isTotalsLoading}
        />
      </Box>

      {!isTotalsLoading && (
        <>
          {totals?.total_tours && totals?.total_tours > 0 && (
            <>
              <Box style={{ background: "#fff" }}>
                <Paper elevation={0} className={"header-line"}>
                  <Box
                    sx={{
                      paddingTop: "55px",
                      paddingBottom: "20px",
                    }}
                  >
                    <Typography color={"#FFFFFF"} sx={{ textAlign: "center" }}>
                      {t("start.zuugle_sucht_fuer_dich_1")}{" "}
                      {totals?.total_provider}{" "}
                      {t("start.zuugle_sucht_fuer_dich_2")}
                    </Typography>
                  </Box>
                </Paper>
                <Box className={"start-body-container"}>
                  <Box
                    sx={{
                      marginTop: "20px",
                      padding: isMobile ? "30px 20px" : "30px 10px",
                      background: "#EBEBEB",
                      borderRadius: "30px",
                    }}
                  >
                    <Typography
                      variant={"h4"}
                      sx={{
                        textAlign: "left",
                        paddingTop: "20px",
                        paddingBottom: "15px",
                        marginLeft: !isMobile ? "64px" : null,
                      }}
                    >
                      {getFavouriteToursText()}
                    </Typography>
                    <StartTourCardContainer
                      tours={loadedTours.tours}
                      city={city?.value || ""}
                      isLoading={isToursLoading}
                      provider={provider}
                    />
                  </Box>
                  <Box style={{ padding: "30px 40px" }}>
                    <Typography
                      variant={"h4"}
                      sx={{
                        textAlign: "left",
                        paddingBottom: "15px",
                        paddingTop: "15px",
                      }}
                    >
                      {getRangeText()}
                    </Typography>
                    {/* RangeCardContainer ist wieder statisch importiert */}
                    <RangeCardContainer ranges={loadedTours.ranges} />
                  </Box>
                  <Box sx={{ marginTop: "80px" }}>
                    <KPIContainer
                      totalTours={totals?.total_tours || 0}
                      totalConnections={totals?.total_connections || 0}
                      totalCities={totals?.total_cities || 0}
                      totalProvider={totals?.total_provider || 0}
                    />
                  </Box>
                </Box>
              </Box>
              <Link
                to={`/search/?map=true` + (provider ? `&p=${provider}` : "")}
              >
                <MapBtn />
              </Link>
            </>
          )}
          <Footer />
        </>
      )}
    </>
  );
}
