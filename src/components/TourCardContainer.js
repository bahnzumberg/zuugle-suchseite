import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function TourCardContainer({
  tours,
  onSelectTour,
  loadTourConnections,
  loadTours,
  pageTours,
  loading,
  filterValues,
  markersChanged,
  mapBounds,
  isMobile
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);

  let filterRef = useRef(
    localStorage.getItem("filterValues")
      ? localStorage.getItem("filterValues")
      : {}
  );

  //let pageMapTours ; // when map is set the page variable should remain 1 so we dont get offset

  let city = searchParams.get("city");
  let range = searchParams.get("range");
  let state = searchParams.get("state");
  let country = searchParams.get("country");
  let type = searchParams.get("type");
  let search = searchParams.get("search");
  let sort = searchParams.get("sort");
  let map = searchParams.get("map");
  let provider = searchParams.get("p");
  
  

  useEffect(() => {
    if (!!hasMore && !!filterValues) {
      filterRef.current = filterValues
        ? filterValues
        : !!searchParams && searchParams.get("filter");
    } else if (!!!hasMore || !!!filterValues) {
      filterRef.current = !!searchParams && searchParams.get("filter");
    }
  }, [hasMore, filterValues, searchParams]);

  useEffect(() => {
      let bounds = mapBounds ? JSON.stringify(mapBounds) : '';
      if (mapBounds && markersChanged) {

      // eslint-disable-next-line react-hooks/exhaustive-deps
      loadTours({
        city: city,
        range: range,
        state: state,
        country: country,
        type: type,
        search: search,
        filter: filterRef.current,
        sort: sort,
        map: map,
        provider: provider,
        bounds: bounds, // bounds added
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBounds]);

  const _loadTours = async () => {
    //code below parses a JSON string stored in the filter variable, adds a new property ignore_filter with a value of true to the parsed object, and then converts the modified object back into a JSON string.
    // _filter = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {};
    filterRef.current = !!localStorage.getItem("filterValues")
      ? localStorage.getItem("filterValues")
      : {};
    // add bounds from mapBounds state to call parameters
    let bounds = mapBounds ? JSON.stringify(mapBounds) : "";

    await loadTours({
      city: city,
      range: range,
      state: state,
      country: country,
      type: type,
      search: search,
      filter: filterRef.current,
      sort: sort,
      map: map,
      provider: provider,
      page: !!pageTours ? Number(pageTours) + 1 : 2,
      bounds: bounds, // bounds added
    }).then((res) => {
      let retrievedTours = res?.data?.tours ? res.data.tours : [];
    });
  };

  return (
    <Box>
      <InfiniteScroll
        dataLength={tours.length}
        next={_loadTours}
        hasMore={true}
        loader={!!loading && <CircularProgress />}
        endMessage={<p> </p>}
      >
        <Grid container spacing={2} style={{  marginLeft: `${!isMobile ? '35px' : null}` }}>
          {tours.map((tour, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              lg={4}
              style={{ marginBottom: "5px" }}
            >
              <TourCard
                onSelectTour={onSelectTour}
                tour={tour}
                loadTourConnections={loadTourConnections}
                city={city}
                mapCard={false}
              />
            </Grid>
          ))}

        </Grid>
      </InfiniteScroll>
    </Box>
  );
}
