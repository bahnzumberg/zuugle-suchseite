import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { convertNumToTime, getTourLink } from "../../utils/globals";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Tour } from "../../models/Tour";

export default function PopupCard({
  tour,
  city,
}: {
  tour: Tour;
  city: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (searchParams.get("filter")) searchParams.delete("filter");
  if (searchParams.get("map")) searchParams.delete("map");
  const provider = searchParams.get("p");

  const tourLink = getTourLink(tour, city, provider);

  // i18next
  const { t } = useTranslation();
  const hm = t("details.hm_hoehenmeter");
  // const km = t("details.km_kilometer");

  return (
    <Card className="tour-card" style={{ position: "relative" }}>
      <CardContent>
        <div
          className="mt-1"
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
            style={{ borderRadius: "100%", height: "13px", width: "13px" }}
          />
          <Typography variant="grayP">{tour.provider_name}</Typography>
        </div>
        <div className="mt-1" style={{ marginBottom: "40px", width: "100%" }}>
          <Typography style={{ whiteSpace: "break-space", fontSize: "10px" }}>
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
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            width: "100%",
            gap: "4px",
            position: "absolute",
            bottom: "15px",
          }}
        >
          <Typography
            variant="blueP"
            style={{ borderRight: "1px solid #DDDDDD", fontSize: "13px" }}
          >
            {t("details.anreisedauer")} <br />
            {tour.min_connection_duration ? (
              <>
                <span style={{ fontSize: "13px" }}>
                  {convertNumToTime(tour.min_connection_duration / 60, true)}
                </span>
              </>
            ) : (
              <div className="mt-2">N/A</div>
            )}
          </Typography>
          <Typography
            variant="blueP"
            style={{
              borderRight: "1px solid #DDDDDD",
              display: "block",
              fontSize: "13px",
            }}
          >
            {t("start.umstiege")} <br />
            {
              <span style={{ fontSize: "13px" }}>
                {Number.isFinite(tour.min_connection_no_of_transfers)
                  ? tour.min_connection_no_of_transfers
                  : "N/A"}
              </span>
            }
          </Typography>

          <Typography
            variant="blackP"
            style={{ borderRight: "1px solid #DDDDDD", fontSize: "13px" }}
          >
            {t("main.dauer")} <br />
            <span style={{ fontSize: "13px" }}>
              {!tour?.number_of_days
                ? "N/A"
                : tour?.number_of_days > 1
                  ? tour?.number_of_days + " " + t("details.tage")
                  : convertNumToTime(tour.avg_total_tour_duration, true)}
            </span>
          </Typography>

          <Typography variant="blackP" styles={{ fontSize: "13px" }}>
            {t("filter.anstieg")} <br />
            <span style={{ fontSize: "13px" }}>
              {tour.ascent} {hm}
            </span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
