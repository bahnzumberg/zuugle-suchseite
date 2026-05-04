import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import { Tour } from "../models/Tour";
import { RootState } from "..";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export interface TourCardContainerProps {
  tours: Tour[];
  hasMore: boolean;
  fetchMore: () => void;
}

/**
 * TourCardContainer subscribes to changes in filter. Updates displayed tours whenever the filter changes.
 */
export default function TourCardContainer({
  tours,
  hasMore,
  fetchMore,
}: TourCardContainerProps) {
  const city = useSelector((state: RootState) => state.search.city);
  const provider = useSelector((state: RootState) => state.search.provider);
  const LOADER_HEIGHT = 40;

  useEffect(() => {
    function needsMoreContent() {
      return (
        document.documentElement.scrollHeight - (LOADER_HEIGHT + 10) <=
        window.innerHeight
      );
    }
    if (needsMoreContent() && hasMore) {
      fetchMore();
    }
  }, [tours]);

  return (
    <Box>
      {
        <InfiniteScroll
          dataLength={tours.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<CircularProgress size={LOADER_HEIGHT} />}
          endMessage={<p> </p>}
          style={{ overflow: "hidden" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "1fr 1fr 1fr",
              },
              gap: "30px",
            }}
          >
            {tours.map((tour, index) => (
              <Box key={index} sx={{ display: "flex", minWidth: 0 }}>
                <TourCard
                  tour={tour}
                  city={city?.value || null}
                  provider={provider}
                />
              </Box>
            ))}
          </Box>
        </InfiniteScroll>
      }
    </Box>
  );
}
