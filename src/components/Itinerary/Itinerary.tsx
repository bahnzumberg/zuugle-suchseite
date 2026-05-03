import { Tour } from "../../models/Tour";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  useGetCities2TourQuery,
  useGetCitiesQuery,
} from "../../features/apiSlice";
import { t } from "i18next";
import CityList from "../TimeLine/CityList";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import ConnectionSearchForm from "../ConnectionSearch/ConnectionSearchForm";

export interface ItineraryProps {
  tour?: Tour;
  tourId?: string;
}
const Itinerary = ({ tour, tourId }: ItineraryProps) => {
  const { data: cities = [] } = useGetCitiesQuery();
  const { data: cities2tour } = useGetCities2TourQuery(tourId ?? "", {
    skip: !tourId,
  });
  const city = useSelector((state: RootState) => state.search.city);

  return (
    <div className="tour-detail-itinerary-container">
      <div className="tour-detail-itinerary">
        {tour ? (
          <ConnectionSearchForm tour={tour} />
        ) : (
          <>
            <p className="tour-detail-itinerary-header">
              {t("Details.oeffi_fahrplan")}
            </p>
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "16px",
                padding: "20px",
                position: "relative",
                textAlign: "left",
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
                  : t("search.keine_ergebnisse")}
              </Typography>
            </Box>
          </>
        )}
        {tour && tourId && !city && (
          <>
            <Divider sx={{ my: "24px" }} />
            <CityList
              tourId={tourId}
              cities2tour={cities2tour}
              allCities={cities}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
