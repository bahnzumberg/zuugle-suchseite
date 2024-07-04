import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CustomStarRating from "./CustomStarRating";
import {
  checkIfImageExists,
  convertNumToTime,
  formatNumber,
} from "../utils/globals";
import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
import TourConnectionCardNew from "./TourConnectionCardNew";
import TourConnectionReturnCardNew from "./TourConnectionReturnCardNew";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";
import { tourTypes } from "../utils/language_Utils";
import { useSearchParams } from "react-router-dom";
import { consoleLog } from "../utils/globals";
// import { BorderLeft, Padding } from "@mui/icons-material";
import { Chip } from "@mui/material";

const DEFAULT_IMAGE = "/app_static/img/train_placeholder.webp";

export default function TourCard({
  tour,
  onSelectTour,
  loadTourConnections,
  city,
  mapCard,
}) {
  console.log("object", tour);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const imageOpacity = 1;

  const [connectionLoading, setConnectionLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [returns, setReturns] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [imgSrc, setImgSrc] = useState("/logos/fallback.svg");
  console.log("imgSrc", imgSrc);
  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(`/logos/${tour?.provider}.svg`);
        if (response.ok) {
          setImgSrc(`/logos/${tour?.provider}.svg`);
        }
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };

    checkImage();
  }, []);

  let tourLink = `/tour?id=${tour.id}&city=${city}`;

  // i18next
  const { t } = useTranslation();

  const hm = t("details.hm_hoehenmeter");
  const km = t("details.km_kilometer");

  //description
  //search tour-related image in folders and set image state to it , otherwise set state to DEFAULT_IMAGE
  useEffect(() => {
    if (!!tour.image_url && tour.provider === "bahnzumberg") {
      checkIfImageExists(tour.image_url).then((exists) => {
        if (!!exists) {
          setImage(tour.image_url);
        } else if (!!tour.gpx_image_file_small) {
          checkIfImageExists(tour.gpx_image_file_small).then((gpxExists) => {
            if (!!gpxExists) {
              setImage(tour.gpx_image_file_small);
            } else {
              setImage(DEFAULT_IMAGE);
            }
          });
        }
      });
    } else if (!!tour.gpx_image_file_small) {
      checkIfImageExists(tour.gpx_image_file_small).then((gpxExists) => {
        if (!!gpxExists) {
          setImage(tour.gpx_image_file_small);
        } else {
          setImage(DEFAULT_IMAGE);
        }
      });
    } else {
      setImage(DEFAULT_IMAGE);
    }
  }, [tour]);

  useEffect(() => {
    if (
      !!loadTourConnections &&
      !!city &&
      tour.cities &&
      tour.cities.length > 0
    ) {
      setConnectionLoading(true);
      loadTourConnections({ id: tour.id, city: city }).then((res) => {
        setConnectionLoading(false);
        setConnections(res?.data?.connections);
        setReturns(res?.data?.returns);
      });
    } else if (!!!city) {
      setConnections([]);
      setReturns([]);
    }
  }, [tour]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const renderProps = () => {
    const translateDiff = (diff) => {
      if (diff === "Leicht") {
        return t("start.leicht");
      } else if (diff === "Mittel") {
        return t("start.mittel");
      } else if (diff === "Schwer") {
        return t("start.schwer");
      } else return t("start.notset");
    };

    const translateTourType = (type) => {
      let translatedType = null;
      tourTypes.forEach((typ) => {
        type = type.toLowerCase();
        if (typ === type) {
          //correct the small cap so both can be equal
          // console.log("filter.${type} : ", `filter.${type}`)
          translatedType = t(`filter.${type}`);
        }
      });
      return translatedType;
    };

    const values = [];

    // if (!!tour) {
    //   values.push({
    //     // icon: <Clock style={{ fill: "transparent" }} />,
    //     text:
    //       `${t("main.tour")}: ` +
    //       (!!tour.number_of_days && tour.number_of_days > 1
    //         ? convertNumToTime(tour.total_tour_duration)
    //         : convertNumToTime(tour.total_tour_duration)),
    //   });
    //   //   values.push({
    //   //     icon: <Intensity style={{ fill: "transparent" }} />,
    //   //     text: translateDiff(tour.difficulty),
    //   //     // text: tour.difficulty,
    //   //   });
    //   //   values.push({
    //   //     icon: <Walk style={{ fill: "transparent" }} />,
    //   //     text: translateTourType(tour.type),
    //   //     // text: tour.type,
    //   //   });
    //   values.push({
    //     // icon: <ArrowVertical style={{ fill: "transparent" }} />,
    //     text: tour.ascent + " / " + tour.descent + " " + hm,
    //   });
    //   values.push({
    //     // icon: <ArrowHorizontal style={{ fill: "transparent" }} />,
    //     text: formatNumber(tour.distance * 1000, " " + hm),
    //   });
    // }

    return (
      <Box display="inline" style={{ whiteSpace: "break-spaces" }}>
        {values.map((entry, index) => {
          return (
            <Box
              key={index}
              display="inline-block"
              sx={{ marginRight: "10px" }}
            >
              {entry.icon}
              <Typography
                display={"inline"}
                variant={"subtitle2"}
                sx={{
                  lineHeight: "24px",
                  position: "relative",
                  top: "-7px",
                  left: "4px",
                }}
              >
                {entry.text}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  const getAnreise = () => {
    if (!!connections && connections.length > 0) {
      let connection = connections[0];
      return <TourConnectionCardNew connection={connection} />;
    } else {
      return <Fragment></Fragment>;
    }
  };

  const getAbreise = () => {
    if (!!returns && returns.length > 0) {
      return (
        <Box sx={{ marginTop: "10px" }}>
          <TourConnectionReturnCardNew returns={returns} />
        </Box>
      );
    } else {
      return <Fragment></Fragment>;
    }
  };

  return (
    <Card
      className="tour-card"
      style={{ position: "relative" }}
      onClick={() => {
        onSelectTour(tour);
      }}
    >
      <a
        href={tourLink}
        target="_blank"
        rel="noreferrer"
        className="cursor-link"
        style={{ position: "relative" }}
      >
        <CardMedia
          component="img"
          height="140"
          image={image}
          style={{ opacity: imageOpacity, zIndex: "40" }}
        />
        <Chip
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: "50",
            background: "#000",
            color: "#C5C5C5",
            fontSize: "12px",
          }}
          label={`${tour?.range}`}
        >
          {" "}
        </Chip>
      </a>
      <CardContent>
        
        <div
          className="mt-1"
          style={{
            display: "flex",
            gap: "10px",
            paddingBottom: "5px",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <img
            src={
              `/app_static/logos/${tour.provider}.svg` ||
              `/app_static/logos/fallback.svg`
            }
            style={{ borderRadius: "100%", height: "18px", width: "18px" }}
          />
          <Typography variant="grayP">{tour.provider_name}</Typography>
        </div>
        <div className="mt-1" style={{ marginBottom: "80px", width: "100%" }}>
          <Typography variant="h4" style={{ whiteSpace: "break-spaces" }}>
            <a
              href={tourLink}
              target="_blank"
              rel="noreferrer"
              className="updated-title curser-link"
            >
              {tour.title}
            </a>
          </Typography>
        </div>
        <div className="mt-3" style={{ whiteSpace: "break-space" }}>
          {renderProps()}
        </div>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            width: "100%",
            gap: "8px",
            position: "absolute",
            bottom: "20px",
          }}
        >
          <Typography
            variant="blueP"
            style={{ borderRight: "1px solid #DDDDDD" }}
          >
            {t("start.card1")} <br />
            <span style={{ fontSize: "18px" }}>
              {tour.best_connection_duration} h
            </span>
          </Typography>
          <Typography
            variant="blueP"
            style={{ borderRight: "1px solid #DDDDDD", display: "block" }}
          >
            {t("start.card2")} <br />
            <span style={{ fontSize: "18px" }}>{connection_no_of_transfers}</span>
          </Typography>

          <Typography
            variant="blackP"
            style={{ borderRight: "1px solid #DDDDDD" }}
          >
            {t("start.card3")} <br />
            <span style={{ fontSize: "18px" }}>{tour.duration} h</span>
          </Typography>

          <Typography variant="blackP" styles={{}}>
            {t("start.card4")} <br />
            <span style={{ fontSize: "18px" }}>{tour.ascent} hm</span>
          </Typography>
        </Box>
      </CardContent>

      {/* {!!connections && connections.length > 0 && !!tour.id ? ( */}
      {/* {!!connections && connections.length > 0 && !mapCard &&(
                <Fragment>
                    <div className="bottom-container">
                    <CardContent>
                        {!!connectionLoading ? (
                        <Box sx={{ padding: "20px" }}>
                            <LinearProgress />
                        </Box>
                        ) : (
                        <Fragment>
                            {getAnreise()}
                            {getAbreise()}
                        </Fragment>
                        )}
                    </CardContent>
                    </div>
                </Fragment>
            )
        } */}
    </Card>
  );
}
