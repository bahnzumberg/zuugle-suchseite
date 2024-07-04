import * as React from "react";
import axios from "../../axios";
import { lazy, useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import SearchContainer from "../Start/SearchContainer";
import InteractiveMap from "../../components/InteractiveMap";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router-dom";
import {
  loadTour,
  loadTourConnectionsExtended,
  loadTourGpx,
  loadTourPdf,
  loadTours,
} from "../../actions/tourActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { loadGPX } from "../../actions/fileActions";
import GpxParser from "gpxparser";
import { Divider } from "@mui/material";
import TourDetailProperties from "../../components/TourDetailProperties";
import moment from "moment/moment";
import { Buffer } from "buffer";
import fileDownload from "js-file-download";
import { consoleLog, parseFileName } from "../../utils/globals";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ProviderLogo from "../../icons/ProviderLogo";
import DownloadIcon from "../../icons/DownloadIcon";
import PdfIcon from "../../icons/PdfIcon";
import { loadAllCities, loadCities } from "../../actions/cityActions";
import { useTranslation } from "react-i18next";
import Itinerary from "../../components/Itinerary/Itinerary";
import { useNavigate } from "react-router";
import DomainMenu from "../../components/DomainMenu";
import { generateShareLink, loadShareParams } from "../../actions/crudActions";
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
import { shortenText } from "../../utils/globals";
import i18next from "i18next";
// import { set } from "lodash";
import transformToDescriptionDetail from "../../utils/transformJson";


const DetailReworked = (props) => {

  const {
    loadTour,
    loadTours,
    loadTourConnectionsExtended,
    loadGPX,
    loadTourGpx,
    isGpxLoading,
    loadTourPdf,
    isPdfLoading,
    allCities,
    tour,
    loadCities,
    loadAllCities,
    showMobileMenu,
    setShowMobileMenu,
  } = props;

  const setGpxTrack = (url, loadGPX, _function) => {
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
  };

  const [connections, setConnections] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);
  const [activeReturnConnection, setActiveReturnConnection] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [gpxPositions, setGpxPositions] = useState(null);
  const [anreiseGpxPositions, setAnreiseGpxPositions] = useState(null);
  const [abreiseGpxPositions, setAbreiseGpxPositions] = useState(null);
  const [tourDifficulty, setTourDifficulty] = useState(null);
  // const [tourDifficultyOrig, setTourDifficultyOrig] = useState(null);
  const [renderImage, setRenderImage] = useState(null);
  //Triggers the generating of a new link
  const [isShareGenerating, setIsShareGenerating] = useState(false);
  //Complete share link
  const [shareLink, setShareLink] = useState(null);
  //Whether social media share buttons should be shown
  const [socialMediaDropDownToggle, setSocialMediaDropDownToggle] =
    useState(false);
  //Whether a warning that says that your local trainstation has not been used, should be shown
  const [showDifferentStationUsedWarning, setShowDifferentStationUsedWarning] =
    useState(false);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const[showModal, setShowModal] =useState(false)


  // Translation-related
  const { t } = useTranslation();
  const translateDiff = (diff) => {
    if (diff === "Leicht" || diff === "leicht") {
      return t("start.leicht");
    } else if (diff === "Schwer" || diff === "schwer") {
      return t("start.schwer");
    } else return t("start.mittel");
  };
  
  // pdf buttons shows up only when menu language is German
  let pdfLanguagePermit = i18next.resolvedLanguage === "de";
  // Because of https://github.com/orgs/bahnzumberg/projects/2/views/6?pane=issue&itemId=67291173, PDF button will be deactivated for everyone
  // let pdfLanguagePermit = i18next.resolvedLanguage === "none";

  const handleCloseTab = () => {
    window.close()
    // let ableToClose = window.close();
    // !ableToClose && setShowModal(true)
  };

  const navigate = useNavigate();

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


useEffect(() => {
  const paramId = searchParams.get("id");
  const paramCity = searchParams.get("city");
  console.log("id :", paramId)
  console.log("city :", paramCity)
}, []);


return (
  <div>
    <h3>ID: {id}</h3>
    <h3>City: {city}</h3>
    <h3>paramId: {paramId}</h3>
    <h3>paramCity: {paramCity}</h3>
  </div>
);

}