import fileDownload from "js-file-download";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { useEffect, useState } from "react";
import { useHead } from "@unhead/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import DomainMenu from "../components/DomainMenu";
import Footer from "../components/Footer/Footer";
import InteractiveMap from "../components/InteractiveMap";
import Itinerary from "../components/Itinerary/Itinerary";
import TourDetailProperties from "../components/TourDetailProperties";
import { get_currLanguage, parseFileName } from "../utils/globals";
import {
  useGetCitiesQuery,
  useGetTourQuery,
  useLazyGetGPXQuery,
  useLazyGetProviderGpxOkQuery,
  useLazyGetToursQuery,
} from "../features/apiSlice";
import TourCard from "../components/TourCard";

import { useAppDispatch } from "../hooks";
import { citySlugUpdated, cityUpdated } from "../features/searchSlice";
import { useSelector } from "react-redux";
import { RootState } from "../";
import { CustomIcon } from "../icons/CustomIcon";
import LanguageMenu from "../components/LanguageMenu";

export default function DetailReworked() {
  const { cityOne } = useParams();
  const { idOne } = useParams();

  // Hovered stop coordinates from the connection timeline
  const [hoveredStop, setHoveredStop] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const { i18n } = useTranslation();

  const { data: tour, isFetching: isTourLoading } = useGetTourQuery({
    id: idOne || "",
    city: cityOne,
  });

  const [triggerProviderPermit, { data: providerPermit }] =
    useLazyGetProviderGpxOkQuery();

  const [triggerGPX, { data: track, isLoading: isGpxLoading }] =
    useLazyGetGPXQuery();
  const [triggerFromTourGPX, { data: fromTourTrack }] = useLazyGetGPXQuery();
  const [triggerToTourGPX, { data: toTourTrack }] = useLazyGetGPXQuery();

  const dispatch = useAppDispatch();
  const { data: allCities = [], isSuccess: areCitiesLoaded } =
    useGetCitiesQuery();
  const city = useSelector((state: RootState) => state.search.city);
  const provider = useSelector((state: RootState) => state.search.provider);

  const [
    triggerLoadTours,
    { data: suggestedTours, isFetching: isSuggestionsLoading },
  ] = useLazyGetToursQuery();

  // Sync route param → Redux (URL is source of truth on this page)
  useEffect(() => {
    if (!areCitiesLoaded) return;
    const resolved =
      cityOne && cityOne !== "no-city"
        ? (allCities.find((c) => c.value === cityOne) ?? null)
        : null;
    dispatch(cityUpdated(resolved));
    dispatch(citySlugUpdated(resolved?.value ?? null));
  }, [allCities, areCitiesLoaded, cityOne, dispatch]);

  const providerUrl = () => {
    let url = tour?.url;
    // Bedingung für die spezielle URL-Konstruktion
    if (tour?.provider === "bahnzumberg" && city) {
      url += "ab-" + city.value + "/";
    }
    return url;
  };

  // Translation-related
  const { t } = useTranslation();

  const handleCloseTab = () => {
    window.close();
    if (!window.closed) {
      goToSearchPage();
    }
  };

  const navigate = useNavigate();

  const goToSearchPage = () => {
    const langParam = get_currLanguage(i18n);
    const params = new URLSearchParams();
    params.set("lang", langParam);
    if (city) params.set("city", city.value);
    navigate(`/search?${params}`);
  };

  // Intercept browser back button: navigate to /search with city
  useEffect(() => {
    const handlePopState = () => {
      const langParam = get_currLanguage(i18n);
      const params = new URLSearchParams();
      params.set("lang", langParam);
      if (city) params.set("city", city.value);
      navigate(`/search?${params}`, { replace: true });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [city, i18n, navigate]);

  const LoadingSpinner = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={50} />
    </div>
  );

  useEffect(() => {
    if (tour?.provider) {
      triggerProviderPermit(tour.provider);
    }
    if (tour && idOne) {
      triggerGPX(tour.gpx_file);
      if (city) {
        triggerFromTourGPX(tour.fromtour_gpx_file);
        triggerToTourGPX(tour.totour_gpx_file);
      }
    }
  }, [tour, city]);

  useEffect(() => {
    if (!isTourLoading && !tour) {
      triggerLoadTours({
        limit: 3,
        city: cityOne && cityOne !== "no-city" ? cityOne : "",
        currLanguage: get_currLanguage(i18n) || undefined,
      });
    }
  }, [isTourLoading, tour, cityOne, triggerLoadTours]);

  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    if (tour) {
      _mtm.push({ provider: tour.provider_name });
      _mtm.push({ range: tour.range });
      _mtm.push({ pagetitel: tour.title });
    }
  }, [tour]);

  const downloadButtonsDisabled = () => {
    return !tour || !tour.gpx_file;
  };

  async function downloadGpx() {
    if (tour?.id && tour?.gpx_file) {
      const gpxData = track;
      if (gpxData) {
        fileDownload(
          gpxData as unknown as string,
          parseFileName(tour.title, "zuugle_", ".gpx"),
        );
      }
    }
  }

  const actionButtonPart = (
    <Box className="tour-detail-action-btns-container">
      <>
        {providerPermit && (
          <Button
            variant="contained"
            startIcon={
              isGpxLoading ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                <DownloadIcon />
              )
            }
            disabled={downloadButtonsDisabled() || isGpxLoading}
            onClick={() => downloadGpx()}
            sx={{
              bgcolor: "var(--bzb-akelei)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              borderRadius: "10px",
              textTransform: "none",
              px: "16px",
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#5a1d61" },
              "&.Mui-disabled": { bgcolor: "#ccc", color: "#888" },
            }}
          >
            {t("main.gpx_download")}
          </Button>
        )}

        {!!downloadButtonsDisabled() && (
          <div style={{ marginTop: "10px" }}>
            <span
              style={{ fontSize: "12px", color: "#101010", lineHeight: "12px" }}
            >
              {t("Details.gpx_loading_notice")}
            </span>
          </div>
        )}
      </>
    </Box>
  );

  const currLanguage = get_currLanguage(i18n);

  let page_title = "Zuugle";
  let imageUrl = "";
  let description = "";
  if (tour) {
    page_title = "Zuugle: " + tour.title + " (" + tour.provider_name + ")";
    imageUrl = tour?.image_url ?? "";
    description = tour?.description ?? "";
  }

  useHead({
    title: page_title,
    meta: [
      { "http-equiv": "content-language", content: currLanguage },
      { name: "title", content: page_title },
      { name: "description", content: description },
      {
        property: "og:url",
        content:
          city && idOne
            ? `https://${window.location.host}/tour/${idOne}/${city.value}`
            : "",
      },
      { property: "og:title", content: page_title },
      { property: "og:description", content: "" },
      { property: "og:image", content: imageUrl },
      {
        property: "twitter:url",
        content:
          city && idOne
            ? `https://${window.location.host}/tour/${idOne}/${city.value}`
            : "",
      },
      { property: "twitter:title", content: page_title },
      { property: "twitter:description", content: description },
      { property: "twitter:image", content: imageUrl },
    ],
    link: [
      {
        rel: "alternate",
        href: `https://${window.location.hostname}/tour/${idOne}/no-city`,
      },
      ...(tour?.canonical ?? []).map((entry) => ({
        key: entry.zuugle_url,
        rel: entry.canonical_yn === "y" ? "canonical" : "alternate",
        href: `https://${entry.zuugle_url}`,
        hrefLang: entry.href_lang,
      })),
    ],
  });

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Box
          className="search-result-header-container"
          sx={{ pb: "0 !important" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: "1400px",
              mx: "auto",
              px: { xs: "15px", sm: "30px" },
              py: "7px",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{ ml: "-13px", mr: "4px", cursor: "pointer" }}
                onClick={handleCloseTab}
              >
                <CustomIcon
                  name="arrowBefore"
                  style={{ stroke: "#fff", width: "34px", height: "34px" }}
                />
              </Box>
              <DomainMenu />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <LanguageMenu />
            </Box>
          </Box>
        </Box>
      </Box>
      {isTourLoading ? (
        <LoadingSpinner />
      ) : !tour ? (
        <Box
          sx={{
            maxWidth: "960px",
            mx: "auto",
            px: { xs: "15px", sm: "30px" },
            py: "48px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
              py: "48px",
              px: "24px",
              mb: "48px",
              borderRadius: "16px",
              bgcolor: "rgba(37, 73, 128, 0.06)",
              border: "1px solid rgba(37, 73, 128, 0.12)",
            }}
          >
            <SearchOffIcon
              sx={{ fontSize: 56, color: "rgba(37, 73, 128, 0.45)" }}
            />
            <Typography variant="h4" sx={{ color: "#101010", fontWeight: 600 }}>
              {t("details.tour_nicht_mehr_verfuegbar")}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
            >
              {t("start.suche")}
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: "16px", color: "#101010" }}>
            {t(
              city
                ? "start.beliebte_bergtouren_nahe"
                : "start.beliebte_bergtouren",
            )}
          </Typography>
          {isSuggestionsLoading ? (
            <CircularProgress />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: "20px",
              }}
            >
              {(suggestedTours?.tours ?? []).slice(0, 3).map((st, i) => (
                <Box key={i} sx={{ display: "flex", minWidth: 0 }}>
                  <TourCard
                    tour={st}
                    city={city?.value ?? ""}
                    provider={provider}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {/* ─── Content wrapper (full width, max 1400px) ─── */}
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              px: { xs: "15px", sm: "30px" },
            }}
          >
            {/* ─── Title ─── */}
            <Box className="tour-detail-header">
              <Typography
                variant="title"
                component="h1"
                sx={{ color: "#101010" }}
              >
                {tour?.title}
              </Typography>
              {tour?.range && (
                <Chip
                  label={tour.range}
                  size="small"
                  sx={{
                    mt: "8px",
                    bgcolor: "rgba(37, 73, 128, 0.85)",
                    color: "#fff",
                  }}
                />
              )}
            </Box>

            {/* ─── Description (full width, under title) ─── */}
            {tour?.description && (
              <Box sx={{ textAlign: "left", pb: "12px" }}>
                <Typography variant="body1" sx={{ lineHeight: "1.6" }}>
                  {tour.description}
                </Typography>
              </Box>
            )}

            {/* ─── Info row: KPIs (left) | Provider (right) ─── */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: "16px",
                pb: "16px",
                alignItems: { md: "stretch" },
              }}
            >
              {/* LEFT: KPIs – Wolkenblau box – same width as Fahrplan column */}
              <Box
                sx={{
                  flex: { md: "1 1 50%" },
                  alignSelf: { md: "stretch" },
                  minWidth: 0,
                  bgcolor: "rgba(170, 181, 215, 0.25)",
                  borderRadius: "12px",
                  px: "16px",
                  py: "12px",
                }}
              >
                <TourDetailProperties tour={tour} />
              </Box>

              {/* RIGHT: Provider info – Lindgrün box – same width as Map column */}
              {!!tour && (
                <Box
                  sx={{
                    flex: { md: "1 1 50%" },
                    alignSelf: { md: "stretch" },
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    bgcolor: "rgba(204, 216, 161, 0.4)",
                    borderRadius: "12px",
                    px: "16px",
                    py: "12px",
                  }}
                >
                  <img
                    src={`/icons/provider/logo_${tour.provider}.svg`}
                    alt={tour.provider_name}
                    style={{
                      borderRadius: "100%",
                      height: "64px",
                      width: "64px",
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "20px",
                        color: "#101010",
                      }}
                    >
                      {tour.provider_name}
                    </Typography>
                    <a
                      href={providerUrl()}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        color: "var(--bzb-akelei)",
                        wordBreak: "break-all",
                      }}
                    >
                      {tour.url}
                    </a>
                  </Box>
                </Box>
              )}
            </Box>

            {/* ═══════════════════════════════════════════════ */}
            {/* ─── DOMINANT SECTION: Fahrplan + Map ─── */}
            {/* ═══════════════════════════════════════════════ */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "flex-start" },
                gap: "16px",
                mt: "8px",
                /* Make these panels fill most of the viewport */
                minHeight: { md: "calc(100vh - 320px)" },
              }}
            >
              {/* ─── LEFT: Fahrplan (on desktop) / 1st on mobile ─── */}
              <Box
                sx={{
                  flex: { md: "1 1 50%" },
                  minWidth: 0,
                  minHeight: { xs: "400px", md: "unset" },
                  order: { xs: 1, md: 1 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  className="tour-detail-itinerary-container"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <Itinerary
                    tour={tour}
                    tourId={idOne}
                    onStopHover={setHoveredStop}
                  />
                </Box>
              </Box>

              {/* ─── RIGHT: Map + GPX (on desktop) / 2nd on mobile ─── */}
              <Box
                sx={{
                  flex: { md: "1 1 50%" },
                  minHeight: { xs: "350px", md: "unset" },
                  height: { md: "calc(100vh - 80px)" },
                  order: { xs: 2, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  pt: { md: "20px" },
                  gap: "12px",
                  position: { md: "sticky" },
                  top: { md: "72px" },
                  alignSelf: { md: "flex-start" },
                }}
              >
                {track && (
                  <Box
                    sx={{
                      flex: { md: 1 },
                      height: { xs: "350px", md: "auto" },
                      borderRadius: "12px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                    className="tour-detail-map-container"
                  >
                    <InteractiveMap
                      gpxPositions={track || []}
                      anreiseGpxPositions={toTourTrack || []}
                      abreiseGpxPositions={fromTourTrack || []}
                      scrollWheelZoom={true}
                      hoveredStop={hoveredStop}
                    />
                  </Box>
                )}
                {/* GPX Download + Share below the map */}
                {idOne && actionButtonPart}
              </Box>
            </Box>
          </Box>
          <Footer></Footer>
        </Box>
      )}
    </>
  );
}
