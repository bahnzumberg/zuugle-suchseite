import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { LeftArrow } from "./HorizontalScroll/LeftArrow";
import { RightArrow } from "./HorizontalScroll/RightArrow";
import RangeCard from "./RangeCard";

export default function RangeCardContainer({ onSelectTour, ranges }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  if (isMobile) {
    return (
      <Box>
        <Box
          style={{
            width: "100%",
            overflowX: "scroll",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {(ranges?.length > 0 ? ranges : []).map((range, index) => (
            <Box
              key={index}
              className={"scrolling-card-box"}
              style={{
                display: "block",
                marginRight: "20px",
                verticalAlign: "top",
                marginBottom: "5px",
              }}
            >
              <RangeCard onSelectTour={onSelectTour} range={range} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {(ranges?.length > 0 ? ranges : []).map((range) => (
          <Card
            itemId={range.range}
            range={range}
            key={range.range}
            onSelectTour={onSelectTour}
          />
        ))}
      </ScrollMenu>
    </Box>
  );
}

function Card({ range, onSelectTour }) {
  return (
    <Box
      className={"react-horizontal-scrolling-card"}
      tabIndex={0}
      style={{ marginBottom: "5px", width: "392px", marginRight: "20px" }}
    >
      <RangeCard onSelectTour={onSelectTour} range={range} />
    </Box>
  );
}
