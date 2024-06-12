import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import {
  loadTour,
  loadTourConnectionsExtended,
  loadTourGpx,
  loadTourPdf,
  loadTours,
  loadAllCities,
  loadCities,
} from "../../actions/tourActions";
import { loadGPX } from "../../actions/fileActions";
import GpxParser from "gpxparser";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import moment from "moment/moment";
import { Buffer } from "buffer";
import fileDownload from "js-file-download";
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
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PdfIcon from "../../icons/PdfIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import transformToDescriptionDetail from "../../utils/transformJson";
import Itinerary from "../../components/Itinerary/Itinerary";
import TourDetailProperties from "../../components/TourDetailProperties";

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
  const [isShareGenerating, setIsShareGenerating] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [socialMediaDropDownToggle, setSocialMediaDropDownToggle] = useState(false);
  const [showDifferentStationUsedWarning, setShowDifferentStationUsedWarning] = useState(false);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const [providerPermit, setProviderPermit] = useState(true);

  const { t } = useTranslation();

  const translateDiff = (diff) => {
    if (diff === "Leicht" || diff === "leicht") {
      return t("start.leicht");
    } else if (diff === "Schwer" || diff === "schwer") {
      return t("start.schwer");
    } else return t("start.mittel");
  };

  let pdfLanguagePermit = i18next.resolvedLanguage === "de";

  const handleCloseTab = () => {
    window.close();
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={50} />
    </div>
  );

  const setGpxTrack = (url, loadGPX, _function) => {
    loadGPX(url).then((res) => {
      if (!!res && !!res.data) {
        let gpx = new GpxParser();
        gpx.parse(res.data);
        if (gpx.tracks.length > 0) {
          const positions = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
          _function(positions);
        }
      }
    });
  };

  useEffect(() => {
    if (!!tour && tour.provider) {
      setIsTourLoading(true);

      axios.get(`tours/provider/${tour.provider}`)
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          if (data.allow_gpx_download === 'n') {
            setProviderPermit(false);
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

  useEffect(() => {
    var _mtm = window._mtm = window._mtm || [];
    if (!!tour) {
      _mtm.push({'provider': tour.provider_name});
      _mtm.push({'range': tour.range});
      _mtm.push({'pagetitel': tour.title});
    }
  }, [tour]);

  useEffect(() => {
    if (isShareGenerating) {
      generateShareLink(tour.provider, tour.hashed_url, moment(activeConnection?.date).format('YYYY-MM-DD'), searchParams.get("city"))
        .then(res => {
          if (res.success) {
            setShareLink(window.location.origin + "/tour?share=" + res.shareId);
          } else {
            console.log("Share link didn't generate as expected.");
          }
        });
      setIsShareGenerating(false);
    }
  }, [isShareGenerating, shareLink]);

  useEffect(() => {
    setIsShareGenerating(false);
    setSocialMediaDropDownToggle(false);
  }, [dateIndex]);

  useEffect(() => {
    const shareId = searchParams.get("share") ?? null;
    const city = searchParams.get("city") || localStorage.getItem("city");

    if (shareId) {
      setIsTourLoading(true);

      loadShareParams(shareId, city)
        .then((res) => {
          setIsTourLoading(false);
          if (res.success) {
            if (!res.usedCityOfCookie) {
              setShowDifferentStationUsedWarning(true);
            }
            const redirectSearchParams = new URLSearchParams();
            const date = moment(res.date);
            redirectSearchParams.set("city", res.city);
            redirectSearchParams.set("datum", moment(date).format("YYYY-MM-DD"));
            localStorage.setItem("tourId", res.tourId);
            navigate(`/tour?${redirectSearchParams.toString()}`);
          } else {
            setIsTourLoading(false);
            goToStartPage();
          }
        })
        .catch((err) => {
          setIsTourLoading(false);
          console.error("error: " + err);
          goToStartPage();
        });
    }

    loadAllCities();
    loadCities({ limit: 5 });
    const tourId = searchParams.get("id") || localStorage.getItem("tourId");

    if (tourId) {
      setIsTourLoading(true);
      loadTour(tourId, city)
        .then((tourExtracted) => {
          if (tourExtracted && tourExtracted.data && tourExtracted.data.tour) {
            setIsTourLoading(false);
            setTourDifficulty(tourExtracted.data.tour.difficulty);
          } else {
            setIsTourLoading(false);
            console.log("No tour data retrieved");
          }
        })
        .catch((error) => {
          setIsTourLoading(false);
          console.error("Tour not found:", error);
          if (error.response && error.response.status === 404) {
            goToStartPageUnavailableTour();
          } else {
            console.error("Error:", error);
          }
        });
    }
    if (tourId && city && !connections) {
      setIsTourLoading(true);
      loadTourConnectionsExtended({ id: tourId, city: city }).then((res) => {
        if (res && res.data) {
          setConnections(res.data);
          setIsTourLoading(false);
        }
      });
    }
  }, [searchParams, loadTour, loadTourConnectionsExtended, loadCities, loadAllCities]);

  useEffect(() => {
    const tourId = searchParams.get("id");
    if (tourId) {
      loadTourGpx(tourId);
    }
  }, [loadTourGpx, searchParams]);

  return (
    <div>
      {isTourLoading ? <LoadingSpinner /> :
        <div>
          {tour ? (
            <>
              <Typography variant="h4">{tour.title}</Typography>
              {/* Add your tour details components here */}
            </>
          ) : (
            <Typography variant="h6">Tour not found</Typography>
          )}
        </div>
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  tour: state.tours.tour,
  isGpxLoading: state.files.isGpxLoading,
  isPdfLoading: state.files.isPdfLoading,
  allCities: state.cities.allCities,
});

const mapDispatchToProps = {
  loadTour,
  loadTours,
  loadTourConnectionsExtended,
  loadGPX,
  loadTourGpx,
  loadTourPdf,
  loadAllCities,
  loadCities,
  generateShareLink,
  loadShareParams,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailReworked);
