import React from "react";
// import { useEffect } from "react";
import ItineraryCalendar from "./ItineraryCalendar";
import ItineraryTourTimeLineContainer from "../TimeLine/ItineraryTourTimeLineContainer";
import { useTranslation } from "react-i18next";
import { Divider, Typography } from "@mui/material";
import { Tour } from "../../models/Tour";

export interface ItineraryProps {
  connectionData: any;
  dateIndex: any;
  updateConnIndex: any;
  tour: Tour | undefined;
  city: any;
  idOne: any;
}
const Itinerary = ({
  connectionData,
  dateIndex,
  updateConnIndex,
  tour,
  city,
  idOne,
}: ItineraryProps) => {
  const { t } = useTranslation();

  const tourDuration = !!tour && !!tour.duration ? tour.duration : undefined;

  return (
    <div className="tour-detail-itinerary-container">
      <div className="tour-detail-itinerary">
        <p className="tour-detail-itinerary-header">
          {t("Details.oeffi_fahrplan")}
        </p>
        {tour?.valid_tour === 1 ? (
          <>
            <ItineraryCalendar
              connectionData={connectionData}
              dateIndex={dateIndex}
              updateConnIndex={updateConnIndex}
            />
            <Divider sx={{ my: "24px" }} />
            {(!!connectionData || city === "no-city") && (
              <ItineraryTourTimeLineContainer
                connections={connectionData}
                dateIndex={dateIndex}
                loading={false}
                duration={tourDuration}
                tour={tour}
                city={city}
                idOne={idOne}
              />
            )}
          </>
        ) : (
          <Typography variant={"infoKey"}>
            {t("Details.oeffi_fahrplan_inactive_tour")}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
