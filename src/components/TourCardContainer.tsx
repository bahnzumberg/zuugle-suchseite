import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import TourCard, { Tour } from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export interface TourCardContainerProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadTours: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageTours: any;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterValues: any;
  markersChanged: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapBounds: any;
}

export default function TourCardContainer({
  tours,
  onSelectTour,
  loadTours,
  pageTours,
  loading,
  filterValues,
  markersChanged,
  mapBounds,
}: TourCardContainerProps) {
  const [searchParams] = useSearchParams();
  const [hasMore] = useState(true);

  const filterRef = useRef(
    localStorage.getItem("filterValues")
      ? localStorage.getItem("filterValues")
      : {},
  );

  //let pageMapTours ; // when map is set the page variable should remain 1 so we dont get offset

  const city = searchParams.get("city");
  const range = searchParams.get("range");
  const state = searchParams.get("state");
  const country = searchParams.get("country");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const map = searchParams.get("map");
  const provider = searchParams.get("p");

  useEffect(() => {
    if (!!hasMore && !!filterValues) {
      filterRef.current = filterValues
        ? filterValues
        : !!searchParams && searchParams.get("filter");
    } else if (!hasMore || !filterValues) {
      filterRef.current = !!searchParams && searchParams.get("filter");
    }
  }, [hasMore, filterValues, searchParams]);

  useEffect(() => {
    const bounds = mapBounds ? JSON.stringify(mapBounds) : "";
    if (mapBounds && markersChanged) {
      loadTours({
        city: city,
        range: range,
        state: state,
        country: country,
        type: type,
        search: search,
        filter: filterRef.current,
        map: map,
        provider: provider,
        bounds: bounds, // bounds added
      });
    }
  }, [mapBounds]);

  const _loadTours = async () => {
    //code below parses a JSON string stored in the filter variable, adds a new property ignore_filter with a value of true to the parsed object, and then converts the modified object back into a JSON string.
    // _filter = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {};
    filterRef.current = localStorage.getItem("filterValues")
      ? localStorage.getItem("filterValues")
      : {};
    // add bounds from mapBounds state to call parameters
    const bounds = mapBounds ? JSON.stringify(mapBounds) : "";

    await loadTours({
      city: city,
      range: range,
      state: state,
      country: country,
      type: type,
      search: search,
      filter: filterRef.current,
      map: map,
      provider: provider,
      page: pageTours ? Number(pageTours) + 1 : 2,
      bounds: bounds, // bounds added
    });
    // .then((res) => {
    // let retrievedTours = res?.data?.tours ? res.data.tours : [];
    // console.log("L100 retrievedTours[0]", retrievedTours[0])
    // });
  };

  return (
    <Box>
      {
        <InfiniteScroll
          dataLength={tours.length}
          next={_loadTours}
          hasMore={true}
          loader={!!loading && <CircularProgress />}
          endMessage={<p> </p>}
        >
          <Grid container spacing={2} direction="row" sx={{ p: 1 }}>
            {tours.map((tour, index) => (
              <Grid display="flex" key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                <TourCard
                  onSelectTour={onSelectTour}
                  tour={tour}
                  city={city}
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
