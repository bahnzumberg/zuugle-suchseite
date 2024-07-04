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
