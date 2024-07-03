import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import EndOfList from "./EndOfList";
import { consoleLog } from "../utils/globals";
import Image5 from "../../public/img/Card5.gif";

export default function TourCardContainer({
  tours,
  onSelectTour,
  loadTourConnections,
  // city,
  loadTours,
  pageTours,
  loading,
  filterValues,
  setFilterValues,
  showMap,
  markersChanged,
  mapBounds,
}) {
  // console.log("L71 TCC >>>> pageTours :", pageTours)
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
      // console.log("L40 markersChanged :", markersChanged);
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
      }).then((res) => {
        // console.log("L71 TCC >>>> loadTours / useEffect , hasMore :", hasMore)
        consoleLog("L74 TCC >>>> loadTours / useEffect , res.data :", res.data);
        // let retrievedTours = res?.data?.tours ? res.data.tours : [];
        consoleLog(
          "L75 TCC >>>> loadTours / useEffect , res.data.total :",
          res.data.total
        );

        // if (res.data.total === 0 || res.data.total < 9) {
        //   console.log("L80 TCC >>>> loadTours:", res.data.total)
        //   setHasMore(false);
        // }
        // console.log("L76 TCC >>>> loadTours / useEffect , hasMore :", hasMore)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBounds]);

const _loadTours = async () => {
    // console.log("L86 >>>>: inisde _loadTours/ hasMore :", hasMore)

    // consoleLog("L67 ====//////   filterValues :", filterValues);
    // consoleLog("L68 ====//////   filterValues :", _filter);
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
      // page: pageMapTours ? 1 : !!pageTours ? Number(pageTours) + 1 : 2,
      bounds: bounds, // bounds added
    }).then((res) => {
      let retrievedTours = res?.data?.tours ? res.data.tours : [];
      // consoleLog("L113 >>>> results length :", retrievedTours.length);
      !!retrievedTours &&
        consoleLog("L114 >>>> results total :", retrievedTours.total);
      consoleLog("L115 >>>> _loadTours : retrievedTours", retrievedTours);
      // if (retrievedTours.length === 0 || retrievedTours.length < 9) {
      //   setHasMore(false);
      // }
    });
  };

  const renderImage = () => (
    <Grid item xs={12} style={{ textAlign: "center", marginBottom: "5px" }}>
      <img
        src={Image5}
        alt="Promotional"
        style={{ width: "auto", borderRadius: "25px", maxWidth: "392px" }}
      />
    </Grid>
  );

  return (
    <Box>
      <InfiniteScroll
        dataLength={tours.length}
        next={_loadTours}
        hasMore={true}
        // hasMore={hasMore}
        loader={!!loading && <CircularProgress />}
        endMessage={<EndOfList />}
      >
        <Grid container spacing={2}>
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

          {/* {(!!tours ? tours : [])
            .filter((tour) => !!!tour.is_map_entry)
            .map((tour, index) => (
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
            ))} */}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
}
