import type { ReactNode, ComponentType } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import CloseIcon from "@mui/icons-material/Close";
import NavigationIcon from "@mui/icons-material/Navigation";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import ThunderstormOutlinedIcon from "@mui/icons-material/ThunderstormOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import { useTranslation } from "react-i18next";
import { useGetWeatherMetadataQuery } from "../../features/apiSlice";
import { weatherIconUrl, WEATHER_ICONS } from "../../models/tourWeather";
import { formatWeatherGeneratedAt } from "../Map/WeatherControls";
import { numberLocale } from "./TourWeatherTable";

const ROWS: {
  key: string;
  icon: ComponentType<SvgIconProps>;
  unit?: string;
}[] = [
  { key: "temp_max", icon: ThermostatIcon, unit: "°C" },
  { key: "temp_min", icon: ThermostatIcon, unit: "°C" },
  { key: "sunshine", icon: WbSunnyOutlinedIcon, unit: "min" },
  { key: "wind_direction", icon: NavigationIcon },
  { key: "wind_speed", icon: AirIcon, unit: "km/h" },
  { key: "precipitation", icon: WaterDropOutlinedIcon, unit: "mm" },
  { key: "thunderstorm", icon: ThunderstormOutlinedIcon, unit: "%" },
  { key: "freezing_level", icon: AcUnitIcon, unit: "m" },
];

interface TourWeatherInfoDialogProps {
  open: boolean;
  onClose: () => void;
  maxEle?: number;
}

export default function TourWeatherInfoDialog({
  open,
  onClose,
  maxEle,
}: TourWeatherInfoDialogProps) {
  const { t, i18n } = useTranslation();
  const { data: metadata } = useGetWeatherMetadataQuery();

  const entries: {
    key: string;
    icon: ReactNode;
    title: string;
    help: string;
  }[] = [
    {
      key: "condition",
      icon: (
        <Box
          component="img"
          src={weatherIconUrl(WEATHER_ICONS[1])}
          alt=""
          width={22}
          height={22}
        />
      ),
      title: t("weather.detail.condition_label"),
      help: t("weather.detail.condition_help"),
    },
    ...ROWS.map(({ key, icon: Icon, unit }) => ({
      key,
      icon: <Icon sx={{ fontSize: 18, color: "var(--bzb-bahnblau)" }} />,
      title: unit
        ? `${t(`weather.detail.rows.${key}.label`)} (${unit})`
        : t(`weather.detail.rows.${key}.label`),
      help: t(`weather.detail.rows.${key}.help`, {
        elevation:
          maxEle === undefined
            ? "–"
            : maxEle.toLocaleString(numberLocale(i18n.language)),
      }),
    })),
    {
      key: "daylight",
      icon: <WbTwilightIcon sx={{ fontSize: 18, color: "#f8af18" }} />,
      title: t("weather.detail.daylight_label"),
      help: t("weather.detail.daylight_help"),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="tour-weather-info-title"
    >
      <DialogTitle
        id="tour-weather-info-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: "18px",
          pr: 1,
        }}
      >
        {t("weather.detail.info_title")}
        <IconButton
          aria-label={t("details.schliessen")}
          onClick={onClose}
          size="small"
          sx={{ color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ fontSize: 14 }}>
        <Typography sx={{ fontSize: 14, mb: 2 }}>
          {t("weather.detail.info_intro")}
        </Typography>
        <Box
          component="dl"
          sx={{
            display: "grid",
            gridTemplateColumns: "28px 1fr",
            gap: "10px 10px",
            m: 0,
          }}
        >
          {entries.map((entry) => (
            <Box key={entry.key} sx={{ display: "contents" }}>
              <Box
                component="dt"
                sx={{ display: "flex", justifyContent: "center", pt: "2px" }}
              >
                {entry.icon}
              </Box>
              <Box component="dd" sx={{ m: 0 }}>
                <Box
                  component="span"
                  sx={{ display: "block", fontWeight: 700 }}
                >
                  {entry.title}
                </Box>
                {entry.help}
              </Box>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontSize: 14, color: "#777", mt: 2 }}>
          {t("weather.detail.empty_help")}
        </Typography>
        {metadata && (
          <Typography
            sx={{
              fontSize: 13,
              color: "#777",
              mt: 2,
              pt: 1.5,
              borderTop: "1px solid #e4e6ee",
            }}
          >
            {formatWeatherGeneratedAt(metadata.generated_at, t, i18n.language)}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
