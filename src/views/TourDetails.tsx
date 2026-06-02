import * as React from "react";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import fileDownload from "js-file-download";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";
import { useHead } from "@unhead/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import DomainMenu from "../components/DomainMenu";
import Footer from "../components/Footer/Footer";
import InteractiveMap from "../components/InteractiveMap";
import Itinerary from "../components/Itinerary/Itinerary";
import TourDetailProperties from "../components/TourDetailProperties";
import { get_currLanguage, parseFileName, shortenText } from "../utils/globals";
import Search from "../components/Search/Search";
import {
  useGetCitiesQuery,
  useGetTourQuery,
  useLazyGetGPXQuery,
  useLazyGetProviderGpxOkQuery,
} from "../features/apiSlice";

import { useAppDispatch } from "../hooks";
import { citySlugUpdated, cityUpdated } from "../features/searchSlice";
import { useSelector } from "react-redux";
import { RootState } from "../";
import { CustomIcon } from "../icons/CustomIcon";
import LanguageMenu from "../components/LanguageMenu";

export default function DetailReworked() {
  //Whether social media share buttons should be shown
  const [socialMediaDropDownToggle, setSocialMediaDropDownToggle] =
    useState(false);
  const { cityOne } = useParams();
  const { idOne } = useParams();

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

  const shareUrl = () => {
    let _shareUrl = "";
    if (city && idOne) {
      _shareUrl = `https://${window.location.host}/tour/${idOne}/${city.value} `;
    }
    return _shareUrl;
  };

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
    navigate(`/search` + (city ? `?city=${city.value}` : ""));
  };

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

  //max number of characters used per specific UI element (buttons)
  const maxLength = 35;

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

  const shareButtonHandler = (event: React.MouseEvent<HTMLElement>) => {
    const clickedElement = event.target as HTMLElement;
    const svgButton = clickedElement?.closest(".share-button"); // Find the closest parent with class "share-button"

    if (svgButton) {
      setSocialMediaDropDownToggle((current) => !current);
    }
  };

  // Shared icon styling for social media buttons
  const socialIconStyle = {
    fontSize: 24,
    color: "#FFFFFF",
    marginLeft: "12px",
    marginRight: "4px",
  };

  const copyIconStyle = {
    fontSize: 24,
    color: "#101010",
    marginLeft: "4px",
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
            className="tour-detail-action-btns"
            disabled={downloadButtonsDisabled()}
            onClick={() => {
              downloadGpx();
            }}
          >
            <CustomIcon
              name="downlaodIcon"
              style={{
                width: "25px",
                height: "25px",
                stroke: "#FFFFFF",
                fill: "none",
              }}
            />
            <span style={{ color: "#FFFFFF", width: "45px" }}>GPX</span>
            {isGpxLoading ? (
              <CircularProgress
                sx={{ width: "20px", height: "20px", fontWeight: 600 }}
                size={"small"}
              />
            ) : (
              <span style={{ color: "#FFFFFF", paddingLeft: "8px" }}>
                {t("details.track_gps_geraet")}
              </span>
            )}
          </Button>
        )}

        {/*
        Share button
        When clicked, a link will be generated and the social media options will be shown
        */}
        <Button
          className="tour-detail-action-btns share-button"
          disabled={false}
          onClick={shareButtonHandler}
        >
          <CustomIcon
            name="shareIcon"
            style={{
              width: "25px",
              height: "25px",
              stroke: "#FFFFFF",
              fill: "none",
            }}
          />
          <span style={{ color: "#FFFFFF", width: "45px" }}>
            {t("details.teilen")}
          </span>
          <span style={{ color: "#FFFFFF", paddingLeft: "8px" }}>
            {shortenText(t("details.teilen_description"), 0, maxLength)}
          </span>
        </Button>

        {socialMediaDropDownToggle && shareUrl() !== null && (
          <div>
            <TwitterShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{
                borderRadius: "12px",
                backgroundColor: "#000000",
                border: "none",
              }}
              url={shareUrl()}
              title={t("details.teilen_text")}
            >
              <XIcon sx={socialIconStyle} />
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>X</span>
            </TwitterShareButton>
            <EmailShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{
                borderRadius: "12px",
                backgroundColor: "#EA4335",
                border: "none",
              }}
              url={shareUrl()}
              subject={"Zuugle Tour"}
              body={t("details.teilen_text")}
            >
              <EmailIcon sx={socialIconStyle} />
              <span
                style={{ color: "#FFFFFF", width: "43px", fontWeight: 600 }}
              >
                Email
              </span>
            </EmailShareButton>
            <FacebookShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{
                borderRadius: "12px",
                backgroundColor: "#1877F2",
                border: "none",
              }}
              url={shareUrl()}
              hashtag={"Zuugle"}
            >
              <FacebookIcon sx={socialIconStyle} />
              <span
                style={{ color: "#FFFFFF", width: "43px", fontWeight: 600 }}
              >
                Facebook
              </span>
            </FacebookShareButton>
            <WhatsappShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{
                borderRadius: "12px",
                backgroundColor: "#25D366",
                border: "none",
              }}
              url={shareUrl()}
              title={t("details.teilen_text")}
            >
              <WhatsAppIcon sx={socialIconStyle} />
              <span
                style={{ color: "#FFFFFF", width: "43px", fontWeight: 600 }}
              >
                WhatsApp
              </span>
            </WhatsappShareButton>
            <Button
              className="tour-detail-action-btns"
              style={{
                borderRadius: "12px",
                backgroundColor: "#F5F5F5",
                border: "1.5px solid #101010",
              }}
              onClick={() => {
                navigator.clipboard.writeText(shareUrl());
              }}
            >
              <ContentPasteIcon sx={copyIconStyle} />
              <span
                style={{ color: "#101010", width: "43px", fontWeight: 600 }}
              >
                {t("details.kopieren")}
              </span>
            </Button>
          </div>
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
      { property: "og:url", content: shareUrl() },
      { property: "og:title", content: page_title },
      { property: "og:description", content: "" },
      { property: "og:image", content: imageUrl },
      { property: "twitter:url", content: shareUrl() },
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
        <Box className="search-result-header-container">
          <Box component={"div"} className="rowing">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{ mr: "16px", cursor: "pointer" }}
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
      </Box>
      {isTourLoading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          {/* ─── Content wrapper (full width, max 1400px) ─── */}
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              px: { xs: "16px", md: "24px" },
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
                    src={`/app_static/icons/provider/logo_${tour.provider}.svg`}
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
                  <Itinerary tour={tour} tourId={idOne} />
                </Box>
              </Box>

              {/* ─── RIGHT: Map + GPX (on desktop) / 2nd on mobile ─── */}
              <Box
                sx={{
                  flex: { md: "1 1 50%" },
                  minHeight: { xs: "350px", md: "unset" },
                  height: { md: "calc(100vh - 320px)" },
                  order: { xs: 2, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  pt: { md: "20px" },
                  gap: "12px",
                  position: { md: "sticky" },
                  top: { md: "16px" },
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
                      scrollWheelZoom={false}
                    />
                  </Box>
                )}
                {/* GPX Download + Share below the map */}
                {city && idOne && actionButtonPart}
              </Box>
            </Box>
          </Box>
          <Footer></Footer>
        </Box>
      )}
    </>
  );
}
