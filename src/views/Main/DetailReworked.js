import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import GpxParser from "gpxparser";
import fileDownload from "js-file-download";
import * as React from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { useParams, useSearchParams } from "react-router-dom";
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
import { compose } from "redux";
import { loadAllCities, loadCities } from "../../actions/cityActions";
import { loadGPX } from "../../actions/fileActions";
import {
  loadTour,
  loadTourConnectionsExtended,
  loadTourGpx,
  loadTours,
} from "../../actions/tourActions";
import axios from "../../axios";
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
import transformToDescriptionDetail from "../../utils/transformJson";
import SearchContainer from "../Start/SearchContainer";
import "/src/config.js";

const DetailReworked = (props) => {
  const {
    loadTour,
    loadTourConnectionsExtended,
    loadGPX,
    loadTourGpx,
    isGpxLoading,
    tour,
    loadCities,
    loadAllCities,
  } = props;

  const [connections, setConnections] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);
  const [activeReturnConnection, setActiveReturnConnection] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [gpxPositions, setGpxPositions] = useState(null);
  const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
  const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);
  const [tourDifficulty, setTourDifficulty] = useState(null);
  const [renderImage, setRenderImage] = useState(null);
  //Whether social media share buttons should be shown
  const [socialMediaDropDownToggle, setSocialMediaDropDownToggle] =
    useState(false);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const { cityOne, idOne } = useParams();
  const [validTour, setValidTour] = useState(false);

  const { i18n } = useTranslation();

  let cityfromparam = searchParams.get("city");

  let _city = "";
  if (!!cityOne) {
    _city = cityOne;
  } else {
    if (!!cityfromparam) {
      _city = cityfromparam;
    }
  }
  const [cityI, setCityI] = useState(_city);

  const shareUrl = () => {
    let _shareUrl = "";
    if (!!_city && _city !== "no-city" && !!idOne) {
      _shareUrl = `https://${window.location.host}/tour/${idOne}/${_city} `;
    }
    return _shareUrl;
  };

  // Translation-related
  const { t } = useTranslation();
  const translateDiff = (diff) => {
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

  useEffect(() => {
    setCityI(_city);
  }, [_city]);


  const goToSearchPage = () => {
    !!cityOne && (cityOne !== "no-city") ? 
    navigate(`/search?city=${cityOne}`)
    :
    navigate(`/search`);
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

  const [providerPermit, setProviderPermit] = useState(true);

  useEffect(() => {
    if (!!tour) {
      if (tour.valid_tour === 1) {
        setValidTour(true);
      } else {
        setValidTour(false);
      }
    }
  }, [tour]);

  useEffect(() => {
    if (!!tour && tour?.provider) {
      setIsTourLoading(true);

      // API call to check the provider's permit
      // axios.get(`tours/provider/mapzssi`)  // test a case with value = 'n'
      axios
        .get(`tours/provider/${tour.provider}`)
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          // Check the `allow_gpx_download` value from the API response
          if (data.allow_gpx_download === "n") {
            setProviderPermit(false); // Set the state accordingly
            setIsTourLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching provider permit status:", error);
        })
        .finally(() => {
          setIsTourLoading(false);
        });
    }
  }, [tour, providerPermit]);

  React.useEffect(() => {
    var _mtm = (window._mtm = window._mtm || []);
    if (!!tour) {
      _mtm.push({ provider: tour.provider_name });
      _mtm.push({ range: tour.range });
      _mtm.push({ pagetitel: tour.title });
    }
  }, [tour]);

  useEffect(() => {
    setSocialMediaDropDownToggle(false);
  }, [dateIndex]);

  useEffect(() => {
    loadAllCities();
    loadCities({ limit: 5 });
    let tourId;
    if (idOne) {
      tourId = idOne;
    } else {
      tourId = !!searchParams.get("id")
        ? searchParams.get("id")
        : !!localStorage.getItem("tourId")
        ? localStorage.getItem("tourId")
        : null; // currently we only use localStorage for tourId
    }
    if (!!tourId) {
      setIsTourLoading(true);

      loadTour(tourId, _city)
        .then((tourExtracted) => {
          if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
            setTourDifficulty(
              !!tourExtracted.data.tour.difficulty &&
                tourExtracted.data.tour.difficulty
            );
          } else {
            setIsTourLoading(false);
            console.log("No tour data retrieved");
          }
        })
        .catch((error) => {
          console.error("Tour not found:", error);
          if (error.response && error.response.status === 404) {
            console.error("Tour not found:", error);
            goToSearchPage();
          } else {
            console.error("Other error:", error);
          }
        })
        .finally(() => {
          setIsTourLoading(false);
        });
    }

    if (tourId && _city && !connections && validTour) {
      setIsTourLoading(true);

      loadTourConnectionsExtended({ id: tourId, city: _city })
        .then((res) => {
          if (res && res.data) {
            !!res.data.result && setConnections(res.data.result);
            if (
              res?.data?.result?.[0]?.connections?.[0]
                ?.connection_description_json
            ) {
              let connectJson =
                res.data.result[0].connections[0].connection_description_json;
              Array.isArray(connectJson) &&
                transformToDescriptionDetail(connectJson);
            }
          }
        })
        .catch((err) => {
          console.error("error", err);
        })
        .finally(() => {
          setIsTourLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityOne, idOne, validTour]);

  useEffect(() => {
    if (tour && tour.valid_tour === 1) {
      setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
      setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
      setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
      setRenderImage(!!tour?.image_url);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour])

  useEffect(() => {
    let index = dateIndex;
    if (connections && !!validTour) {
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
              date.format("DD.MM.YYYY")
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

  const onDownloadGpx = () => {
    if (!!validTour) {
      if (
        !!activeReturnConnection &&
        activeReturnConnection.fromtour_track_key &&
        !!activeConnection &&
        !!activeConnection?.connections[0]?.totour_track_key
      ) {
        loadTourGpx({
          id: tour.id,
          key_anreise: activeConnection.connections[0].totour_track_key,
          key_abreise: activeReturnConnection.fromtour_track_key,
          type: "all",
        }).then(
          (res) => {
            if (!!res && !!res.data) {
              fileDownload(
                res.data,
                parseFileName(tour.title, "zuugle_", ".gpx")
              );
            }
          },
          (err) => {
            console.log("error: ", err);
          }
        );
      } else {
        loadTourGpx({ id: tour.id }).then(
          (res) => {
            if (!!res && !!res.data) {
              fileDownload(
                res.data,
                parseFileName(tour.title, "zuugle_", ".gpx")
              );
            }
          },
          (err) => {
            console.log("error: ", err);
          }
        );
      }
    }
  };

  const downloadButtonsDisabled = () => {
    return (
      !!!tour ||
      !!!tour.gpx_file ||
      !!!activeConnection ||
      !!!activeConnection?.connections[0]?.totour_track_key ||
      !!!activeReturnConnection ||
      !!!activeReturnConnection.fromtour_track_key
    );
  };

  const updateConnIndex = (index) => {
    setDateIndex(index);
    setActiveConnection(connections[index]);
    setActiveReturnConnection(connections[index].returns[0]);
  };

  const setGpxTrack = (url, loadGPX, _function) => {
    if (!!validTour) {
      loadGPX(url).then((res) => {
        if (!!res && !!res.data) {
          let gpx = new GpxParser(); //Create gpxParser Object
          gpx.parse(res.data);
          if (gpx.tracks.length > 0) {
            const positions = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
            _function(positions);
          }
        }
      });
    }
  };

  const shareButtonHandler = (event) => {
    const clickedElement = event.target;
    const svgButton = clickedElement.closest(".share-button"); // Find the closest parent with class "share-button"

    if (svgButton) {
      console.log(
        "inside svgBtn, socialMediaDropDownToggle ",
        socialMediaDropDownToggle
      );
      setSocialMediaDropDownToggle((current) => !current);
    }
  };

  const actionButtonPart = (
    <Box className="tour-detail-action-btns-container">
      <>
        {providerPermit && (
          <Button
            className="tour-detail-action-btns"
            disabled={downloadButtonsDisabled()}
            onClick={() => {
              onDownloadGpx();
            }}
          >
            <DownloadIcon />
            <span style={{ color: "#101010", width: "43px" }}>GPX</span>
            {!!isGpxLoading ? (
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
            {/*Facebook has deprecated the quote feature, thus when sharing, only the link will be there - however the user can still write something on the post (but it needs to be done manually)*/}
            <FacebookShareButton
              windowWidth={800}
              windowHeight={800}
              className="tour-detail-action-btns"
              style={{ borderRadius: "12px", backgroundColor: "#3b5998" }}
              url={shareUrl()}
              quote={t("details.teilen_text")}
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
              <ContentPasteIcon color="white"></ContentPasteIcon>
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
  let URL = shareUrl();

  if (!!tour) {
    page_title = "Zuugle: " + tour.title + " (" + tour.provider_name + ")";
    imageUrl = tour?.image_url && tour?.image_url.length > 0 && tour?.image_url;
    description = tour?.description && tour?.description.length > 0 && tour?.description;
  }

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      {isTourLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Helmet>
            <title>{page_title}</title>
            <meta http-equiv="content-language" content={`${currLanguage}`} />
            <meta property="og:url" content={`${URL}`} />
            <meta property="og:title" content={`${page_title}`} />
            <meta property="og:description" content="" />
            <meta property="og:image" content={`${imageUrl}`} />
            <meta property="twitter:url" content={`${URL}`} />
            <meta property="twitter:title" content={`${page_title}`} />
            <meta property="twitter:description" content={`${description}`} />
            <meta property="twitter:image" content={`${imageUrl}`} />
            <link
              rel="alternate"
              href={`https://${window.location.hostname}/tour/${idOne}/no-city`}
            />
            {!!tour &&
              validTour &&
              !!tour.canonical &&
              tour.canonical.length > 0 &&
              tour.canonical.map((entry) => {
                if (entry.canonical_yn === "y") {
                  return (
                    <link
                      rel="canonical"
                      href={`https://${entry.zuugle_url}`}
                      hreflang={`${entry.href_lang}`}
                    />
                  );
                } else {
                  return (
                    <link
                      rel="alternate"
                      href={`https://${entry.zuugle_url}`}
                      hreflang={`${entry.href_lang}`}
                    />
                  );
                }
              })}
          </Helmet>
          <Box className="newHeader" sx={{ position: "relative" }}>
            <Box component={"div"} className="rowing blueDiv">
              {/* close tab /modal in case no return history available  ###### section */}
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
              {/* arrow close tab  ###### section */}
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
              {!searchParams.get("city") && !cityOne && (
                <Box
                  sx={{
                    position: "fixed",
                    right: 0,
                    bottom: 0,
                    top: 0,
                    left: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: "1300",
                  }}
                />
              )}
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
                  xs: !searchParams.get("city") && !cityOne ? "360px" : "325px",
                  md: !searchParams.get("city") && !cityOne ? "376px" : "600px",
                },
                boxSizing: "border-box",
                boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
                zIndex: "1300",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <SearchContainer
                  pageKey="detail"
                  goto={"/search"}
                  idOne={idOne ? idOne : null}
                  cityOne={cityOne ? cityOne : null}
                />
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
              {!!validTour && (
                <Box
                  sx={{ width: "100%", position: "relative" }}
                  className="tour-detail-map-container"
                >
                  <InteractiveMap
                    gpxPositions={!!gpxPositions && gpxPositions}
                    anreiseGpxPositions={
                      !!anreiseGpxPositions && anreiseGpxPositions
                    }
                    abreiseGpxPositions={
                      !!abreiseGpxPositions && abreiseGpxPositions
                    }
                    scrollWheelZoom={false}
                    tourTitle={!!tour?.title && tour.title}
                  />
                </Box>
              )}
              <div className="tour-detail-data-container">
                <Box>
                  <TourDetailProperties tour={tour}></TourDetailProperties>
                  <Box sx={{ textAlign: "left" }}>
                    <div className="tour-detail-difficulties">
                      <span className="tour-detail-difficulty">
                        {tour && translateDiff(tourDifficulty)}
                      </span>
                    </div>
                    <Typography variant="textSmall">
                      {tour?.description}
                    </Typography>
                  </Box>
                  <div
                    className="tour-detail-provider-container"
                    onClick={() => {
                      let url = tour?.url;
                  
                      // Bedingung für die spezielle URL-Konstruktion
                      if (tour?.provider === 'bahnzumberg' && _city) {
                          url += 'ab-' + _city + '/';
                      }
                  
                      window.open(url);
                    }}
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
                  </div>
                  {renderImage && validTour && (
                    <Box className="tour-detail-conditional-desktop">
                      <Divider variant="middle" />
                      <div className="tour-detail-img-container">
                        <img
                          src={
                            tour?.image_url &&
                            tour?.image_url.length > 0 &&
                            tour?.image_url
                          }
                          onError={() => {
                            setRenderImage(false);
                          }}
                          alt={tour?.title}
                        />
                      </div>
                    </Box>
                  )}
                  {!!_city && _city !== "no-city" && !!idOne && (
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
                    validTour={validTour}
                    city={cityI}
                    idOne={idOne}
                  />
                </Box>
                {renderImage && !!validTour && (
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
                {!!validTour && !!_city && _city !== "no-city" && !!idOne && (
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
};

const mapDispatchToProps = {
  loadTour,
  loadTours,
  loadTourConnectionsExtended,
  loadGPX,
  loadTourGpx,
  loadCities,
  loadAllCities,
};

function mapStateToProps(state) {
  return {
    isGpxLoading: state.tours.isGpxLoading,
    cities: state.cities.cities,
    allCities: state.cities.all_cities,
    tour: state.tours.tour,
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  DetailReworked
);
