import { convertNumToTime, formatNumber } from "../utils/globals";
import { useTranslation } from "react-i18next";
import { tourTypes } from "../utils/language_Utils";
import { Tour } from "../models/Tour";
import Typography from "@mui/material/Typography";

export interface TourDetailPropertiesProps {
  tour?: Tour;
}

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
    if (diff === "Leicht" || diff === "leicht") {
      return t("start.leicht");
    } else if (diff === "Schwer" || diff === "schwer") {
      return t("start.schwer");
    } else return t("start.mittel");
  };

  const km = t("details.km_kilometer");
  const hm = t("details.hm_hoehenmeter");

  // Property items for the grid
  const items = [
    {
      key: "sportart",
      label: t("main.sportart"),
      value: tour && translateTourType(tour.type),
      hideLabel: true,
    },
    {
      key: "gebirgsgruppe",
      label: t("main.gebirgsgruppe"),
      value: tour?.range || "-",
      hideLabel: true,
    },
    {
      key: "dauer",
      label: t("main.dauer"),
      value:
        tour && tour.number_of_days > 1
          ? tour.number_of_days + " " + t("details.tage")
          : convertNumToTime(Number(tour?.avg_total_tour_duration), true),
    },
    {
      key: "distanz",
      label: t("main.distanz"),
      value: formatNumber(tour?.distance ?? 0) + " " + km,
    },
    {
      key: "schwierigkeit",
      label: t("main.schwierigkeit"),
      value: tour?.difficulty ? translateDiff(tour.difficulty) : "-",
    },
    {
      key: "aufstieg",
      label: t("main.aufstieg"),
      value: formatNumber(tour?.ascent ?? 0, " " + hm),
    },
    {
      key: "abstieg",
      label: t("main.abstieg"),
      value: formatNumber(tour?.descent ?? 0, " " + hm),
    },
  ];

  return (
    <>
      {tour && (
        <div className="tour-detail-properties">
          {items.map((item) => (
            <div className="tour-detail-properties-el" key={item.key}>
              {!item.hideLabel && (
                <Typography variant="body1">{item.label}</Typography>
              )}
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: "var(--bzb-bahnblau)" }}
              >
                {item.value}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TourDetailProperties;
