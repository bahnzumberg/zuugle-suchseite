import * as React from 'react';
// import Grid from "@mui/material/Grid";
import TourCard from "./TourCard";
import Box from "@mui/material/Box";
import {ScrollMenu} from "react-horizontal-scrolling-menu";
// import {Button} from "@mui/material";
// import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {LeftArrow} from "./HorizontalScroll/LeftArrow";
import {RightArrow} from "./HorizontalScroll/RightArrow";

export default function ScrollingTourCardContainer({tours, onSelectTour, loadTourConnections, city}){

    const isMobile = useMediaQuery('(max-width:600px)');

    if(!!isMobile){
        return <Box>
            <Box style={{width: "100%", overflowX: "scroll", whiteSpace: "nowrap", display: "flex", alignItems: "stretch"}}>
                {(!!tours ? tours : []).map((tour,index) => <Box key={index} className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                    <TourCard onSelectTour={onSelectTour} tour={tour} loadTourConnections={loadTourConnections} city={city}/>
                </Box>)
            }
            </Box>
        </Box>
    }


    return <Box>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} >
            {
                (!!tours ? tours : []).map(tour => <Card
                    itemId={tour.id}
                    tour={tour}
                    key={tour.id}
                    onSelectTour={onSelectTour}
                    loadTourConnections={loadTourConnections}
                    city={city}
                />)
            }
        </ScrollMenu>
    </Box>
}

function Card({ tour, onSelectTour, loadTourConnections, city }) {
    return (
        <Box
            className={"react-horizontal-scrolling-card"}
            tabIndex={0}
        >
            <TourCard onSelectTour={onSelectTour} tour={tour} loadTourConnections={loadTourConnections} city={city}/>
        </Box>
    );
}

