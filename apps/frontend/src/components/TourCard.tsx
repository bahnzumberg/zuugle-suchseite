import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { convertNumToTime, getTourLink } from "../utils/globals";
import { tourTypes } from "../utils/language_Utils";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { Tour } from "../models/Tour";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useSelector } from "react-redux";
import { RootState } from "..";
import FavoriteButton from "./Favorites/FavoriteButton";
import { assetUrl, sizedImageUrl } from "../utils/assetUrl";

const DEFAULT_IMAGE = assetUrl("/img/dummy.webp");

export interface TourCardProps {
  tour: Tour;
  city: string | null;
}

export default function TourCard({ tour, city }: TourCardProps) {
  const externalLinks = useSelector(
    (state: RootState) => state.search.externalLinks,
  );
  // Uniform tile size for every card; a no-op off PROD, see sizedImageUrl().
  const image = tour.image_url
    ? sizedImageUrl(tour.image_url, { width: 600, height: 400 })
    : DEFAULT_IMAGE;

  // i18next
  const { t } = useTranslation();
  const hm = t("details.hm_hoehenmeter");

  const tourLink = getTourLink(tour, city, externalLinks);

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

  const isTopTour = tour?.quality_rating >= 9 && tour?.traverse === 1;

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Link
        href={tourLink}
        style={{
          textDecoration: "none",
          width: "100%",
        }}
        target="_blank"
        // Keep our own detail tab as opener so it can detect this search tab is
        // still open; external (cross-origin) links stay noopener for safety.
        rel={externalLinks ? "noopener" : "opener"}
      >
        <Card
          className="tour-card"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component={"img"}
              image={image}
              width="600"
              height="400"
              alt={`${tour?.title}`}
              sx={{ objectFit: "cover", width: "100%", maxHeight: "200px" }}
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
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                paddingBottom: "5px",
                alignItems: "center",
              }}
            >
              <img
                src={`/icons/provider/logo_${tour.provider}.svg`}
                alt=""
                style={{
                  borderRadius: "100%",
                  height: "18px",
                  width: "18px",
                }}
              />
              <Typography
                variant="grayP"
                style={{ fontSize: "13px", color: "#000" }}
              >
                {tour.provider_name}
              </Typography>
              {/* Right: sport type */}
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
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                        color: "#333",
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
                style={{
                  borderRight: "1px solid #DDDDDD",
                  display: "block",
                  fontSize: "13px",
                }}
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
                style={{
                  borderRight: "1px solid #DDDDDD",
                  display: "block",
                  fontSize: "13px",
                }}
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
                style={{ borderRight: "1px solid #DDDDDD", fontSize: "13px" }}
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

              <Typography variant="blackP" style={{ fontSize: "13px" }}>
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
      {/* Top-right overlay: decorative Top-Tour badge + interactive favorite.
          It sits outside the link so the button is not nested in an anchor;
          pointerEvents let clicks fall through to the card except on the heart. */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {isTopTour && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              bgcolor: "rgba(255, 255, 255, 0.85)",
              color: "var(--bzb-akelei)",
              borderRadius: "16px",
              px: "10px",
              py: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            <StarRoundedIcon sx={{ fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: '"Juniper Bay"',
                fontSize: "20px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {t("main.top_tour")}
            </Typography>
          </Box>
        )}
        <Box sx={{ pointerEvents: "auto" }}>
          <FavoriteButton tourId={tour.id} variant="icon" />
        </Box>
      </Box>
    </Box>
  );
}
