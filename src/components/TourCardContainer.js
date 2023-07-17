import * as React from 'react';
import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import {useSearchParams} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {Typography} from "@mui/material";

export default function TourCardContainer({tours, onSelectTour, loadTourConnections, city, loadTours, totalTours, pageTours, loading, total}){

    // console.log("L12: received totalTours :",totalTours);
    // console.log("L13: received total :",total);
    // console.log("L14: received tours.length :",tours.length);

    const [searchParams, setSearchParams] = useSearchParams();

    const _loadTours = () => {
        let city = searchParams.get('city');
        let range = searchParams.get('range');
        let state = searchParams.get('state');
        let country = searchParams.get('country');
        let type = searchParams.get('type');
        let search = searchParams.get('search');
        let filter = searchParams.get('filter');
        let sort = searchParams.get('sort');
        let map = searchParams.get('map');
        let provider = searchParams.get('p');

  
        if(!!filter){
            let filterParsed = JSON.parse(filter);
            filterParsed.ignore_filter = true;
            filter = JSON.stringify(filterParsed);
            console.log("L35 filter inside If statement TourCardContainer: ");
            console.log(filter);
        }

        loadTours({
            city: city,
            range: range,
            state: state,
            country: country,
            type: type,
            search: search,
            filter: filter,
            sort: sort,
            map: map,
            provider: provider,
            page: !!pageTours ? (Number(pageTours) + 1) : 2
        })
    }

    return <Box>
            <Typography sx={{textAlign: "left", marginBottom: "15px"}} className={"result-text-mobile"}>
                {total} {total == 1 ? 'Ergebnis' : 'Ergebnisse'}
            </Typography>
            <InfiniteScroll
                dataLength={tours.length}
                next={_loadTours}
                hasMore={!!!(tours.length === totalTours)}
                loader={!!loading && <CircularProgress />}
            >
                {/* {console.log("L64: TourCardContainer/ tours.length", tours.length)}                
                {console.log("L65: TourCardContainer/ totalTours", totalTours)}
                {console.log("L66: TourCardContainer/ onSelectTour ", onSelectTour )}
                {console.log("L67: TourCardContainer/ tours[0]", tours[0])} */}
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
