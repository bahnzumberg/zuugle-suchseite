import * as React from "react";
import axios from "../../axios";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import InteractiveMap from "../../components/InteractiveMap";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSearchParams,useParams } from "react-router-dom";
import {
  loadTour,
  loadTourConnectionsExtended,
  loadTourGpx,
  loadTours,
} from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadGPX } from "../../actions/fileActions";
import GpxParser from "gpxparser";
import { Divider } from "@mui/material";
import TourDetailProperties from "../../components/TourDetailProperties";
import moment from "moment/moment";
import fileDownload from "js-file-download";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DownloadIcon from "../../icons/DownloadIcon";
import { loadAllCities, loadCities } from "../../actions/cityActions";
import { useTranslation } from "react-i18next";
import Itinerary from "../../components/Itinerary/Itinerary";
import { useNavigate } from "react-router";
import DomainMenu from "../../components/DomainMenu";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import ArrowBefore from "../../icons/ArrowBefore";
import ShareIcon from "../../icons/ShareIcon";
import Close from "../../icons/Close";
import { shortenText, parseFileName } from "../../utils/globals";
import transformToDescriptionDetail from "../../utils/transformJson";
import '/src/config.js';


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
  const {cityOne, idOne} = useParams();
  const [validTour, setValidTour] = useState(false);
  
  let cityfromparam = searchParams.get("city");
  
  let _city = '';
  if (!!cityOne){
    _city = cityOne;
  }
  else {
    if (!!cityfromparam){
      _city = cityfromparam;
    }
  }
  const [cityI, setCityI] = useState(_city);
 
  const shareUrl = ()=>{
    let _shareUrl = '';
    if(!!_city && _city !== "no-city" && !!idOne){
      _shareUrl = `https://${window.location.host}/tour/${idOne}/${_city} `
    }
    return _shareUrl
  }

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
    window.close()
  };

  const navigate = useNavigate();

  useEffect(() => {
    setCityI(_city)
  }, [_city]);

  const goToStartPage = () => {
    let city = searchParams.get("city");
    navigate(`/?${!!city ? "city=" + city : ""}`);
  };

  const goToStartPageUnavailableTour = () => {
    navigate(`/?${searchParams.toString()}`);
    window.location.reload();
  };

  const LoadingSpinner = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size={50} />
    </div>
  );

  //max number of characters used per specific UI element (buttons)
  const maxLength = 40;

  const [providerPermit, setProviderPermit] = useState(true);

  useEffect(()=>{
    if(!!tour ){
      if(tour.valid_tour === 1) {
        setValidTour(true);
        }else{
        setValidTour(false);
      }
    }

  }, [tour]);

  
