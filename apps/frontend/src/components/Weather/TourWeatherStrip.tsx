import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import {
  weatherDayLabelParts,
  weatherIconUrl,
  WEATHER_ICONS,
  WEATHER_STRIP_DAYS,
  type TourWeatherDay,
  type WeatherDayLabel,
  type WeatherIcon,
} from "../../models/tourWeather";
import { scoreToColor } from "../../models/weatherScore";

export interface TourWeatherStripProps {
  /** Already narrowed by `visibleWeatherDays` — the card needs the same list for its padding. */
  days?: TourWeatherDay[] | null;
  /** Hold the strip's height without a forecast, so stats rows stay aligned across a grid row. */
  reserveSpace?: boolean;
}

/** One rendered column. The placeholder is a row of empty cells, not fake weather. */
interface StripCell {
  key: string;
  label: WeatherDayLabel;
  icon: WeatherIcon | null;
  score: number | null;
}

/** The hairline already used between the stat columns above. */
const RULE = "#DDDDDD";

/** The icon separates the days at a glance, so it scales with the strip (`cqi`). */
const ICON_SIZE = "clamp(26px, 14cqi, 34px)";

const CELL_GAP_PX = 10;

/**
 * From this strip width on, the full date ("Mi 07.10.") is displayed.
 * On narrower strips, only the weekday ("Heute", "Di", "Mi", "Do") is shown
 * to keep the strip on a single compact line without wrapping.
 */
const FULL_DATE_LABEL_QUERY = `@container (min-width: ${
  WEATHER_STRIP_DAYS * 62 + (WEATHER_STRIP_DAYS - 1) * CELL_GAP_PX
}px)`;

export default function TourWeatherStrip({
  days,
  reserveSpace = false,
}: TourWeatherStripProps) {
  const { t, i18n } = useTranslation();
  const visibleDays = days ?? [];

  if (visibleDays.length === 0 && !reserveSpace) {
    return null;
  }

  const isPlaceholder = visibleDays.length === 0;
  const cells: StripCell[] = isPlaceholder
    ? Array.from({ length: WEATHER_STRIP_DAYS }, (_, index) => ({
        key: String(index),
        label: { weekday: " ", date: null },
        icon: null,
        score: null,
      }))
    : visibleDays.map((day) => ({
        key: day.date,
        label: weatherDayLabelParts(day.date, t, i18n.language),
        icon: day.icon === null ? null : WEATHER_ICONS[day.icon],
        score: day.score,
      }));

  return (
    <Box
      className="tour-weather-strip"
      role="group"
      aria-label={t("weather.button", "Wanderwetter")}
      // Hides the whole subtree from assistive tech, so the cells below need no
      // placeholder handling of their own.
      aria-hidden={isPlaceholder || undefined}
      sx={{
        containerType: "inline-size",
        visibility: isPlaceholder ? "hidden" : "visible",
        px: "16px",
        pt: "10px",
        pb: { xs: "11px", sm: "13px" },
        borderTop: `1px solid ${RULE}`,
      }}
    >
      <Box
        sx={{
          // Fixed columns, aligned with the stats grid above. A wrapping flex
          // row would break to 3+1 at `sm`, where a card is only ~223px wide.
          display: "grid",
          gridTemplateColumns: `repeat(${WEATHER_STRIP_DAYS}, minmax(0, 1fr))`,
          gap: `${CELL_GAP_PX}px`,
          alignItems: "stretch",
        }}
      >
        {cells.map((cell) => {
          // Days with no imported data keep their column, so dates stay
          // aligned with the cards either side of this one.
          const { icon } = cell;
          return (
            <Box
              key={cell.key}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                minWidth: 0,
              }}
            >
              <Typography
                variant="blackP"
                sx={{
                  fontSize: "13px",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  color: "#000",
                  "& .day-date": { display: "none" },
                  [FULL_DATE_LABEL_QUERY]: {
                    "& .day-date": { display: "inline" },
                  },
                }}
              >
                {cell.label.weekday}
                {cell.label.date && (
                  <span className="day-date"> {cell.label.date}</span>
                )}
              </Typography>
              {icon === null ? (
                <Box sx={{ width: ICON_SIZE, height: ICON_SIZE }} aria-hidden />
              ) : (
                <Box
                  component="img"
                  src={weatherIconUrl(icon)}
                  alt={t(`weather.condition.${icon.condition}`)}
                  width={34}
                  height={34}
                  loading="lazy"
                  decoding="async"
                  sx={{ width: ICON_SIZE, height: ICON_SIZE }}
                />
              )}
              <Typography
                variant="blackP"
                lang={i18n.language}
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textAlign: "center",
                  // These words wrap in a ~50px cell. Breaks come from the soft
                  // hyphens in assets/i18n ("Aus\u00adge\u00adzeich\u00adnet");
                  // add them at the syllable breaks for any new translation.
                  hyphens: "auto",
                  overflowWrap: "break-word",
                  color: icon === null ? "rgba(0, 0, 0, 0.35)" : "#000",
                }}
              >
                {icon === null ? "–" : t(`weather.grade.${icon.grade}`)}
              </Typography>
              {/* The score as a rule, not a fill: the map's colour ramp without
                  four saturated blocks per card. */}
              <Box
                sx={{
                  // Puts the four rules on one baseline whatever each word wraps to.
                  mt: "auto",
                  width: "100%",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor:
                    icon === null || cell.score === null
                      ? RULE
                      : scoreToColor(cell.score),
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
