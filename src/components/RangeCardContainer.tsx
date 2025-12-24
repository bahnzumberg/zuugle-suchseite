import Box from "@mui/material/Box";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { LeftArrow } from "./HorizontalScroll/LeftArrow";
import { RightArrow } from "./HorizontalScroll/RightArrow";
import RangeCard from "./RangeCard";
import { RangeObject } from "../features/apiSlice";
import { useIsMobile } from "../utils/globals";
import { Link } from "react-router";

export interface RangeCardContainerProps {
  ranges: RangeObject[];
}

export default function RangeCardContainer({
  ranges,
}: RangeCardContainerProps) {
  const isMobile = useIsMobile();

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
              <Link to={`/search/?range=${range.range}`}>
                <RangeCard range={range} />
              </Link>
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
          <Link to={`/search/?range=${range.range}`} key={range.range}>
            <Card range={range} />
          </Link>
        ))}
      </ScrollMenu>
    </Box>
  );
}

function Card({ range }: { range: RangeObject }) {
  return (
    <Box
      className={"react-horizontal-scrolling-card"}
      tabIndex={0}
      style={{ marginBottom: "5px", width: "392px", marginRight: "20px" }}
    >
      <RangeCard range={range} />
    </Box>
  );
}
