import React from "react";
import ItineraryCalendar from "./ItineraryCalendar";
const Itinerary = ({connectionData, dateIndex, onDateIndexUpdate}) => {
    console.log('WOOOOOOOOOOOOO', connectionData, dateIndex, onDateIndexUpdate);
    return <div className='tour-detail-itinerary-container'>
        <div className='tour-detail-itinerary'>
            <span className='tour-detail-itinerary-header'>Öffi-Fahrplan</span>
            <ItineraryCalendar connectionData={connectionData} dateIndex={dateIndex} onDateIndexUpdate={onDateIndexUpdate}></ItineraryCalendar>
        </div>
    </div>;
};

export default Itinerary;