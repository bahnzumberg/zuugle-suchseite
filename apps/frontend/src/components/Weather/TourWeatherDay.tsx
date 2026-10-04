import { useMemo } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import { useTranslation } from "react-i18next";
import {
  formatWeatherDayLabel,
  hoursInWindow,
  numberLocale,
  tempRange,
  weatherIcon,
  weatherIconUrl,
  type TourWeatherDetailDay,
} from "../../models/tourWeather";
import TourWeatherTable from "./TourWeatherTable";
import {
  MUTED,
  RULE,
  TEMP_HIGH_COLOR,
  TEMP_LOW_COLOR,
  TWILIGHT_COLOR,
} from "./weatherStyles";

const TAG = {
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1.6,
  px: "7px",
  borderRadius: "999px",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
} as const;

interface TourWeatherDayProps {
  day: TourWeatherDetailDay;
  expanded: boolean;
  onToggle: () => void;
  isTourDay: boolean;
  maxEle?: number;
}

export default function TourWeatherDay({
  day,
  expanded,
  onToggle,
  isTourDay,
  maxEle,
}: TourWeatherDayProps) {
  const { t, i18n } = useTranslation();
  const locale = numberLocale(i18n.language);

  const icon = weatherIcon(day.icon);
  const hours = useMemo(() => hoursInWindow(day), [day]);
  const range = tempRange(hours);
  const dateLabel = formatWeatherDayLabel(day.date, t, i18n.language);
  const id = `tour-weather-${day.date}`;

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      disableGutters
      elevation={0}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        id={`${id}-header`}
        aria-controls={`${id}-content`}
        expandIcon={<ExpandMoreIcon sx={{ color: "var(--bzb-bahnblau)" }} />}
        sx={{
          px: { xs: 1, sm: 1.25 },
          minHeight: 56,
          "& .MuiAccordionSummary-content": {
            my: 1,
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
            minWidth: 0,
          },
        }}
      >
        <Box
          sx={{
            width: { xs: 34, sm: 40 },
            height: { xs: 34, sm: 40 },
            flex: "none",
          }}
        >
          {icon && (
            <Box
              component="img"
              src={weatherIconUrl(icon)}
              alt=""
              width={40}
              height={40}
              sx={{ width: "100%", height: "100%", display: "block" }}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box component="span" sx={{ fontWeight: 700, fontSize: 16 }}>
              {dateLabel}
            </Box>
            {isTourDay && (
              <Box
                component="span"
                sx={{ ...TAG, bgcolor: "var(--bzb-akelei)", color: "#fff" }}
              >
                {t("weather.detail.tour_day")}
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                fontSize: { xs: 13, sm: 14 },
                color: MUTED,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {t(`weather.condition.${icon.condition}`)}
            </Box>
          )}
        </Box>
        {range && (
          <Box
            sx={{
              fontSize: 16,
              fontWeight: 700,
              whiteSpace: "nowrap",
              color: MUTED,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <Box component="span" sx={{ color: TEMP_HIGH_COLOR }}>
              {Math.round(range.max).toLocaleString(locale)}°
            </Box>
            <Box component="span" sx={{ fontWeight: 400, mx: "4px" }}>
              /
            </Box>
            <Box component="span" sx={{ color: TEMP_LOW_COLOR }}>
              {Math.round(range.min).toLocaleString(locale)}°
            </Box>
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails
        id={`${id}-content`}
        sx={{
          px: { xs: 1, sm: 1.25 },
          pt: 0,
          pb: 1.25,
          borderTop: `1px solid ${RULE}`,
        }}
      >
        {day.sunrise && day.sunset && (
          <Box
            sx={{
              display: "flex",
              gap: 2.25,
              flexWrap: "wrap",
              fontSize: 14,
              color: MUTED,
              py: 1,
              "& > span": {
                display: "inline-flex",
                alignItems: "center",
                gap: 0.6,
              },
              "& b": { color: "#101010", fontWeight: 700 },
            }}
          >
            <span>
              <WbTwilightIcon sx={{ fontSize: 18, color: TWILIGHT_COLOR }} />
              {t("weather.detail.sunrise")} <b>{day.sunrise}</b>
            </span>
            <span>
              <WbTwilightIcon
                sx={{
                  fontSize: 18,
                  color: TWILIGHT_COLOR,
                  transform: "scaleY(-1)",
                }}
              />
              {t("weather.detail.sunset")} <b>{day.sunset}</b>
            </span>
          </Box>
        )}
        {hours.length > 0 ? (
          <TourWeatherTable day={day} hours={hours} maxEle={maxEle} />
        ) : (
          <Box sx={{ fontSize: 14, color: MUTED, py: 0.75 }}>
            {t("weather.detail.no_hours")}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
