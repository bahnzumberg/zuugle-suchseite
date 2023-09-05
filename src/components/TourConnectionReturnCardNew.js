import * as React from 'react';
import {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Rueckreise from "../icons/Rueckreise";
import {formatOnlyTime} from "../utils/globals";
import {Fragment} from "react";
import { useTranslation} from 'react-i18next';

//description
//This is another React component used inside TourCard. It displays information about the return trip options for a tour.
// The component takes in an array of returns as a prop, which contains information about the different return trip options for the tour.
// The component first extracts the last return trip option from the returns array and uses it to display the name of the departure and arrival stops for the return trip. It also displays the number of return trip options available and the time of the last possible return trip.
// If there are no return trip options available, the component returns an empty fragment.
export default function TourConnectionReturnCardNew({returns}){

     // translation related
     const {t, i18n} =useTranslation();

     const [retOptions, setRetOptions] = useState([]);
 
     useEffect(() => {
         // call the function to update the retOptions state
          setRetOptions(returnOptions());
        }, [i18n.language]);
 
    const from_to_back = () => {
        if (lastReturn.connection_returns_departure_stop === lastReturn.return_arrival_stop) {
            return lastReturn.connection_returns_departure_stop;
        }
        else {
            return lastReturn.connection_returns_departure_stop + ' - ' + lastReturn.return_arrival_stop;
        }
    }

    const lastReturn = returns[returns.length - 1];
    
    const returnOptions = () => { 
        if (!!returns && returns.length > 0) {
            if (returns[0].connection_returns_trips_back > 99) {
                return '99+';
            }
            else {
                return returns[0].connection_returns_trips_back;
            }
        }
        else {
            return 0;
        }
    }

    const lastReturn_datetime = () => {
        if (lastReturn.connection_returns_departure_stop === lastReturn.return_arrival_stop) {
            return 'Ende direkt bei Haltestelle';
        }
        else {
            return t('start.letze_moeglichkeit') + ": " +formatOnlyTime(lastReturn.return_departure_datetime) + " " +t('start.uhr');
        }
    }

    if(!!!lastReturn){
        return <Fragment></Fragment>
    }

    return <div className="tour-connection-card">
        <Box style={{width: "40px", height: "40px", backgroundColor: "#c5c5c5", borderRadius: "12px", position: "absolute", right: "16px", top: "16px"}}>
            <Box sx={{display: "flex", justifyContent: "center", width: "100%", height: "100%", alignItems: "center"}}>
                <Rueckreise style={{strokeWidth: 0.1, stroke: "#FFFFFF", fill: "#FFFFFF"}}/>
            </Box>
        </Box>
        <Box sx={{paddingRight: "50px"}}>
            <Typography variant="subtitle1" className="station">{from_to_back()}</Typography>
        </Box>
            <Typography variant="subtitle2" className="time">
                <>

                    {t('start.anzahl_rueckreiseoptionen')} 
                    {": "}
                    {retOptions}
                </>
            </Typography>
        <Typography variant="subtitle2" className="time">{lastReturn_datetime()}</Typography>
    </div>;
}
