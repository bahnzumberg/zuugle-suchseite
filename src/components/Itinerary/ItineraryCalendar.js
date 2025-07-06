import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/fr";
import "dayjs/locale/it";
import "dayjs/locale/sl";
import { useTranslation } from "react-i18next";

const formatDate = (date, locale) => {
  const formats = {
    fr: "dddd D MMMM YYYY",
    de: "dddd, D. MMMM YYYY",
    sl: "dddd, D. MMMM YYYY",
    it: "dddd D MMMM YYYY",
    en: "dddd, D MMMM YYYY",
  };
  // Set locale and format the date
  return date.locale(locale).format(formats[locale]);
};

const dayOfWeek = (date, locale) => {
  // Use the locale-aware formatting function for Day.js
  return date.locale(locale).format("dd");
};

const isWe = (date) => {
  const d = date.day();
  return d === 6 || d === 0; // In Day.js, Sunday is 0 and Saturday is 6
};

const isSelectedDay = (date, selectedDay) => {
  return date.isSame(selectedDay, "day");
};

const ItineraryCalendar = ({ connectionData, dateIndex, updateConnIndex }) => {
  const { i18n } = useTranslation();
  let selectedDay = dateIndex;
  let days = [];

  if (!connectionData || dateIndex === undefined) {
    return <></>;
  } else {
    days = connectionData?.map((con) => dayjs(con.date));
  }

  return (
    <div className="tour-detail-itinerary-calendar">
      <div className="tour-detail-itinerary-calendar-selected-day">
        {formatDate(dayjs(connectionData[selectedDay].date), i18n.language)}
      </div>
      <div className="tour-detail-itinerary-calendar-grid">
        {days.map((dd) => (
          <div
            key={"1" + dd.date()}
            className={`${
              isWe(dd)
                ? "tour-detail-itinerary-calendar-week-end"
                : "tour-detail-itinerary-calendar-week-day"
            }`}
          >
            {dayOfWeek(dd, i18n.language)}
          </div>
        ))}
        {days.map((dd, index) => (
          <div
            key={"2" + dd.date()}
            className={`${
              isSelectedDay(dd, dayjs(connectionData[selectedDay].date))
                ? "tour-detail-itinerary-calendar-grid-selected"
                : "tour-detail-itinerary-calendar-date"
            }`}
            onClick={() => updateConnIndex(index)}
          >
            {dd.date()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryCalendar;
