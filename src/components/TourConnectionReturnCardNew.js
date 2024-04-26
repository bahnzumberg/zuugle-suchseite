import * as React from 'react';
import {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Rueckreise from "../icons/Rueckreise";
import {formatOnlyTime} from "../utils/globals";
import {Fragment} from "react";
import { useTranslation} from 'react-i18next';

export default function TourConnectionReturnCardNew({returns}){

     // translation related
     const {t, i18n} =useTranslation();

     const [retOptions, setRetOptions] = useState([]);

     const lastReturn = returns[returns.length - 1];
 
     useEffect(() => {
         // call the function to update the retOptions state
          setRetOptions(returnOptions());
        }, [i18n.language]);

    // function to pull stops names from connection/return_description_json   
    function extractTourReturnStops(connection) {
      let departureStop = "";
      let arrivalStop = "";
      if (
        connection?.connection_description_json &&
        connection?.return_description_json
      ) {
        departureStop = connection.return_description_json.find(
          (item) => item.T === "D"
        )?.DS;
        arrivalStop = connection.return_description_json.find(
          (item) => item.T === "A"
        )?.AS;
      }
      return [departureStop, arrivalStop];
    }
    
    const [returnDepartureStop, returnArrivalStop] = extractTourReturnStops(lastReturn);

    const from_to_back = () => {
        if (returnDepartureStop === returnArrivalStop) {
            return returnDepartureStop;
        }
        else {
            return returnDepartureStop + ' - ' + returnArrivalStop;
        }
    }
    
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
        if (returnDepartureStop === returnArrivalStop) {
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
