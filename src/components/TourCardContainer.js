import * as React from 'react';
import {useState, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import {useSearchParams} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import EndOfList from './EndOfList';

export default function TourCardContainer({
  tours,
  onSelectTour,
  loadTourConnections,
  city,
  loadTours,
  totalTours,
  pageTours,
  loading,
  total,
  filterValues,
  setFilterValues,
}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  
  let _filter = localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {} ;
  useEffect(() => {
    _loadTours();
  }, [!!localStorage.getItem("filterValues")])

  useEffect(() => {
    if(!!hasMore && !!filterValues){
        _filter = filterValues ? filterValues : searchParams.get("filter");
    } else if(!!!hasMore || !!!filterValues){
        _filter = searchParams.get("filter");
    }
  }, [hasMore])


  
  const _loadTours = async () => {
    if(process.env.NODE_ENV != "production"){
      // console.log("L67 ====//////   filterValues :", filterValues);
      // console.log("L68 ====//////   filterValues :", _filter);
    }
    let city = searchParams.get("city");
    let range = searchParams.get("range");
    let state = searchParams.get("state");
    let country = searchParams.get("country");
    let type = searchParams.get("type");
    let search = searchParams.get("search");
    let filter = _filter;
    let sort = searchParams.get("sort");
    let map = searchParams.get("map");
    let provider = searchParams.get("p");

    //code below parses a JSON string stored in the filter variable, adds a new property ignore_filter with a value of true to the parsed object, and then converts the modified object back into a JSON string. 
    _filter = !!localStorage.getItem("filterValues") ? localStorage.getItem("filterValues") : {};
   
    await loadTours({
      city: city,
      range: range,
      state: state,
      country: country,
      type: type,
      search: search,
      filter: _filter,
    //   filter: filter,
      sort: sort,
      map: map,
      provider: provider,
      page: !!pageTours ? Number(pageTours) + 1 : 2,
    }).then((res) => {
      if(process.env.NODE_ENV != "production"){
        // console.log("L116 >>>> results :",(res));
      }
      let retrievedTours = res.data.tours;
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
                />
              </Grid>
            ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
}
