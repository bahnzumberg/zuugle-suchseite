import { useState, useEffect } from "react";
import { Typography, Divider } from "@mui/material";
import { convertNumToTime, formatNumber } from "../utils/globals";
import { useTranslation } from "react-i18next";
import { tourTypes } from "../utils/language_Utils";

const TourDetailProperties = ({ tour }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 679);

  // const isDesktop = window.innerWidth >= 679;

  const { t } = useTranslation();

  const m = t("details.m_meter");
  const km = t("details.km_kilometer");
  const hm = t("details.hm_hoehenmeter");

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 679);
    };

    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const translateTourType = (type) => {
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

  return (
    <>
      {tour && (
        <div className="tour-detail-properties">
          <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>{t("main.sportart")}</Typography>
            <Typography variant={"h5alt"}>
              {tour && translateTourType(tour.type)}
            </Typography>
          </div>
          {/* Both mobile and desktop: we need the vertical divider here below to be visible */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: "50%",
              alignSelf: "center",
              backgroundColor: "#DDDDDD",
            }}
          />
          <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>{t("main.dauer")}</Typography>
            <Typography variant={"h5alt"}>
              {tour?.number_of_days > 1
                ? tour?.number_of_days + " " + t("details.tage")
                : convertNumToTime(tour?.avg_total_tour_duration, true)}
            </Typography>
          </div>
          {/* only mobile: we need the horizontal divider here below to be visible */}
          {!isDesktop && (
            <Divider
              orientation="horizontal"
              sx={{
                margin: "0.25rem 0",
                gridColumn: "1 / -1",
                backgroundColor: "#DDDDDD",
                width: "90%",
                height: "1px",
              }}
            />
          )}
          {/* only desktop: we need the vertical divider here below to be visible */}
          {isDesktop && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "50%",
                alignSelf: "center",
                backgroundColor: "#DDDDDD",
              }}
            />
          )}
          <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>{t("main.distanz")}</Typography>
            <Typography variant={"h5alt"}>
              {formatNumber(tour?.distance) + " " + km}
            </Typography>
          </div>
          {/* only desktop: we need the horizontal divider here below to be visible */}
          {isDesktop && (
            <Divider
              orientation="horizontal"
              sx={{
                margin: "0.25rem 0",
                gridColumn: "1 / -1",
                backgroundColor: "#DDDDDD",
                width: "90%",
                height: "1px",
              }}
            />
          )}
          {/* only mobile: we need the vertical divider here below to be visible */}
          {!isDesktop && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "50%",
                alignSelf: "center",
                backgroundColor: "#DDDDDD",
              }}
            />
          )}
          <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>
              {t("main.maximale_hoehe")}
            </Typography>
            <Typography variant={"h5alt"}>
              {tour?.max_ele ? formatNumber(tour.max_ele) + " " + m : "-"}
            </Typography>
          </div>
          {/* only mobile: we need the horizontal divider here below to be visible */}
          {!isDesktop && (
            <Divider
              orientation="horizontal"
              sx={{
                margin: "0.25rem 0",
                gridColumn: "1 / -1",
                backgroundColor: "#DDDDDD",
                width: "90%",
                height: "1px",
              }}
            />
          )}
          {/* only desktop: we need the vertical divider here below to be visible */}
          {isDesktop && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: "50%",
                alignSelf: "center",
                backgroundColor: "#DDDDDD",
              }}
            />
          )}
          <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>{t("main.aufstieg")}</Typography>
            <Typography variant={"h5alt"}>
              {formatNumber(tour?.ascent, " " + hm)}
            </Typography>
          </div>
          {/* Both mobile and desktop: we need the vertical divider here below to be visible */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: "50%",
              alignSelf: "center",
              backgroundColor: "#DDDDDD",
            }}
          />
          <div className="tour-detail-properties-el">
            <Typography variant={"infoKey"}>{t("main.abstieg")}</Typography>
            <Typography variant={"h5alt"}>
              {formatNumber(tour?.descent, " " + hm)}
            </Typography>
          </div>
          {/* Both mobile and desktop: we need the horizontal divider here below to be visible */}
          <Divider
            orientation="horizontal"
            sx={{
              margin: "0.25rem 0",
              gridColumn: "1 / -1",
              backgroundColor: "#DDDDDD",
              width: "90%",
              height: "1px",
            }}
          />
        </div>
      )}
    </>
  );
};

export default TourDetailProperties;
