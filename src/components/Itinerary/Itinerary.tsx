import { Tour } from "../../models/Tour";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import ConnectionSearchForm from "../ConnectionSearch/ConnectionSearchForm";

export interface ItineraryProps {
  tour?: Tour;
  tourId?: string;
  onStopHover?: (coords: { lat: number; lon: number } | null) => void;
}
const Itinerary = ({ tour, tourId: _tourId, onStopHover }: ItineraryProps) => {
  const city = useSelector((state: RootState) => state.search.city);

  return (
    <div className="tour-detail-itinerary-container">
      <div className="tour-detail-itinerary">
        {tour ? (
          <ConnectionSearchForm tour={tour} onStopHover={onStopHover} />
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
      </div>
    </div>
  );
};

export default Itinerary;
