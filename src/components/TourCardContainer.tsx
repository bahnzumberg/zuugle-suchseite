import * as React from "react";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Tour } from "../models/Tour";
import { RootState } from "..";
import { useSelector } from "react-redux";

export interface TourCardContainerProps {
  tours: Tour[];
  hasMore: boolean;
  isMoreToursLoading: boolean;
  pageTours: number;
  setPageTours: (pageTours: number) => void;
}

/**
 * TourCardContainer subscribes to changes in filter. Updates displayed tours whenever the filter changes.
 */
export default function TourCardContainer({
  tours,
  hasMore,
  isMoreToursLoading,
  pageTours,
  setPageTours,
}: TourCardContainerProps) {
  const [searchParams] = useSearchParams();

  const city = useSelector((state: RootState) => state.search.city);
  // TODO: decide how to handle searchParams and redux state combination
  // const range = searchParams.get("range");
  // const state = searchParams.get("state");
  // const country = searchParams.get("country");
  // const type = searchParams.get("type");
  // const map = searchParams.get("map");
  const provider = searchParams.get("p");

  return (
    <Box>
      {
        <InfiniteScroll
          dataLength={tours.length}
          next={() => setPageTours(pageTours + 1)}
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
