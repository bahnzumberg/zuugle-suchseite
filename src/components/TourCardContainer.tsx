import * as React from "react";
import Grid from "@mui/material/Grid";
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
  isMoreToursLoading: boolean;
  fetchMore: () => void;
}

/**
 * TourCardContainer subscribes to changes in filter. Updates displayed tours whenever the filter changes.
 */
export default function TourCardContainer({
  tours,
  hasMore,
  isMoreToursLoading,
  fetchMore,
}: TourCardContainerProps) {
  const city = useSelector((state: RootState) => state.search.city);
  const provider = useSelector((state: RootState) => state.search.provider);

  useEffect(() => {
    function needsMoreContent() {
      return document.documentElement.scrollHeight <= window.innerHeight;
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
          loader={isMoreToursLoading && <CircularProgress />}
          endMessage={<p> </p>}
        >
          <Grid container spacing={2} direction="row" sx={{ p: 1 }}>
            {tours.map((tour, index) => (
              <Grid display="flex" key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                <TourCard
                  tour={tour}
                  city={city?.value || null}
                  provider={provider}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      }
    </Box>
  );
}
