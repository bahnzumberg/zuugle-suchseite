import * as React from "react";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Divider } from "@mui/material";
import fileDownload from "js-file-download";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Head } from "@unhead/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useParams, useSearchParams } from "react-router-dom";
import "dayjs/plugin/isBetween";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import DomainMenu from "../../components/DomainMenu";
import Footer from "../../components/Footer/Footer";
import InteractiveMap from "../../components/InteractiveMap";
import Itinerary from "../../components/Itinerary/Itinerary";
import TourDetailProperties from "../../components/TourDetailProperties";
import ArrowBefore from "../../icons/ArrowBefore";
import Close from "../../icons/Close";
import DownloadIcon from "../../icons/DownloadIcon";
import ShareIcon from "../../icons/ShareIcon";
import {
  get_currLanguage,
  parseFileName,
  shortenText,
} from "../../utils/globals";
import Search from "../../components/Search/Search";
import {
  useGetCitiesQuery,
  useGetTourQuery,
  useLazyGetCombinedGPXQuery,
  useLazyGetConnectionsExtendedQuery,
  useLazyGetGPXQuery,
  useLazyGetProviderGpxOkQuery,
} from "../../features/apiSlice";
import { Connection, ConnectionResult } from "../../models/Connections";
import { useAppDispatch } from "../../hooks";
import { citySlugUpdated, cityUpdated } from "../../features/searchSlice";
import { useSelector } from "react-redux";
import { RootState } from "../..";

