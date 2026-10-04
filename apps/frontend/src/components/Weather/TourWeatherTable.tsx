import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
  type ComponentType,
} from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import NavigationIcon from "@mui/icons-material/Navigation";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import ThunderstormOutlinedIcon from "@mui/icons-material/ThunderstormOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  darkness,
  numberLocale,
  weatherIcon,
  weatherIconUrl,
  windCompassKey,
  type TourWeatherDetailDay,
  type TourWeatherHour,
} from "../../models/tourWeather";
import { MUTED, RULE, TEMP_HIGH_COLOR, TEMP_LOW_COLOR } from "./weatherStyles";

const NIGHT_RGB = "170, 181, 215";
const NIGHT_ALPHA = 0.16;
const NIGHT = `rgba(${NIGHT_RGB}, ${NIGHT_ALPHA})`;
const LABEL_WIDTH = 44;

/** Thunderstorm risk from which a cell is highlighted. */
const THUNDERSTORM_ALERT_PCT = 15;
/** Below this, the risk is shown in grey. */
const THUNDERSTORM_FAINT_PCT = 5;

/** Spread into each cell's own `sx`, so a cell's additions reliably win. */
const CELL = {
  p: "5px 0",
  textAlign: "center",
  whiteSpace: "nowrap",
  minWidth: { xs: 38, sm: 42 },
  fontWeight: 400,
} as const;

/** The row-label column stays in view while the hours scroll. */
const LABEL = {
  ...CELL,
  position: "sticky",
  left: 0,
  zIndex: 2,
  bgcolor: "#fff",
  minWidth: LABEL_WIDTH,
  width: LABEL_WIDTH,
  pr: "6px",
  borderRight: `1px solid ${RULE}`,
} as const;

const SR_ONLY = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

/** "–" means "none", an empty cell means "no forecast" — the two must not look alike. */
const NONE = (
  <Box component="span" sx={{ color: "#c4c7cf" }}>
    –
  </Box>
);

const faint = (text: string) => (
  <Box component="span" sx={{ color: MUTED }}>
    {text}
  </Box>
);

interface RowDef {
  key: string;
  icon?: ComponentType<SvgIconProps>;
  unit: string;
  /** Text under the icon in the label column; the unit unless the row needs a word. */
  caption?: string;
  label: string;
  /** Rule above the row, separating groups of related values. */
  separated?: boolean;
  cellSx?: object;
  alert?: (hour: TourWeatherHour) => boolean;
  render: (hour: TourWeatherHour) => ReactNode;
}