useEffect(() => {
  if (!!tour && tour?.provider) {
    setIsTourLoading(true);

    // API call to check the provider's permit
    // axios.get(`tours/provider/mapzssi`)  // test a case with value = 'n'
    axios.get(`tours/provider/${tour.provider}`)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        // Check the `allow_gpx_download` value from the API response
        if (data.allow_gpx_download === 'n') {
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
 
}, [tour,providerPermit]);


  React.useEffect(() => {
    var _mtm = window._mtm = window._mtm || [];
    if (!!tour) {
      _mtm.push({'provider': tour.provider_name});
      _mtm.push({'range': tour.range});
      _mtm.push({'pagetitel': tour.title});
    }
  }, [tour]);


  useEffect(() => {
    setSocialMediaDropDownToggle(false);
  }, [dateIndex]);

  useEffect(() => {
   
    loadAllCities();
    loadCities({ limit: 5 });
    let tourId
    if(idOne){
      tourId=idOne
    }else{
    tourId = !!searchParams.get("id") ? searchParams.get("id") : !!localStorage.getItem("tourId") ? localStorage.getItem("tourId") : null; // currently we only use localStorage for tourId
  }
    if (!!tourId) {
      setIsTourLoading(true);
      
      loadTour(tourId, _city)
        .then((tourExtracted) => {
          if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
            setIsTourLoading(false);
            setTourDifficulty(
              !!tourExtracted.data.tour.difficulty &&
              tourExtracted.data.tour.difficulty
              );
          }else{
            setIsTourLoading(false);
            console.log("No tour data retrieved")
          }
        })
        .catch((error) => {
          setIsTourLoading(false);
          console.error("Tour not found:", error);
          if (error.response && error.response.status === 404) {
            console.error("Tour not found:", error);
            goToStartPageUnavailableTour();
          } else {
            console.error("Other error:", error);
          }
        });
    }

    if (tourId && _city && !connections && validTour) {
      setIsTourLoading(true);
   
      loadTourConnectionsExtended({ id: tourId, city: _city }).then((res) => {
        
        if (res && res.data) {
          !!res.data.result && setConnections(res.data.result);
          if (res?.data?.result?.[0]?.connections?.[0]?.connection_description_json) {
            let connectJson = res.data.result[0].connections[0].connection_description_json;
            Array.isArray(connectJson) && transformToDescriptionDetail(connectJson);  
          }
        }
      }).catch(err=>{
        console.error("error",err)
      })
      .finally(() => {
        setIsTourLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ cityOne, idOne, validTour]);


  useEffect(() => {
    if (tour && tour.valid_tour === 1) {
        setGpxTrack(tour.gpx_file, loadGPX, setGpxPositions);
        setGpxTrack(tour.totour_gpx_file, loadGPX, setAnreiseGpxPositions);
        setGpxTrack(tour.fromtour_gpx_file, loadGPX, setAbreiseGpxPositions);
        setRenderImage(!!tour?.image_url);
      // }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour]);

  useEffect(() => {
    let index = dateIndex;
    if (connections && !!validTour) {
      let date = moment(searchParams.get("datum")); 
      if (date.isValid()) {
        if (
          moment(date).isBetween(
            moment(connections[0].date),
            moment(connections[6].date),
            "days",
            "[]"
          )
        ) {
          index = connections.findIndex(
            (connection) =>
              moment(connection.date).format("DD.MM.YYYY") ===
              date.format("DD.MM.YYYY")
          );
          setDateIndex(index);
        } else {
          goToStartPage();
        }
      }
      setActiveConnection(connections[index]);
      setActiveReturnConnection(connections[index].returns[0]);
    }
  }, [!!connections]);

 
  const onDownloadGpx = () => {
    if(!!validTour){
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
      // !!!validTour ||
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
    if(!!validTour){
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
      console.log("inside svgBtn, socialMediaDropDownToggle ", socialMediaDropDownToggle)
  		setSocialMediaDropDownToggle(current => !current);
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
              <span style={{ color: "#8B8B8B" }}>
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
          <span style={{ color: "#8B8B8B", marginLeft: "15px" }}>
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

    return (

      <Box sx={{ backgroundColor: "#fff" }}>
           {isTourLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box className="newHeader" sx={{ position: "relative" }}>
            <Box component={"div"} className="rowing blueDiv">
              {/* close tab /modal in case no return history available  ###### section */}
              <Box sx={{ display: "flex", alignItems: "center" }} >
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
              {(!searchParams.get("city") && !cityOne) && (
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
                  xs: (!searchParams.get("city") && !cityOne) ? "360px" : "325px",
                  md: (!searchParams.get("city") && !cityOne) ? "376px" : "600px",
                },
                boxSizing: "border-box",
                boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
                zIndex: "1300",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <SearchContainer pageKey="detail" goto={"/search"} idOne={idOne? idOne : null} cityOne={cityOne? cityOne : null} />
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
              {
                !!validTour && (
                <Box
                  sx={{ width: "100%", position: "relative" }}
                  className="tour-detail-map-container"
                >
                      <InteractiveMap
                        gpxPositions={!!gpxPositions && gpxPositions}
                        anreiseGpxPositions={!!anreiseGpxPositions && anreiseGpxPositions}
                        abreiseGpxPositions={!!abreiseGpxPositions && abreiseGpxPositions}
                        scrollWheelZoom={false}
                        tourTitle={!!tour?.title && tour.title}
                      />
                </Box>
                )
              }
              <div className="tour-detail-data-container">
                <Box>
                  <TourDetailProperties tour={tour}></TourDetailProperties>
                  <Box sx={{ textAlign: "left" }}>
                    <div className="tour-detail-difficulties">
                      <span className="tour-detail-difficulty">
                        {tour && translateDiff(tourDifficulty)}
                      </span>
                    </div>
                    <Typography variant="textSmall">{tour?.description}</Typography>
                  </Box>
                  <div
                    className="tour-detail-provider-container"
                    onClick={() => {
                      window.open(tour?.url);
                    }}
                  >
                    <div className="tour-detail-provider-icon">
                       {!!tour && <img
                        src={`/app_static/icons/provider/logo_${tour.provider}.svg`}
                        alt={tour.provider_name}
                        style={{ borderRadius: "100%", height: "48px", width: "48px" }}
                      /> }
                    </div>
                    <div className="tour-detail-provider-name-link">
                      <span className="tour-detail-provider-name">
                        {tour?.provider_name}
                      </span>
                      <span className="tour-detail-provider-link">{tour?.url}</span>
                    </div>
                  </div>
                  {renderImage && validTour &&(
                    <Box className="tour-detail-conditional-desktop">
                      <Divider variant="middle" />
                      <div className="tour-detail-img-container">
                        <img
                          src={(tour?.image_url && tour?.image_url.length > 0) && tour?.image_url}
                          onError={() => {
                            setRenderImage(false);
                          }}
                          alt={tour?.title}
                        />

                      </div>
                    </Box>
                  )}
                  {
                    (
                      <Box className="tour-detail-conditional-desktop">
                        {actionButtonPart}
                      </Box>
                    )
                  }
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
                {
                  !!validTour && (
                    <Box className="tour-detail-conditional-mobile">
                    {actionButtonPart}
                  </Box>
                  )
                }
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
