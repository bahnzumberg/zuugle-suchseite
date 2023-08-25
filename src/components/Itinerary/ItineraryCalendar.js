import React from "react";
import moment from "moment";
import "moment/locale/de";
import "moment/locale/fr";
import "moment/locale/it";
import "moment/locale/sl";
import { useTranslation } from "react-i18next";
import * as _ from "lodash";

const formatDate = (date, locale) => {
  const formats = {
    fr: "dddd D MMMM YYYY",
    de: "dddd, D. MMMM YYYY",
    sl: "dddd, D. MMMM YYYY",
    it: "dddd D MMMM YYYY",
    en: "dddd, D MMMM YYYY",
  };
  moment.locale(locale);
  return date.format(formats[locale]);
};

const dayOfWeek = (date, locale) => {
  moment.locale(locale);
  return moment(date).format("dd");
};

const isWe = (date) => {
  const d = date.isoWeekday();
  return d === 6 || d === 7;
};

const isSelectedDay = (date, selectedDay) => {
  return date.isSame(selectedDay, "day");
};

const ItineraryCalendar = ({
  connectionData,
  dateIndex,
  onDateIndexUpdate,
}) => {
  const { t, i18n } = useTranslation();
  let selectedDay = dateIndex;
  let days = [];

  if (!connectionData || (!dateIndex && dateIndex !== 0)) {
    return <></>;
  } else {
    days = _.map(connectionData, (con) => moment(con.date));
  }

  const setSelectedDay = (index) => {
    onDateIndexUpdate(index);
  };

  return (
    <div className="tour-detail-itinerary-calendar">
      <div className="tour-detail-itinerary-calendar-selected-day">
        {formatDate(moment(connectionData[selectedDay].date), i18n.language)}
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
              isSelectedDay(dd, moment(connectionData[selectedDay].date))
                ? "tour-detail-itinerary-calendar-grid-selected"
                : "tour-detail-itinerary-calendar-date"
            }`}
            onClick={() => setSelectedDay(index)}
          >
            {dd.date()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryCalendar;
