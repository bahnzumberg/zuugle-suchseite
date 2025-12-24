import ItineraryCalendar from "./ItineraryCalendar";
import ItineraryTourTimeLineContainer from "../TimeLine/ItineraryTourTimeLineContainer";
import { useTranslation } from "react-i18next";
import { Divider, Typography } from "@mui/material";
import { Tour } from "../../models/Tour";
import { ConnectionResult } from "../../models/Connections";

export interface ItineraryProps {
  connectionData: ConnectionResult[] | undefined;
  dateIndex: number;
  updateConnIndex: (index: number) => void;
  tour: Tour | undefined;
  city: string | undefined;
  idOne: string | undefined;
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

  return (
    <div className="tour-detail-itinerary-container">
      <div className="tour-detail-itinerary">
        <p className="tour-detail-itinerary-header">
          {t("Details.oeffi_fahrplan")}
        </p>
        {tour && (tour.valid_tour === 1 || !city) ? (
          <>
            <ItineraryCalendar
              connectionData={connectionData}
              dateIndex={dateIndex}
              updateConnIndex={updateConnIndex}
            />
            <Divider sx={{ my: "24px" }} />
            {(connectionData || !city) && (
              <ItineraryTourTimeLineContainer
                connections={connectionData}
                dateIndex={dateIndex}
                loading={false}
                duration={tour.duration}
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
