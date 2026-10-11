import { memo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
import { useGetTourWeatherQuery } from "../../features/apiSlice";
import TourWeatherDay from "./TourWeatherDay";
import TourWeatherInfoDialog from "./TourWeatherInfoDialog";
import { MUTED } from "./weatherStyles";

interface TourWeatherPanelProps {
  tourId: string;
  /** "YYYY-MM-DD" from the connection search; only marked as the tour day. */
  activityDate: string | null;
  /** The day shown by the panel and the map; it opens when it is in the forecast. */
  selectedDate: string | null;
  maxEle?: number;
  onSelectDate: (date: string) => void;
}

/**
 * Today and the next three days for one tour, each expandable to an hourly
 * table. Renders nothing while loading, on error or without a forecast.
 */
// Memoized: TourDetails re-renders on every connection-stop hover, and the open table is large.
export default memo(function TourWeatherPanel({
  tourId,
  activityDate,
  selectedDate,
  maxEle,
  onSelectDate,
}: TourWeatherPanelProps) {
  const { t } = useTranslation();
  const { data: days = [] } = useGetTourWeatherQuery(tourId);
  // One day at a time: an open day's table is tall, the closed rows already compare the days.
  const [open, setOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  if (days.length === 0) return null;

  const openDay = open ? selectedDate : null;

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
        {/* Styled like the map's Wanderwetter button, so both read as the same feature. */}
        <WbSunnyRoundedIcon
          aria-hidden
          sx={{ fontSize: 20, color: "var(--bzb-akelei)", mr: "7px" }}
        />
        <Typography
          id="tour-weather-title"
          component="h2"
          sx={{
            flex: 1,
            fontSize: 16,
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
          sx={{ fontSize: 14, color: MUTED, mx: "2px", mt: -0.5, mb: 1.25 }}
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
            onToggle={() => {
              setOpen(!(open && day.date === selectedDate));
              onSelectDate(day.date);
            }}
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
});
