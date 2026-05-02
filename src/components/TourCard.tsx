import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { convertNumToTime, getTourLink } from "../utils/globals";
import { tourTypes } from "../utils/language_Utils";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { Tour } from "../models/Tour";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";

const DEFAULT_IMAGE = "https://cdn.zuugle.at/img/dummy.webp";

export interface TourCardProps {
  tour: Tour;
  city: string | null;
  provider: string | null;
}

export default function TourCard({ tour, city, provider }: TourCardProps) {
  const [image, setImage] = useState(DEFAULT_IMAGE);

  // i18next
  const { t } = useTranslation();
  const hm = t("details.hm_hoehenmeter");

  useEffect(() => {
    if (JSON.stringify(tour.image_url) === "null") {
      setImage("https://cdn.zuugle.at/img/dummy.webp");
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
      style={{
        textDecoration: "none",
      }}
      target={city && city !== "no-city" ? "_blank" : ""} // Set target to _blank only when city is set
      rel={city && city !== "no-city" ? "noopener noreferrer" : undefined}
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
              bgcolor: "rgba(37, 73, 128, 0.85)",
              color: "#FFFFFF",
            }}
            label={`${tour?.range}`}
          />
        </Box>
        <CardContent
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            "&:last-child": {
              paddingBottom: { xs: "16px", sm: "24px" },
            },
          }}
        >
          {tour?.quality_rating >= 9 && tour?.traverse === 1 && (
            <Typography
              sx={{
                position: "absolute",
                top: 10,
                right: 25,
                fontFamily: '"Juniper Bay"',
                fontSize: "28px",
                color: "#712579",
                lineHeight: 1,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {t("main.top_tour")}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              paddingBottom: "5px",
              alignItems: "center",
            }}
          >
            <img
              src={`/app_static/icons/provider/logo_${tour.provider}.svg`}
              alt=""
              style={{
                borderRadius: "100%",
                height: "18px",
                width: "18px",
              }}
            />
            <Typography variant="grayP">{tour.provider_name}</Typography>
            {tour?.type &&
              (() => {
                const typeKey = tour.type
                  .toLowerCase()
                  .replace(/\s*&\s*/g, "_");
                const matched = tourTypes.find((tt) => tt === typeKey);
                const label = matched ? t(`filter.${matched}`) : tour.type;
                return (
                  <Typography
                    sx={{
                      marginLeft: "auto",
                      fontFamily: '"Juniper Bay", cursive',
                      fontSize: "18px",
                      color: "var(--primary)",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </Typography>
                );
              })()}
          </Box>
          <Typography
            variant="inherit"
            sx={{
              my: 2,
              fontWeight: "bold",
              lineHeight: { xs: "20px", sm: "24px" },
              marginY: { xs: "7px", sm: "15px" },
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
                  : convertNumToTime(
                      Number(tour.avg_total_tour_duration),
                      true,
                    )}
              </span>
            </Typography>

            <Typography variant="blackP">
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