export default function DetailReworked() {
  const [activeConnection, setActiveConnection] =
    useState<ConnectionResult | null>(null);
  const [activeReturnConnection, setActiveReturnConnection] =
    useState<Connection | null>(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tourDifficulty, setTourDifficulty] = useState<string | null>(null);
  const [renderImage, setRenderImage] = useState(false);
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
  const [triggerConnections, { data: connections }] =
    useLazyGetConnectionsExtendedQuery();
  const [triggerGPX, { data: track, isLoading: isGpxLoading }] =
    useLazyGetGPXQuery();
  const [triggerFromTourGPX, { data: fromTourTrack }] = useLazyGetGPXQuery();
  const [currentFromTourGPX, setCurrentFromTourGPX] = useState("");
  const [triggerToTourGPX, { data: toTourTrack }] = useLazyGetGPXQuery();
  const [currentToTourGPX, setCurrentToTourGPX] = useState("");
  const [triggerCombinedGPX] = useLazyGetCombinedGPXQuery();

  const dispatch = useAppDispatch();
  const { data: allCities = [] } = useGetCitiesQuery();
  const city = useSelector((state: RootState) => state.search.city);

  useEffect(() => {
    if (allCities) {
      if (cityOne && cityOne !== "no-city") {
        const city = allCities.find((c) => c.value === cityOne);
        if (city) {
          dispatch(cityUpdated(city));
          dispatch(citySlugUpdated(city.value));
        } else {
          dispatch(cityUpdated(null));
          dispatch(citySlugUpdated(null));
        }
      } else if (!cityOne || cityOne === "no-city") {
        dispatch(cityUpdated(null));
        dispatch(citySlugUpdated(null));
      }
    }
  }, [allCities, cityOne]);

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
  const translateDiff = (diff: string) => {
    if (diff === "Leicht" || diff === "leicht") {
      return t("start.leicht");
    } else if (diff === "Schwer" || diff === "schwer") {
      return t("start.schwer");
    } else return t("start.mittel");
  };

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
    if (tour?.difficulty) {
      setTourDifficulty(tour.difficulty);
    }
    // only load connections if the tour is valid
    if (tour && idOne) {
      triggerGPX(tour.gpx_file);
      setRenderImage(!!tour?.image_url);
      if (city) {
        triggerConnections({
          id: idOne,
          city: city.value,
        });
        triggerFromTourGPX(tour.fromtour_gpx_file);
        setCurrentFromTourGPX(tour.fromtour_gpx_file);
        triggerToTourGPX(tour.totour_gpx_file);
        setCurrentToTourGPX(tour.totour_gpx_file);
      }
    }
  }, [tour, city]);

  useEffect(() => {
    const _mtm = (window._mtm = window._mtm || []);
    if (tour) {
      _mtm.push({ provider: tour.provider_name });
      _mtm.push({ range: tour.range });
      _mtm.push({ pagetitel: tour.title });
    }
  }, [tour]);

  useEffect(() => {
    setSocialMediaDropDownToggle(false);
  }, [dateIndex]);

  useEffect(() => {
    let index = dateIndex;
    if (connections) {
      // Get date from searchParams and check its validity
      const date = dayjs(searchParams.get("datum"));
      if (date.isValid()) {
        const startDate = dayjs(connections[0].date);
        const endDate = dayjs(connections[6].date);

        // Check if the date is between the startDate and endDate (inclusive)
        if (date.isBetween(startDate, endDate, "day", "[]")) {
          // Find the index of the connection that matches the date
          index = connections.findIndex(
            (connection) =>
              dayjs(connection.date).format("DD.MM.YYYY") ===
              date.format("DD.MM.YYYY"),
          );
          setDateIndex(index);
        } else {
          goToSearchPage();
        }
      }

      // Ensure the index is valid before setting active connection
      if (index !== -1 && connections[index]) {
        setActiveConnection(connections[index]);
        setActiveReturnConnection(connections[index].returns[0]);
      }
    }
  }, [connections]);

  // update toTour and fromTour GPX if necessary
  useEffect(() => {
    const newToTourGPX = activeConnection?.connections[0]?.gpx_file;
    if (newToTourGPX && newToTourGPX !== currentToTourGPX) {
      triggerToTourGPX(newToTourGPX);
      setCurrentToTourGPX(newToTourGPX);
    }

    const newFromTourGPX = activeReturnConnection?.gpx_file;
    if (newFromTourGPX && newFromTourGPX !== currentFromTourGPX) {
      triggerFromTourGPX(newFromTourGPX);
      setCurrentFromTourGPX(newFromTourGPX);
    }
  }, [activeConnection, activeReturnConnection]);

  const downloadButtonsDisabled = () => {
    return (
      !tour ||
      !tour.gpx_file ||
      !activeConnection?.connections[0]?.totour_track_key ||
      !activeReturnConnection?.fromtour_track_key
    );
  };

  const updateConnIndex = (index: number) => {
    setDateIndex(index);
    setActiveConnection(connections ? connections[index] : null);
    setActiveReturnConnection(
      connections ? connections[index].returns[0] : null,
    );
  };

  const shareButtonHandler = (event: React.MouseEvent<HTMLElement>) => {
    const clickedElement = event.target as HTMLElement;
    const svgButton = clickedElement?.closest(".share-button"); // Find the closest parent with class "share-button"

    if (svgButton) {
      setSocialMediaDropDownToggle((current) => !current);
    }
  };

  async function downloadGpx() {
    if (
      tour?.id &&
      activeReturnConnection?.fromtour_track_key &&
      activeConnection?.connections[0]?.totour_track_key
    ) {
      const res = await triggerCombinedGPX({
        id: tour?.id,
        key_anreise: activeConnection.connections[0].totour_track_key,
        key_abreise: activeReturnConnection.fromtour_track_key,
      }).unwrap();
      if (res) {
        fileDownload(res, parseFileName(tour.title, "zuugle_", ".gpx"));
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
            <DownloadIcon />
            <span style={{ color: "#101010", width: "43px" }}>GPX</span>
            {isGpxLoading ? (
              <CircularProgress
                sx={{ width: "20px", height: "20px", fontWeight: 600 }}
                size={"small"}
              />
            ) : (
              <span style={{ color: "#8B8B8B", paddingLeft: "8px" }}>
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
          <ShareIcon />
          <span style={{ color: "#101010", width: "43px", fontWeight: 600 }}>
            {t("details.teilen")}
          </span>
          <span
            style={{ color: "#8B8B8B", marginLeft: "15px", paddingLeft: "8px" }}
          >
            {shortenText(t("details.teilen_description"), 0, maxLength)}
          </span>
        </Button>

        {socialMediaDropDownToggle && shareUrl() !== null && (
          <div>
            <TwitterShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{ borderRadius: "12px", backgroundColor: "#00aced" }}
              url={shareUrl()}
              title={t("details.teilen_text")}
            >
              <TwitterIcon size={40} round={true} />
              <span
                style={{ color: "#101010", width: "43px", fontWeight: 600 }}
              >
                Twitter
              </span>
            </TwitterShareButton>
            <EmailShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{ borderRadius: "12px", backgroundColor: "#7f7f7f" }}
              url={shareUrl()}
              subject={"Zuugle Tour"}
              body={t("details.teilen_text")}
            >
              <EmailIcon size={40} round={true} />
              <span
                style={{ color: "#101010", width: "43px", fontWeight: 600 }}
              >
                Email
              </span>
            </EmailShareButton>
            <FacebookShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{ borderRadius: "12px", backgroundColor: "#3b5998" }}
              url={shareUrl()}
              hashtag={"Zuugle"}
            >
              <FacebookIcon size={40} round={true} />
              <span
                style={{ color: "#101010", width: "43px", fontWeight: 600 }}
              >
                Facebook
              </span>
            </FacebookShareButton>
            <WhatsappShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{ borderRadius: "12px", backgroundColor: "#25d366" }}
              url={shareUrl()}
              title={t("details.teilen_text")}
            >
              <WhatsappIcon size={40} round={true} />
              <span
                style={{ color: "#101010", width: "43px", fontWeight: 600 }}
              >
                Whatsapp
              </span>
            </WhatsappShareButton>
            <Button
              className="tour-detail-action-btns"
              style={{
                borderRadius: "12px",
                backgroundColor: "#d8d3cd",
                border: "none",
              }}
              onClick={() => {
                navigator.clipboard.writeText(shareUrl());
              }}
            >
              <ContentPasteIcon color="info"></ContentPasteIcon>
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

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      {isTourLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Head>
            <title>{page_title}</title>
            <meta httpEquiv="content-language" content={`${currLanguage}`} />
            <meta name="title" content={`${page_title}`} />
            <meta name="description" content={`${description}`} />
            <meta property="og:url" content={`${shareUrl()}`} />
            <meta property="og:title" content={`${page_title}`} />
            <meta property="og:description" content="" />
            <meta property="og:image" content={`${imageUrl}`} />
            <meta property="twitter:url" content={`${shareUrl()}`} />
            <meta property="twitter:title" content={`${page_title}`} />
            <meta property="twitter:description" content={`${description}`} />
            <meta property="twitter:image" content={`${imageUrl}`} />
            <link
              rel="alternate"
              href={`https://${window.location.hostname}/tour/${idOne}/no-city`}
            />
            {tour?.valid_tour === 1 &&
              tour.canonical.length > 0 &&
              tour.canonical.map((entry) => {
                if (entry.canonical_yn === "y") {
                  return (
                    <link
                      key={entry.zuugle_url}
                      rel="canonical"
                      href={`https://${entry.zuugle_url}`}
                      hrefLang={`${entry.href_lang}`}
                    />
                  );
                } else {
                  return (
                    <link
                      key={entry.zuugle_url}
                      rel="alternate"
                      href={`https://${entry.zuugle_url}`}
                      hrefLang={`${entry.href_lang}`}
                    />
                  );
                }
              })}
          </Head>
          <Box className="newHeader" sx={{ position: "relative" }}>
            <Box component={"div"} className="rowing blueDiv">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{ mr: "16px", cursor: "pointer", zIndex: "1301" }}
                  onClick={handleCloseTab}
                >
                  <ArrowBefore
                    style={{ stroke: "#fff", width: "34px", height: "34px" }}
                  />
                </Box>
                <DomainMenu />
              </Box>
              <Box
                sx={{ mr: "16px", cursor: "pointer", zIndex: "1301" }}
                onClick={handleCloseTab}
              >
                <Close
                  style={{
                    stroke: "#fff",
                    fill: "#fff",
                    width: "24px",
                    height: "24px",
                  }}
                />
              </Box>
            </Box>
            {/* search bar ###### section */}
            <Box
              sx={{
                backgroundColor: "#FFF",
                position: "absolute",
                bottom: "0",
                transform: "translate(-50%, 50%)",
                display: "inline-flex",
                borderRadius: "20px",
                padding: "12px 15px",
                border: "2px solid #ddd",
                width: "100%",
                maxWidth: {
                  xs: "325px",
                  md: "600px",
                },
                boxSizing: "border-box",
                boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
                zIndex: "1300",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Search pageKey="detail" isMain={false} />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box className="tour-detail-header">
              <Box className="mt-3">
                <Typography variant="title">{tour?.title}</Typography>
              </Box>
              <Box className="mt-3">
                <span className="tour-detail-tag">{tour?.range}</span>
              </Box>
            </Box>
            <div>
              {track && (
                <Box
                  sx={{ width: "100%", position: "relative" }}
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
              <div className="tour-detail-data-container">
                <Box>
                  <TourDetailProperties tour={tour}></TourDetailProperties>
                  <Box sx={{ textAlign: "left" }}>
                    <div className="tour-detail-difficulties">
                      <span className="tour-detail-difficulty">
                        {tourDifficulty && translateDiff(tourDifficulty)}
                      </span>
                    </div>
                    <Typography variant="textSmall">
                      {tour?.description}
                    </Typography>
                  </Box>
                  <a
                    className="tour-detail-provider-container"
                    href={providerUrl()}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="tour-detail-provider-icon">
                      {!!tour && (
                        <img
                          src={`/app_static/icons/provider/logo_${tour.provider}.svg`}
                          alt={tour.provider_name}
                          style={{
                            borderRadius: "100%",
                            height: "48px",
                            width: "48px",
                          }}
                        />
                      )}
                    </div>
                    <div className="tour-detail-provider-name-link">
                      <span className="tour-detail-provider-name">
                        {tour?.provider_name}
                      </span>
                      <span className="tour-detail-provider-link">
                        {tour?.url}
                      </span>
                    </div>
                  </a>
                  {renderImage && tour?.valid_tour === 1 && (
                    <Box className="tour-detail-conditional-desktop">
                      <Divider variant="middle" />
                      <div className="tour-detail-img-container">
                        <img
                          src={tour?.image_url ?? ""}
                          onError={() => {
                            setRenderImage(false);
                          }}
                          alt={tour?.title}
                        />
                      </div>
                    </Box>
                  )}
                  {city && idOne && (
                    <Box className="tour-detail-conditional-desktop">
                      {actionButtonPart}
                    </Box>
                  )}
                </Box>
                <Box className="tour-detail-itinerary-container">
                  <Itinerary
                    connectionData={connections}
                    dateIndex={dateIndex}
                    updateConnIndex={updateConnIndex}
                    tour={tour}
                    city={city?.value}
                    idOne={idOne}
                  />
                </Box>
                {renderImage && tour?.valid_tour === 1 && (
                  <Box className="tour-detail-conditional-mobile">
                    <Divider variant="middle" />
                    <div className="tour-detail-img-container">
                      <img
                        src={tour?.image_url}
                        onError={() => {
                          setRenderImage(false);
                        }}
                        alt={tour?.title}
                      />
                    </div>
                  </Box>
                )}
                {tour?.valid_tour === 1 && city && idOne && (
                  <Box className="tour-detail-conditional-mobile">
                    {actionButtonPart}
                  </Box>
                )}
              </div>
            </div>
            <div></div>
          </Box>
          <Footer></Footer>
        </>
      )}
    </Box>
  );
  // }
}
