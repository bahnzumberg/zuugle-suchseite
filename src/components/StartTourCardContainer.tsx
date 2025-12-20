import { CircularProgress, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Key } from "react";
import { useTranslation } from "react-i18next";
import TourCard from "./TourCard";
import { Tour } from "../models/Tour";

const renderImage = (imageSrc: string, key: Key) => (
  <Box
    key={key}
    style={{
      justifyItems: "center",
      display: "grid",
      width: "100%",
    }}
  >
    <img
      src={imageSrc}
      alt="Advertisement"
      className="tour_card_Image"
      loading="lazy"
      width={395} // these help browsers reserve space instantly
      height={335}
    />
  </Box>
);

const renderFourth = (t: (key: string) => string) => (
  <Box
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "10px",
    }}
  >
    <Typography
      style={{
        fontSize: "16px",
        fontWeight: "600",
        padding: "30px 20px",
        borderTop: "1px solid #000",
        maxWidth: "400px",
        boxSizing: "border-box",
      }}
    >
      {t("start.mehr_abenteuer")}
    </Typography>
    <a href="/search" className="cursor-link">
      <Button
        style={{
          border: "2px solid #000",
          color: "#000",
          width: "100%",
          fontSize: "22px",
          fontWeight: "600",
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

  const firstSet = tours.slice(0, 4);
  const secondSet = tours.slice(4, 7);

  return (
    <>
      {tours.length === 0 && isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2} direction="row" sx={{ p: 1 }}>
          {firstSet.map((tour, index) => (
            <Grid display="flex" key={index} size={{ xs: 12, md: 6, lg: 4 }}>
              <TourCard tour={tour} city={city} provider={provider} />
            </Grid>
          ))}
          <Grid display="flex" key={"image"} size={{ xs: 12, md: 6, lg: 4 }}>
            {renderImage("https://cdn.zuugle.at/img/zuugle-ad.gif", "image1")}
          </Grid>
          {secondSet.map((tour, index) => (
            <Grid display="flex" key={index} size={{ xs: 12, md: 6, lg: 4 }}>
              <TourCard tour={tour} city={city} provider={provider} />
            </Grid>
          ))}
          <Grid display="flex" key={"discover"} size={{ xs: 12, md: 6, lg: 4 }}>
            {renderFourth(t)}
          </Grid>
        </Grid>
      )}
    </>
  );
}
