import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { convertNumToTime, getTourLink } from "../../utils/globals";
import Box from "@mui/material/Box";
import { Tour } from "../../models/Tour";
import React from "react";
import { Popup } from "react-leaflet";
import L from "leaflet";
import { Marker } from "../../models/mapTypes";
import { t } from "i18next";

function PopupCard({
  tour,
  city,
  provider,
  activeMarker,
  setActiveMarker,
}: {
  tour: Tour | null;
  city: string;
  provider: string | null;
  activeMarker: Marker | null;
  setActiveMarker: (marker: Marker | null) => void;
}) {
  if (!activeMarker || !tour) return null;
  return (
    <Popup
      maxWidth={280}
      maxHeight={210}
      className="request-popup"
      offset={L.point([0, -25])}
      position={[activeMarker.lat, activeMarker.lon]}
      autoPan={false}
      eventHandlers={{
        remove: () => setActiveMarker(null),
      }}
    >
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
                href={getTourLink(tour, city, provider)}
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
                    : convertNumToTime(
                        Number(tour.avg_total_tour_duration),
                        true,
                      )}
              </span>
            </Typography>

            <Typography variant="blackP" style={{ fontSize: "13px" }}>
              {t("filter.anstieg")} <br />
              <span style={{ fontSize: "13px" }}>
                {tour.ascent} {t("details.hm_hoehenmeter")}
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Popup>
  );
}

export const MemoizedPopupCard = React.memo(
  PopupCard,
  (prev, next) =>
    prev.activeMarker?.id === next.activeMarker?.id &&
    prev.tour?.id === next.tour?.id &&
    prev.city === next.city,
);
