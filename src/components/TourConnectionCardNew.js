import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Anreise from "../icons/Anreise";
import {convertNumToTime} from "../utils/globals";
import { useTranslation } from 'react-i18next';
import {localMissingDays} from '../utils/language_Utils';

//description
//TourConnectionCardNew is a React component that returns a card containing information about a connection between two stops on a tour. It takes in a connection object as a prop, which contains information such as the departure and arrival stops, the duration of the connection, and the number of transfers required.
// The component uses the from_to() function to determine whether the departure and arrival stops are the same, and if not, displays them both with a hyphen in between. It also uses the duration_and_transfers() function to display the duration of the connection and the number of transfers required.
// If there are missing days for the connection, the component displays them in a separate subtitle. Additionally, the component renders an icon representing the transportation method of the connection on the right side of the card.
export default function TourConnectionCardNew({connection}){
    
    // translation related
    const {t,i18n} =useTranslation();

    const [missingDays, setMissingDays] = useState([]);

    const translatedMissingDate = async () => {
        const mDays = await connection.missing_days;
        if (mDays.length > 0) {
        const days = localMissingDays(mDays, i18n.language);
        setMissingDays(days);
        } else {
        // console.log("mDays.length is empty");
        }
    }
    useEffect(() => {
        // call the function to update the missingDays state
        translatedMissingDate();
    }, [i18n.language]);

    const translatedmissingdates = missingDays.join(', ')

    //connection related functions
    const from_to = () => {
        if (connection.connection_departure_stop === connection.connection_arrival_stop) {
            return connection.connection_departure_stop;
        }
        else {
            return connection.connection_departure_stop + ' - ' + connection.connection_arrival_stop;
        }
    }

    const duration_and_transfers = () => {
        if (connection.connection_departure_stop === connection.connection_arrival_stop) {
            return t('main.direkt_bei_der_haltestelle');
        }
        else {
            return t('main.dauer') + convertNumToTime(connection.best_connection_duration_minutes / 60) + ", " +t('start.umstiege')+": "+connection.connection_no_of_transfers;
        }
    }

    return <div className="tour-connection-card">
        <Box style={{width: "40px", height: "40px", backgroundColor: "#c5c5c5", borderRadius: "12px", position: "absolute", right: "16px", top: "16px"}}>
            <Box sx={{display: "flex", justifyContent: "center", width: "100%", height: "100%", alignItems: "center"}}>
                <Anreise style={{strokeWidth: 0.1, stroke: "#FFFFFF", fill: "#FFFFFF"}}/>
            </Box>
        </Box>
        <Box sx={{paddingRight: "50px"}}>
            <Typography variant="subtitle1" className="station">{from_to()}</Typography>
        </Box>
        {(!!connection.missing_days && connection.missing_days.length > 0) &&
                <Typography  variant="subtitle2" className="time">
                {t('main.keine_verbindung')} {translatedmissingdates}
                </Typography>
        }
        <Typography variant="subtitle2" className="time">{duration_and_transfers()}</Typography>
    </div>;
}
