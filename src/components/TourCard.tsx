import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { convertNumToTime, getTourLink } from "../utils/globals";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { Chip, Link } from "@mui/material";
import "/src/config.js";

const DEFAULT_IMAGE = "/app_static/img/dummy.webp";

// TODO: move to more appropriate place --> models?
export interface Tour {
  url: string;
  id: string;
  image_url: string;
  title: string;
  range: string;
  min_connection_duration: number;
  min_connection_no_of_transfers: number;
  avg_total_tour_duration: number;
  ascent: number;
  number_of_days: number;
  provider: string;
  provider_name: string;
}

export interface TourCardProps {
  tour: Tour;
  onSelectTour: (tour: Tour) => void;
  city: string | null;
  provider: string | null;
}

export default function TourCard({
  tour,
  onSelectTour,
  city,
  provider,
}: TourCardProps) {
  const [image, setImage] = useState(DEFAULT_IMAGE);

  // i18next
  const { t } = useTranslation();
  const hm = t("details.hm_hoehenmeter");

  useEffect(() => {
    if (JSON.stringify(tour.image_url) === "null") {
      setImage("/app_static/img/dummy.webp");
    } else {
      setImage(tour.image_url);
    }
  }, [tour]);

  const tourLink = getTourLink(tour, city, provider);

  const anreisedauer_notlong = t("details.anreisedauer").length < 100;
  const umstiege_notlong = t("start.umstiege").length < 100;
  const dauer_notlong = t("main.dauer").length < 100;
  const anstieg_notlong = t("filter.anstieg").length < 100;
  let len_too_long = false;

  // if at least one is too long, flag the "len_too_long"
  if (
    !anreisedauer_notlong ||
    !umstiege_notlong ||
    !dauer_notlong ||
    !anstieg_notlong
  ) {
    len_too_long = true;
  }

  return (
    <Link
      href={tourLink}
      onClick={() => onSelectTour(tour)}
      style={{
        textDecoration: "none",
        width: "100%",
        justifyItems: "center",
      }}
      target={city && city !== "no-city" ? "_blank" : ""} // Set target to _blank only when city is set
    >
      <Card
        className="tour-card"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component={"img"}
            image={image}
            height="150"
            alt={`${tour?.title}`}
          />
          <Chip
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "#000",
              color: "#C5C5C5",
              fontSize: 12,
            }}
            label={`${tour?.range}`}
          />
        </Box>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              paddingBottom: "5px",
              alignItems: "center",
            }}
          >
            <img
              src={`/app_static/icons/provider/logo_${tour.provider}.svg`}
              alt={tour.provider_name}
              style={{
                borderRadius: "100%",
                height: "18px",
                width: "18px",
              }}
            />
            <Typography variant="grayP">{tour.provider_name}</Typography>
          </div>
          <Typography
            variant="inherit"
            sx={{
              my: 2,
              fontWeight: "bold",
              lineHeight: "24px",
            }}
          >
            {tour.title}
          </Typography>
          <Box
            sx={{
              mt: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            <Typography
              variant="blueP"
              style={{ borderRight: "1px solid #DDDDDD", display: "block" }}
            >
              {len_too_long && anreisedauer_notlong ? (
                <>
                  {t("details.anreisedauer")}
                  <br />
                </>
              ) : (
                t("details.anreisedauer")
              )}
              <br />
              <span style={{ fontSize: "18px" }}>
                {convertNumToTime(tour.min_connection_duration / 60, true)}
              </span>
            </Typography>
            <Typography
              variant="blueP"
              style={{ borderRight: "1px solid #DDDDDD", display: "block" }}
            >
              {len_too_long && umstiege_notlong ? (
                <>
                  {t("start.umstiege")}
                  <br />
                </>
              ) : (
                t("start.umstiege")
              )}
              <br />
              <span style={{ fontSize: "18px" }}>
                {tour.min_connection_no_of_transfers}
              </span>
            </Typography>

            <Typography
              variant="blackP"
              style={{ borderRight: "1px solid #DDDDDD" }}
            >
              {len_too_long && dauer_notlong ? (
                <>
                  {t("main.dauer")}
                  <br />
                </>
              ) : (
                t("main.dauer")
              )}
              <br />
              <span style={{ fontSize: "18px" }}>
                {tour?.number_of_days > 1
                  ? tour?.number_of_days + " " + t("details.tage")
                  : convertNumToTime(tour.avg_total_tour_duration, true)}
              </span>
            </Typography>

            <Typography variant="blackP" styles={{}}>
              {len_too_long && anstieg_notlong ? (
                <>
                  {t("filter.anstieg")}
                  <br />
                </>
              ) : (
                t("filter.anstieg")
              )}
              <br />
              <span style={{ fontSize: "18px" }}>
                {tour.ascent} {hm}
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
