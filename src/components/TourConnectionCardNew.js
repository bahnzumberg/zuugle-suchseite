import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Anreise from "../icons/Anreise";
import {convertNumToTime} from "../utils/globals";

export default function TourConnectionCardNew({connection}){
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
            return 'Start direkt bei Haltestelle';
        }
        else {
            return 'Dauer: ' + convertNumToTime(connection.best_connection_duration_minutes / 60) + ', Umstiege: ' + connection.connection_no_of_transfers;
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
            <Typography variant="subtitle2" className="time">Keine Verbindung: {connection.missing_days.join(', ')}</Typography>
        }
        <Typography variant="subtitle2" className="time">{duration_and_transfers()}</Typography>
    </div>;
}