function buildRows(
  t: TFunction,
  format: (value: number, digits?: 0 | 1) => string,
  maxEle: number | undefined,
  hours: TourWeatherHour[],
): RowDef[] {
  const rows: RowDef[] = [
    {
      key: "temp_max",
      icon: ThermostatIcon,
      unit: "°C",
      caption: "max",
      label: t("weather.detail.rows.temp_max.label"),
      cellSx: { color: TEMP_HIGH_COLOR, pb: 0 },
      render: (hour) =>
        hour.temp_high_c === null ? null : `${format(hour.temp_high_c)}°`,
    },
    {
      key: "temp_min",
      unit: "°C",
      caption: "min",
      label: t("weather.detail.rows.temp_min.label"),
      cellSx: { color: TEMP_LOW_COLOR, pt: "1px" },
      render: (hour) =>
        hour.temp_low_c === null ? null : `${format(hour.temp_low_c)}°`,
    },
    {
      key: "sunshine",
      icon: WbSunnyOutlinedIcon,
      unit: "min",
      label: t("weather.detail.rows.sunshine.label"),
      separated: true,
      render: (hour) => {
        if (hour.sunshine_h === null) return null;
        const minutes = Math.round(hour.sunshine_h * 60);
        return minutes === 0 ? NONE : format(minutes);
      },
    },
    {
      key: "wind_direction",
      icon: NavigationIcon,
      unit: t("weather.detail.rows.wind_direction.unit"),
      label: t("weather.detail.rows.wind_direction.label"),
      separated: true,
      render: (hour) =>
        hour.wind_direction_deg === null ? null : (
          <Box
            component="span"
            title={`${format(hour.wind_direction_deg)}°`}
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 1,
            }}
          >
            {/* The arrow points where the wind blows to, the letters name where it comes from. */}
            <NavigationIcon
              sx={{
                fontSize: 15,
                color: "var(--bzb-bahnblau)",
                transform: `rotate(${hour.wind_direction_deg + 180}deg)`,
              }}
            />
            <Box
              component="span"
              sx={{ fontSize: 11, color: MUTED, mt: "2px" }}
            >
              {t(
                `weather.detail.compass.${windCompassKey(hour.wind_direction_deg)}`,
              )}
            </Box>
          </Box>
        ),
    },
    {
      key: "wind_speed",
      icon: AirIcon,
      unit: "km/h",
      label: t("weather.detail.rows.wind_speed.label"),
      render: (hour) =>
        hour.wind_speed_kmh === null ? null : format(hour.wind_speed_kmh),
    },
    {
      key: "precipitation",
      icon: WaterDropOutlinedIcon,
      unit: "mm",
      label: t("weather.detail.rows.precipitation.label"),
      separated: true,
      render: (hour) => {
        const mm = hour.precipitation_mm;
        if (mm === null) return null;
        if (mm === 0) return NONE;
        if (mm < 0.1) return faint(`<${format(0.1, 1)}`);
        return (
          <Box
            component="span"
            sx={{ color: "var(--bzb-bahnblau)", fontWeight: 700 }}
          >
            {format(mm, 1)}
          </Box>
        );
      },
    },
    {
      key: "thunderstorm",
      icon: ThunderstormOutlinedIcon,
      unit: "%",
      label: t("weather.detail.rows.thunderstorm.label"),
      alert: (hour) =>
        hour.thunderstorm_pct !== null &&
        hour.thunderstorm_pct >= THUNDERSTORM_ALERT_PCT,
      render: (hour) => {
        const pct = hour.thunderstorm_pct;
        if (pct === null) return null;
        if (pct < 1) return NONE;
        return pct < THUNDERSTORM_FAINT_PCT ? faint(format(pct)) : format(pct);
      },
    },
  ];

  // Only once the weather import fills it; until then the row would be all blanks.
  if (hours.some((hour) => hour.freezing_level_m !== null)) {
    rows.push({
      key: "freezing_level",
      icon: AcUnitIcon,
      unit: "m",
      label: t("weather.detail.rows.freezing_level.label"),
      separated: true,
      alert: (hour) =>
        maxEle !== undefined &&
        hour.freezing_level_m !== null &&
        hour.freezing_level_m <= maxEle,
      render: (hour) =>
        hour.freezing_level_m === null ? null : format(hour.freezing_level_m),
    });
  }
  return rows;
}

/**
 * The night shading of each column. A column stands for hour..hour+1; sampling
 * the darkness across it keeps dawn and dusk a continuous gradient over the
 * column borders.
 */
function nightShading(day: TourWeatherDetailDay, hours: TourWeatherHour[]) {
  return hours.map((hour) => {
    const samples = [0, 0.25, 0.5, 0.75, 1].map((offset) =>
      darkness(hour.hour + offset, day),
    );
    if (samples.every((level) => level === 0)) return {};
    if (samples.every((level) => level === 1)) return { bgcolor: NIGHT };
    const stops = samples.map(
      (level, i) =>
        `rgba(${NIGHT_RGB}, ${(NIGHT_ALPHA * level).toFixed(3)}) ${i * 25}%`,
    );
    return { background: `linear-gradient(90deg, ${stops.join(", ")})` };
  });
}

interface TourWeatherTableProps {
  day: TourWeatherDetailDay;
  /** The day's `hoursInWindow`, one column each. */
  hours: TourWeatherHour[];
  /** Highest point of the tour, for the freezing-level highlight. */
  maxEle?: number;
}

