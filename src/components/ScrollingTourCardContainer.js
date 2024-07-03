import * as React from "react";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import AdImage from "/app_static/img/zuugle-ad.gif";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

export default function ScrollingTourCardContainer({
  tours,
  onSelectTour,
  loadTourConnections,
  city,
}) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const firstSet = tours.slice(0, 4);
  const secondSet = tours.slice(4, 7);
  console.log("object", tours);

  const renderImage = (imageSrc, key) => (
    <Box
      key={key}
      style={{
        display: "block",
      }}
    >
      <img src={imageSrc} alt="Advertisment" className="tour_card_Image" />
    </Box>
  );

  const renderFourth = () => (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "392px",
        justifyContent: "center",
        marginRight: "20px",
        verticalAlign: "top",
        padding: "0 10px",
        marginBottom: "5px",
      }}
    >
      <Typography
        style={{
          fontSize: "16px",
          fontWeight: "600",
          padding: "30px 10%",
          borderTop: "1px solid #000",
        }}
      >
        {t("start.TextCard1")}
      </Typography>
      <Button
        style={{
          border: "2px solid #000",
          color: "#000",
          width: "100%",
          fontSize: "22px",
          fontWeight: "600",
        }}
      >
        {t("start.TextCard2")}
      </Button>
    </Box>
  );

  return (
    <Box
      component="div"
      style={{
        display: "grid",
        width: "screen",
        gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(3, 1fr)",
        gap: "20px",
      }}
    >
      {firstSet.map((tour) => (
        <Card
          key={tour.id}
          tour={tour}
          onSelectTour={onSelectTour}
          loadTourConnections={loadTourConnections}
          city={city}
        />
      ))}

      {renderImage(AdImage, "image1")}

      {secondSet.map((tour) => (
        <Card
          key={tour.id}
          tour={tour}
          onSelectTour={onSelectTour}
          loadTourConnections={loadTourConnections}
          city={city}
        />
      ))}
      {renderFourth()}
    </Box>
  );
}

function Card({ tour, onSelectTour, loadTourConnections, city }) {
  return (
    <Box
      className={"react-horizontal-scrolling-card"}
      tabIndex={0}
      component="div"
    >
      <TourCard
        onSelectTour={onSelectTour}
        tour={tour}
        loadTourConnections={loadTourConnections}
        city={city}
      />
    </Box>
  );
}
