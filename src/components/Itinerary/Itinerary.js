import React from "react";
import ItineraryCalendar from "./ItineraryCalendar";
import ItineraryTourTimeLineContainer from "../TimeLine/ItineraryTourTimeLineContainer";
import {useTranslation} from 'react-i18next';

const Itinerary = ({connectionData, dateIndex, onDateIndexUpdate}) => {

    const {t} = useTranslation();

    return <div className='tour-detail-itinerary-container'>
        <div className='tour-detail-itinerary'>
            <span className='tour-detail-itinerary-header'>{t("oeffi_fahrplan")}</span>
            <ItineraryCalendar 
                connectionData={connectionData} 
                dateIndex={dateIndex} 
                onDateIndexUpdate={onDateIndexUpdate}>
            </ItineraryCalendar>
            
            {!!connectionData && 
                <ItineraryTourTimeLineContainer 
                    connections={connectionData[dateIndex]} 
                    loading={false}
                />
            }

        </div>
    </div>;
};

export default Itinerary;