export default function TourWeatherTable({
  day,
  hours,
  maxEle,
}: TourWeatherTableProps) {
  const { t, i18n } = useTranslation();
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const format = useMemo(() => {
    const locale = numberLocale(i18n.language);
    const formatters = [0, 1].map(
      (digits) =>
        new Intl.NumberFormat(locale, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }),
    );
    return (value: number, digits: 0 | 1 = 0) =>
      formatters[digits].format(value);
  }, [i18n.language]);

  const trackScroll = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const update = () =>
      setScrolledToEnd(
        node.scrollLeft + node.clientWidth >= node.scrollWidth - 2,
      );
    update();
    node.addEventListener("scroll", update, { passive: true });
  }, []);

  const rows = buildRows(t, format, maxEle, hours);
  const night = useMemo(() => nightShading(day, hours), [day, hours]);

  return (
    <Box
      sx={{
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 28,
          pointerEvents: "none",
          background: "linear-gradient(90deg, rgba(255,255,255,0), #fff)",
          opacity: scrolledToEnd ? 0 : 1,
          transition: "opacity .2s",
        },
      }}
    >
      <Box
        ref={trackScroll}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "thin",
          overscrollBehaviorX: "contain",
        }}
      >
        <Box
          component="table"
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: "100%",
            fontSize: { xs: 13, sm: 14 },
            fontVariantNumeric: "tabular-nums",
            color: "#101010",
          }}
        >
          <Box component="caption" sx={SR_ONLY}>
            {day.date}
          </Box>
          <tbody>
            <tr>
              <Box
                component="th"
                scope="col"
                sx={{ ...LABEL, fontSize: 11, color: MUTED }}
              >
                {t("weather.detail.hour")}
              </Box>
              {hours.map((hour, col) => (
                <Box
                  component="th"
                  scope="col"
                  key={hour.hour}
                  sx={{
                    ...CELL,
                    fontSize: 13,
                    fontWeight: 700,
                    pt: "2px",
                    ...night[col],
                  }}
                >
                  {String(hour.hour).padStart(2, "0")}
                </Box>
              ))}
            </tr>
            <tr>
              <Box component="th" scope="row" sx={LABEL}>
                <Box component="span" sx={SR_ONLY}>
                  {t("weather.detail.condition_label")}
                </Box>
              </Box>
              {hours.map((hour, col) => {
                const icon = weatherIcon(hour.icon);
                return (
                  <Box
                    component="td"
                    key={hour.hour}
                    sx={{ ...CELL, py: "2px", ...night[col] }}
                  >
                    {icon && (
                      <Box
                        component="img"
                        src={weatherIconUrl(icon)}
                        alt={t(`weather.condition.${icon.condition}`)}
                        title={t(`weather.condition.${icon.condition}`)}
                        width={32}
                        height={32}
                        loading="lazy"
                        sx={{ display: "block", mx: "auto" }}
                      />
                    )}
                  </Box>
                );
              })}
            </tr>
            {rows.map((row) => {
              const Icon = row.icon;
              const ruleSx = row.separated
                ? { borderTop: `1px solid ${RULE}` }
                : {};
              return (
                <tr key={row.key}>
                  <Box component="th" scope="row" sx={{ ...LABEL, ...ruleSx }}>
                    {(Icon || row.caption) && (
                      <Tooltip
                        title={
                          row.unit ? `${row.label} (${row.unit})` : row.label
                        }
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            lineHeight: 1,
                          }}
                        >
                          {Icon && (
                            <Icon
                              aria-hidden
                              sx={{
                                fontSize: 18,
                                color: "var(--bzb-bahnblau)",
                              }}
                            />
                          )}
                          <Box
                            component="span"
                            aria-hidden
                            sx={{
                              fontSize: 11,
                              color: MUTED,
                              mt: Icon ? "3px" : 0,
                            }}
                          >
                            {row.caption ?? row.unit}
                          </Box>
                        </Box>
                      </Tooltip>
                    )}
                    <Box component="span" sx={SR_ONLY}>
                      {row.label}
                    </Box>
                  </Box>
                  {hours.map((hour, col) => {
                    const alert = row.alert?.(hour) ?? false;
                    return (
                      <Box
                        component="td"
                        key={hour.hour}
                        sx={{
                          ...CELL,
                          ...ruleSx,
                          ...row.cellSx,
                          ...(alert
                            ? {
                                bgcolor: "var(--bzb-warnorange-light)",
                                color: "var(--bzb-warnorange-dark)",
                                fontWeight: 700,
                              }
                            : night[col]),
                        }}
                      >
                        {row.render(hour)}
                      </Box>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
}
