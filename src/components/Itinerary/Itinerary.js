import React from "react";
import ItineraryCalendar from "./ItineraryCalendar";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TourTimeLineContainer from "../TimeLine/TourTimeLineContainer";
import Box from "@mui/material/Box";
import TourReturnTimeLineContainer from "../TimeLine/TourReturnTimeLineContainer";
import ItineraryTourTimeLineContainer from "../TimeLine/ItineraryTourTimeLineContainer";
const Itinerary = ({connectionData, dateIndex, onDateIndexUpdate}) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange =
        (panel) => (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false);
        };
    return <div className='tour-detail-itinerary-container'>
        <div className='tour-detail-itinerary'>
            <span className='tour-detail-itinerary-header'>Öffi-Fahrplan</span>
            <ItineraryCalendar connectionData={connectionData} dateIndex={dateIndex} onDateIndexUpdate={onDateIndexUpdate}></ItineraryCalendar>
            {/*<Accordion>*/}
            {/*    <AccordionSummary*/}
            {/*        expandIcon={<ExpandMoreIcon />}*/}
            {/*        aria-controls="panel1bh-content"*/}
            {/*        id="panel1bh-header"*/}
            {/*    >*/}
            {/*        <Typography sx={{ width: '33%', flexShrink: 0 }}>*/}
            {/*            General settings*/}
            {/*        </Typography>*/}
            {/*        <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>*/}
            {/*    </AccordionSummary>*/}
            {/*    <AccordionDetails>*/}
            {/*        <Typography>*/}
            {/*            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.*/}
            {/*            Aliquam eget maximus est, id dignissim quam.*/}
            {/*        </Typography>*/}
            {/*    </AccordionDetails>*/}
            {/*</Accordion>*/}
            {!!connectionData && <ItineraryTourTimeLineContainer connections={connectionData[dateIndex]} loading={false}/>}

        </div>
    </div>;
};

export default Itinerary;
