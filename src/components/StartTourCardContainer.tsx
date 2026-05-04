import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import TourCard from "./TourCard";
import { Tour } from "../models/Tour";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const gridItemStyles = {
  display: "flex",
};

const renderCTA = (t: (key: string) => string) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap",
      width: "100%",
      pt: "30px",
      pb: "10px",
    }}
  >
    <Typography
      sx={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#254980",
      }}
    >
      {t("start.mehr_abenteuer")}
    </Typography>
    <a
      href="/search"
      className="cursor-link"
      style={{ textDecoration: "none" }}
    >
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{
          backgroundColor: "var(--bzb-lindgruen)",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "16px",
          borderRadius: "12px",
          padding: "10px 28px",
          textTransform: "none",
          boxShadow: "0 2px 8px rgba(37,73,128,0.15)",
          "&:hover": {
            backgroundColor: "#bece8f",
            boxShadow: "0 4px 16px rgba(37,73,128,0.25)",
          },
        }}
      >
        {t("start.mehr_anzeigen")}
      </Button>
    </a>
  </Box>
);

export interface StartTourCardContainerProps {
  tours: Tour[];
  city: string;
  isLoading: boolean;
  provider: string | null;
}

export default function StartTourCardContainer({
  tours,
  city,
  isLoading,
  provider,
}: StartTourCardContainerProps) {
  const { t } = useTranslation();

  // Show max 6 tours + 1 CTA
  const displayTours = tours.slice(0, 6);

  return (
    <>
      {tours.length === 0 && isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2} direction="row">
            {displayTours.map((tour, index) => (
              <Grid
                key={index}
                size={{ xs: 12, md: 6, lg: 4 }}
                sx={gridItemStyles}
              >
                <TourCard tour={tour} city={city} provider={provider} />
              </Grid>
            ))}
          </Grid>
          {renderCTA(t)}
        </>
      )}
    </>
  );
}
