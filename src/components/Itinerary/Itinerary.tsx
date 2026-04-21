import ItineraryCalendar from "./ItineraryCalendar";
import ItineraryTourTimeLineContainer from "../TimeLine/ItineraryTourTimeLineContainer";
import { Tour } from "../../models/Tour";
import { ConnectionResult } from "../../models/Connections";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  useGetCities2TourQuery,
  useGetCitiesQuery,
} from "../../features/apiSlice";
import { t } from "i18next";
import CityList from "../TimeLine/CityList";
import { useSelector } from "react-redux";
import { RootState } from "../..";

export interface ItineraryProps {
  connectionData: ConnectionResult[] | undefined;
  dateIndex: number;
  updateConnIndex: (index: number) => void;
  tour?: Tour;
  tourId?: string;
}
const Itinerary = ({
  connectionData,
  dateIndex,
  updateConnIndex,
  tour,
  tourId,
}: ItineraryProps) => {
  const { data: cities = [] } = useGetCitiesQuery();
  const { data: cities2tour } = useGetCities2TourQuery(tourId ?? "", {
    skip: !tourId,
  });
  const city = useSelector((state: RootState) => state.search.city);

  const isTourReachable = cities2tour?.some(
    (c) => c.city_slug === city?.value && c.reachable === 1,
  );

  return (
    <div className="tour-detail-itinerary-container">
      <div className="tour-detail-itinerary">
        <p className="tour-detail-itinerary-header">
          {t("Details.oeffi_fahrplan")}
        </p>

        {city && isTourReachable ? (
          <ItineraryCalendar
            connectionData={connectionData}
            dateIndex={dateIndex}
            updateConnIndex={updateConnIndex}
          />
        ) : (
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#101010",
                lineHeight: "20px",
              }}
            >
              {!city
                ? t("details.bitte_stadt_waehlen")
                : city && !isTourReachable
                  ? t("details.keine_verbindungen_stadt_7_tage", {
                      city: city.label,
                    })
                  : t("search.keine_ergebnisse")}
            </Typography>
          </Box>
        )}
        {tour && tourId && (
          <>
            <Divider sx={{ my: "24px" }} />
            {city && isTourReachable ? (
              <ItineraryTourTimeLineContainer
                connections={connectionData}
                dateIndex={dateIndex}
                tour={tour}
              />
            ) : (
              <CityList
                tourId={tourId}
                cities2tour={cities2tour}
                allCities={cities}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
