import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import {
  formatWeatherWeekday,
  visibleWeatherDays,
  weatherIconUrl,
  WEATHER_ICONS,
  WEATHER_STRIP_DAYS,
  type TourWeatherDay,
} from "../../models/tourWeather";
import { scoreToColor } from "../../models/weatherScore";

export interface WanderwetterStripProps {
  days?: TourWeatherDay[] | null;
  /** Hold the strip's height without a forecast, so stats rows stay aligned across a grid row. */
  reserveSpace?: boolean;
}

/** Any icon works for the placeholder; it is never painted. */
const PLACEHOLDER_ICON_ID = 5;

/** The hairline already used between the stat columns above. */
const RULE = "#DDDDDD";

/** The icon separates the days at a glance, so it scales with the strip (`cqi`). */
const ICON_SIZE = "clamp(26px, 14cqi, 34px)";

export default function WanderwetterStrip({
  days,
  reserveSpace = false,
}: WanderwetterStripProps) {
  const { t, i18n } = useTranslation();
  const visibleDays = visibleWeatherDays(days);

  if (visibleDays.length === 0 && !reserveSpace) {
    return null;
  }

  const isPlaceholder = visibleDays.length === 0;
  const cells: TourWeatherDay[] = isPlaceholder
    ? Array.from({ length: WEATHER_STRIP_DAYS }, (_, index) => ({
        date: String(index),
        icon: PLACEHOLDER_ICON_ID,
        score: 50,
      }))
    : visibleDays;

  return (
    <Box
      className="wanderwetter-strip"
      role={isPlaceholder ? undefined : "group"}
      aria-label={
        isPlaceholder ? undefined : t("weather.button", "Wanderwetter")
      }
      aria-hidden={isPlaceholder || undefined}
      sx={{
        containerType: "inline-size",
        visibility: isPlaceholder ? "hidden" : "visible",
        px: "16px",
        pt: "10px",
        pb: { xs: "12px", sm: "14px" },
        borderTop: `1px solid ${RULE}`,
      }}
    >
      <Typography
        variant="grayP"
        sx={{
          display: "block",
          fontSize: "10px",
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          mb: "8px",
        }}
      >
        {t("weather.button", "Wanderwetter")}
      </Typography>
      <Box
        sx={{
          // Fixed columns, aligned with the stats grid above. A wrapping flex
          // row would break to 3+1 at `sm`, where a card is only ~223px wide.
          display: "grid",
          gridTemplateColumns: `repeat(${WEATHER_STRIP_DAYS}, minmax(0, 1fr))`,
          gap: "10px",
          alignItems: "stretch",
        }}
      >
        {cells.map((day) => {
          // Days with no imported data keep their column, so dates stay
          // aligned with the cards either side of this one.
          const icon = day.icon === null ? null : WEATHER_ICONS[day.icon];
          return (
            <Box
              key={day.date}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "9.5px",
                  lineHeight: 1,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                  color: "rgba(0, 0, 0, 0.45)",
                }}
              >
                {isPlaceholder
                  ? " "
                  : formatWeatherWeekday(day.date, t, i18n.language)}
              </Typography>
              {icon === null ? (
                <Box sx={{ width: ICON_SIZE, height: ICON_SIZE }} aria-hidden />
              ) : (
                <Box
                  component="img"
                  src={weatherIconUrl(icon)}
                  alt={
                    isPlaceholder
                      ? ""
                      : t(`weather.condition.${icon.condition}`)
                  }
                  width={34}
                  height={34}
                  loading="lazy"
                  decoding="async"
                  sx={{ width: ICON_SIZE, height: ICON_SIZE }}
                />
              )}
              <Typography
                lang={i18n.language}
                sx={{
                  // Not uppercased like the label above: at this size that
                  // mangles the diacritics in "Mäßig", "Médiocre", "Odlično".
                  fontSize: "clamp(9px, 4.4cqi, 11.5px)",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  textAlign: "center",
                  // These words wrap in a ~50px cell. Breaks come from the soft
                  // hyphens in assets/i18n ("Aus\u00adge\u00adzeich\u00adnet");
                  // add them at the syllable breaks for any new translation.
                  hyphens: "auto",
                  overflowWrap: "break-word",
                  color: icon === null ? "rgba(0, 0, 0, 0.35)" : "#1F2933",
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
                    icon === null || day.score === null
                      ? RULE
                      : scoreToColor(day.score),
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
