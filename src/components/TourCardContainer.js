import * as React from 'react';
import {useState, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import {useSearchParams} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
// import {Typography} from "@mui/material";
import EndOfList from './EndOfList';

export default function TourCardContainer({tours, onSelectTour, loadTourConnections, city, loadTours, totalTours, pageTours, loading, total, filterValues}){

    console.log("L16: TourCardContainer incoming totalTours :",totalTours);
    // console.log("L17: initialTotalTours :",total);
    // console.log("L18: tours :",tours);
    // console.log("L19: =>    initialTotalTours :",initialTotalTours);
    console.log("#############################################")
    console.log("L15: received pageTours :",pageTours);

    const [searchParams, setSearchParams] = useSearchParams();
    const [hasMore, setHasMore] = useState(true);

    // useEffect(() => {
    // //   _loadTours();
    // //   _loadTours();
    
    // }, [])
    

    // console.log("L31 filterFromFilter :",filterFromFilter)
    const _loadTours = () => {
        let city = searchParams.get('city');
        let range = searchParams.get('range');
        let state = searchParams.get('state');
        let country = searchParams.get('country');
        let type = searchParams.get('type');
        let search = searchParams.get('search');
        // let filter = filterFromFilter ? filterFromFilter : searchParams.get('filter');
        let filter = searchParams.get('filter');
        let sort = searchParams.get('sort');
        let map = searchParams.get('map');
        let provider = searchParams.get('p');

        //desc
        //this code parses a JSON string stored in the filter variable, adds a new property ignore_filter with a value of true to the parsed object, and then converts the modified object back into a JSON string. The end result is that the filter variable is updated with the modified JSON string containing the ignore_filter property.
        if(!!filter){
            let filterParsed = JSON.parse(filter);
            // console.log(" L48 : filterParsed :",filterParsed)
            filterParsed.ignore_filter = false;
            // filterParsed.ignore_filter = true;
            filter = JSON.stringify(filterParsed);
        }
        console.log("L50: hasMore", hasMore) ; 
       
      
        // clgs for values passed to loadours()
        // console.log("L57/1 city:", city);  //Graz
        // console.log("L57/1 range:", range);  //null
        // console.log("L57/1 state:", state);  //null
        // console.log("L57/1 country:", country);  //null
        // console.log("L57/1 type:", type);  //null
        // console.log("L57/1 search:", search);  //Schnee
        // console.log("L57/1 filter:", JSON.parse(filter)); // actual filter
        // console.log("L57/1 sort:", sort);  //null
        // console.log("L57/1 map:", map);  //null
        // console.log("L57/1 provider:", provider);  //null
        // console.log("L57/1 page:", !!pageTours ? (Number(pageTours) + 1) : 2); // 2

        loadTours({
            city: city,
            range: range,
            state: state,
            country: country,
            type: type,
            search: search,
            filter: !!filterValues ? filterValues : filter,  // get this from Filter.js (through Search and Main)
            sort: sort,
            map: map,
            provider: provider,
            page: !!pageTours ? (Number(pageTours) + 1) : 2
        }).then((res) => {
            // console.log("results :",(res));
            let retrievedTours = res.data.tours;
            if(retrievedTours.length === 0 || retrievedTours.length < 9){
                setHasMore(false);
            }
        });

    }
    // {console.log("L76: hasMore", hasMore)} ; 

    return <Box>
            <InfiniteScroll
                dataLength={tours.length}
                next={_loadTours}
                hasMore={hasMore}
                // hasMore={tours.length < totalTours}
                // hasMore={!!!(tours.length === initialTotalTours)}
                loader={!!loading && <CircularProgress />}
                endMessage={<EndOfList />}
            >
                {/* {console.log("L85: hasMore", hasMore)} ;  */}
                {/* {console.log("L63: !(tours.length === initialTotalTours)", !(tours.length === initialTotalTours))} ;  */}
                {/* {console.log("L64: TourCardContainer/ tours.length", tours.length)} ;  */}
                {/* 9, 18,27,...                 */}
                {/* {console.log("L65: TourCardContainer/ totalTours", totalTours)} */}
                 {/* 325, 497, should not refresh the main and give us back same total as in first main render  */}
                 {/* is the call (_loadTours) not working properly or is it only the totalTours that should be controlled?  */}

                 {/* {console.log("L77: =>    initialTotalTours :",initialTotalTours)} */}
                {console.log("#############################################")}
                {/* {console.log("L67: TourCardContainer/ tours[0]", tours[0])} */}
                <Grid container spacing={2}>
                    {
                        (!!tours ? tours : []).filter(tour => !!!tour.is_map_entry).map((tour,index) => <Grid key={index} item xs={12} sm={6} lg={4} style={{marginBottom: "5px"}}>
                            <TourCard onSelectTour={onSelectTour} tour={tour} loadTourConnections={loadTourConnections} city={city}/>
                        </Grid>)
                    }
                </Grid>
            </InfiniteScroll>
    </Box>
}
