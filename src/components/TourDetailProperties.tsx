import { convertNumToTime, formatNumber } from "../utils/globals";
import { useTranslation } from "react-i18next";
import { tourTypes } from "../utils/language_Utils";
import { Tour } from "../models/Tour";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import RouteIcon from "@mui/icons-material/Route";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import TerrainIcon from "@mui/icons-material/Terrain";

export interface TourDetailPropertiesProps {
  tour?: Tour;
}

const difficultyColor = (diff: string) => {
  const d = diff.toLowerCase();
  if (d === "leicht") return "#2e7d32";
  if (d === "schwer") return "#e65100";
  return undefined;
};

const TourDetailProperties = ({ tour }: TourDetailPropertiesProps) => {
  const { t } = useTranslation();

  const translateTourType = (type: string) => {
    let translatedType = null;
    tourTypes.map((typ) => {
      type = type.toLowerCase();
      typ = typ.toLowerCase();
      if (type === "bike & hike") type = type.replace(/\s*&\s*/g, "_");
      if (typ === type) {
        translatedType = t(`filter.${typ}`);
      }
    });
    return translatedType;
  };

  const translateDiff = (diff: string) => {
    if (diff === "Leicht" || diff === "leicht") return t("start.leicht");
    if (diff === "Schwer" || diff === "schwer") return t("start.schwer");
    return t("start.mittel");
  };

  const km = t("details.km_kilometer");
  const hm = t("details.hm_hoehenmeter");

  if (!tour) return null;

  const duration =
    tour.number_of_days > 1
      ? tour.number_of_days + " " + t("details.tage")
      : convertNumToTime(Number(tour.avg_total_tour_duration), true);

  const kpis = [
    ...(tour.type
      ? [
          {
            key: "type",
            label: t("filter.sportart"),
            value: translateTourType(tour.type) ?? tour.type,
            icon: (
              <DirectionsRunIcon
                sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }}
              />
            ),
          },
        ]
      : []),
    {
      key: "dauer",
      label: t("main.dauer"),
      value: duration,
      icon: (
        <AccessTimeIcon sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }} />
      ),
    },
    {
      key: "distanz",
      label: t("main.distanz"),
      value: formatNumber(tour.distance ?? 0) + " " + km,
      icon: <RouteIcon sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }} />,
    },
    {
      key: "schwierigkeit",
      label: t("main.schwierigkeit"),
      value: tour.difficulty ? translateDiff(tour.difficulty) : "-",
      icon: (
        <SignalCellularAltIcon
          sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }}
        />
      ),
      valueColor: tour.difficulty
        ? difficultyColor(tour.difficulty)
        : undefined,
    },
    {
      key: "aufstieg",
      label: t("main.aufstieg"),
      value: formatNumber(tour.ascent ?? 0, " " + hm),
      icon: <NorthIcon sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }} />,
    },
    {
      key: "abstieg",
      label: t("main.abstieg"),
      value: formatNumber(tour.descent ?? 0, " " + hm),
      icon: <SouthIcon sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }} />,
    },
    {
      key: "max_ele",
      label: t("main.maximale_hoehe"),
      value: formatNumber(tour.max_ele ?? 0, " " + hm),
      icon: <TerrainIcon sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }} />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
      }}
    >
      {/* KPI grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "8px 12px",
        }}
      >
        {kpis.map((item) => (
          <Box
            key={item.key}
            sx={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {item.icon}
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#777",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: item.valueColor ?? "var(--bzb-bahnblau)",
                lineHeight: 1.2,
                pl: item.icon ? "22px" : 0,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TourDetailProperties;
