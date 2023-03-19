import * as React from 'react';
import RangeCard from "./RangeCard";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import {ScrollMenu} from "react-horizontal-scrolling-menu";
import {LeftArrow} from "./HorizontalScroll/LeftArrow";
import {RightArrow} from "./HorizontalScroll/RightArrow";

//description
//he RangeCardContainer component is responsible for rendering a container that displays a collection of RangeCard components. The container is designed to be responsive to the device screen size, displaying the RangeCard components in a horizontal scroll menu on larger screens, and as a vertical scrollable list on smaller screens. It uses the ScrollMenu component from the react-horizontal-scrolling-menu library to create the horizontal scroll menu, and the Box component from the @mui/material library to create the vertical scrollable list. It also includes LeftArrow and RightArrow components for the horizontal scroll menu navigation, and a useMediaQuery hook to determine the screen size and adjust the display accordingly. The RangeCard components are passed as props to the RangeCardContainer component and are mapped over to render a collection of RangeCard components with onSelectTour function as a prop.
export default function RangeCardContainer({onSelectTour, ranges}){

    const isMobile = useMediaQuery('(max-width:600px)');

    if(!!isMobile){
        return <Box>
            <Box style={{width: "100%", overflowX: "scroll", whiteSpace: "nowrap", display: "flex", alignItems: "stretch"}}>
                {
                    (!!ranges && ranges.length > 0 ? ranges : []).map((range,index) => <Box key={index} className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                            <RangeCard onSelectTour={onSelectTour} range={range}/>
                        </Box>
                    )
                }
            </Box>
        </Box>
    }

    return <Box>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} >
            {
                (!!ranges && ranges.length > 0 ? ranges : []).map(range => <Card
                    itemId={range.range}
                    range={range}
                    key={range.range}
                    onSelectTour={onSelectTour}
                />)
            }
        </ScrollMenu>
    </Box>
}

function Card({ range, onSelectTour }) {
    return (
        <Box
            className={"react-horizontal-scrolling-card"}
            tabIndex={0}
            style={{marginBottom: "5px"}}
        >
            <RangeCard onSelectTour={onSelectTour} range={range}/>
        </Box>
    );
}


