import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloudQueueOutlinedIcon from "@mui/icons-material/CloudQueueOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
import { useGetTourWeatherQuery } from "../../features/apiSlice";
import { todayInVienna } from "../../models/tourWeather";
import TourWeatherDay from "./TourWeatherDay";
import TourWeatherInfoDialog from "./TourWeatherInfoDialog";

interface TourWeatherPanelProps {
  tourId: string;
  /** "YYYY-MM-DD" from the connection search; that day opens. */
  activityDate: string | null;
  maxEle?: number;
}

/**
 * Today and the next three days for one tour, each expandable to an hourly
 * table. Renders nothing while loading, on error or without a forecast.
 */
export default function TourWeatherPanel({
  tourId,
  activityDate,
  maxEle,
}: TourWeatherPanelProps) {
  const { t } = useTranslation();
  const { data } = useGetTourWeatherQuery(tourId);
  // One day at a time: an open day's table is tall, the closed rows already compare the days.
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (activityDate) setOpenDay(activityDate);
  }, [activityDate]);

  // RTK Query's cache can outlive midnight, so drop days that are already past.
  const today = todayInVienna();
  const days = (data ?? []).filter((day) => day.date >= today);
  if (days.length === 0) return null;

  const activityOutsideForecast =
    activityDate !== null && !days.some((day) => day.date === activityDate);

  return (
    <Box
      component="section"
      aria-labelledby="tour-weather-title"
      className="tour-weather-panel"
      sx={{
        bgcolor: "rgba(170, 181, 215, 0.25)",
        borderRadius: "12px",
        p: { xs: "10px 8px 8px", sm: "14px 14px 12px" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mx: "2px", mb: 1.25 }}>
        {/* Exactly the map's Wanderwetter button, so both read as the same feature. */}
        <CloudQueueOutlinedIcon
          aria-hidden
          sx={{ fontSize: 20, color: "var(--bzb-akelei)", mr: "7px" }}
        />
        <Typography
          id="tour-weather-title"
          component="h2"
          sx={{
            flex: 1,
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--bzb-bahnblau)",
          }}
        >
          {t("weather.button")}
        </Typography>
        <IconButton
          aria-label={t("weather.detail.info_label")}
          aria-haspopup="dialog"
          onClick={() => setInfoOpen(true)}
          size="small"
          sx={{ color: "var(--bzb-bahnblau)" }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Box>
      {activityOutsideForecast && (
        <Typography
          sx={{ fontSize: 14, color: "#777", mx: "2px", mt: -0.5, mb: 1.25 }}
        >
          {t("weather.detail.outside_window")}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {days.map((day) => (
          <TourWeatherDay
            key={day.date}
            day={day}
            expanded={openDay === day.date}
            onToggle={() =>
              setOpenDay((current) => (current === day.date ? null : day.date))
            }
            isTourDay={day.date === activityDate}
            maxEle={maxEle}
          />
        ))}
      </Box>
      <TourWeatherInfoDialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        maxEle={maxEle}
      />
    </Box>
  );
}
