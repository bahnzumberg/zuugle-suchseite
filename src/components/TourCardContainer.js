import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import {useSearchParams} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import EndOfList from './EndOfList';
// import {consoleLog} from '../utils/globals';

export default function TourCardContainer({
  tours,
  onSelectTour,
  loadTourConnections,
  city,
  loadTours,
  pageTours,
  loading,
  filterValues,
  setFilterValues,
  showMap,
  markersChanged,
  mapBounds,
}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  
  let filterRef = useRef(localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {});

  let pageMapTours ; // when map is set the page variable should remain 1 so we dont get offset

  useEffect(() => {
    if(!!hasMore && !!filterValues){
        filterRef.current = filterValues ? filterValues : (!!searchParams && searchParams.get("filter"));
    } else if(!!!hasMore || !!!filterValues){
        filterRef.current = !!searchParams && searchParams.get('filter');
    }
  }, [hasMore,filterValues,searchParams])

  useEffect(() => {
    console.log("L40 markersChanged :", markersChanged);
    if (markersChanged && mapBounds) {
        console.log("L44 just before loadTours , mapBounds : ", mapBounds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pageMapTours = 1 ;
        _loadTours();
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [markersChanged, mapBounds]);

  
  const _loadTours = async () => {
      // consoleLog("L67 ====//////   filterValues :", filterValues);
      // consoleLog("L68 ====//////   filterValues :", _filter);
    let city = searchParams.get("city");
    let range = searchParams.get("range");
    let state = searchParams.get("state");
    let country = searchParams.get("country");
    let type = searchParams.get("type");
    let search = searchParams.get("search");
    let sort = searchParams.get("sort");
    let map = searchParams.get("map");
    let provider = searchParams.get("p");
    // let filter = searchParams.get("filter");

    //code below parses a JSON string stored in the filter variable, adds a new property ignore_filter with a value of true to the parsed object, and then converts the modified object back into a JSON string. 
    // _filter = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {};
    filterRef.current = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {};
    // add bounds from mapBounds state to call parameters
    let bounds = mapBounds ? JSON.stringify(mapBounds) : '';
    console.log("L72 : bounds :", bounds)
  
    // console.log("L70 bounds inside TCC :", bounds)
   
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
      page: pageMapTours ? 1 : !!pageTours ? Number(pageTours) + 1 : 2,
      bounds:bounds   // bounds added
       

    }).then((res) => {
      // consoleLog("L116 >>>> results :",(res));
      // let markers = res.data.mLis
      let retrievedTours = res?.data?.tours ? res.data.tours : [];
      if (retrievedTours.length === 0 || retrievedTours.length < 9) {
        setHasMore(false);        
      }
    });
  };

  return (
    <Box>
      <InfiniteScroll
        dataLength={tours.length}
        next={_loadTours}
        hasMore={hasMore}
        loader={!!loading && <CircularProgress />}
        endMessage={<EndOfList />}
      >
      
        <Grid container spacing={2}>
          {(!!tours ? tours : [])
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
            ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
}
