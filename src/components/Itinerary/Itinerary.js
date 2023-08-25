import React from "react";
import ItineraryCalendar from "./ItineraryCalendar";
import ItineraryTourTimeLineContainer from "../TimeLine/ItineraryTourTimeLineContainer";
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";

const Itinerary = ({ connectionData, dateIndex, onDateIndexUpdate, tour }) => {
  const tourDuration = !!tour && !!tour.duration ? tour.duration : undefined;
  // tourDuration ? console.log("duration : " + tourDuration) : console.log("duration is falsy");

  const { t } = useTranslation();

  return (
    <div className="tour-detail-itinerary-container">
      <div className="tour-detail-itinerary">
        <p className="tour-detail-itinerary-header">
          {t("Details.oeffi_fahrplan")}
        </p>
        <ItineraryCalendar
          connectionData={connectionData}
          dateIndex={dateIndex}
          onDateIndexUpdate={onDateIndexUpdate}
        ></ItineraryCalendar>
        <Divider sx={{ my: "24px" }} />
        {!!connectionData && (
          <ItineraryTourTimeLineContainer
            connections={connectionData[dateIndex]}
            loading={false}
            duration={tourDuration}
          />
        )}
      </div>
    </div>
  );
};

export default Itinerary;
