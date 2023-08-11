import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import Box from "@mui/material/Box";
import {Button, Typography} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Anreise from "../../icons/Anreise";
import {parseTourConnectionDescription} from "../../utils/globals";
import Shuffle from "../../icons/Shuffle";
import {
    createEntries,
    getDepartureText,
    getNumberOfTransfers
} from "./utils";
import { useTranslation} from 'react-i18next';


//description
//TourTimeLineContainer is a React component that displays a timeline of connections for a tour, along with information about the departure point and the number of transfers.
//The component takes two props, connections and loading. connections is an object containing information about the connections for the tour, and loading is a boolean indicating whether the data is still loading.
//The component first checks if there are any connections for the tour. If there are no connections, it displays a message saying that no connections were found. Otherwise, it parses the connection data using parseTourConnectionDescription function and sets the result to the entries state variable using useState hook.
//The component then displays the departure information and the number of transfers. The departure information includes the departure text and the departure time, while the number of transfers is displayed as an icon with the number of transfers next to it.
//Finally, the component displays the timeline of connections using the Timeline component from Material UI. It calls the createEntries function to create the individual entries for the timeline. At the bottom of the component, there is a button that, when clicked, opens a live timetable for the tour's connection using the get_live_timetable_link_there function.
export default function TourTimeLineContainer({connections, loading}){
    
    const{t} = useTranslation();

    const [entries, setEntries] = useState([]);

    useEffect(() => {
        setEntries(parseTourConnectionDescription(getSingleConnection()));
    }, [connections])


    const getSingleConnection = () => {
        return (!!connections && !!connections.connections && connections.connections.length > 0) ? connections.connections[0] : null;
    }


    if(!!!getSingleConnection()){
        return <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', padding: '20px', position: 'relative', textAlign: "center" }}>
            <Typography sx={{lineHeight: "16px", fontWeight: 600}}>
                {t("details.keine_verbindungen")}
            </Typography>
        </Box>
    }

    const _getDepartureText = () => {
        let connection = getSingleConnection();
        if(!!!connection){
            return <Fragment></Fragment>;
        }
        if(connection.connection_duration_minutes == 0){
            return t("details.start_ausgangort");
        } else {
            return t("Details.beste_anreise");
        }
    }

    const get_live_timetable_link_there = () => {
        let connection = getSingleConnection();
        return 'https://fahrplan.zuugle.at/?a=' + encodeURI(connection.connection_departure_stop) + '&b='+ encodeURI(connection.connection_arrival_stop);
    }

    return <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', padding: '20px', position: 'relative', textAlign: "center" }}>
        {!!loading ? <CircularProgress /> :
            <Fragment>
                <Box sx={{borderBottom: "1px solid #EAEAEA", padding: '20px', marginLeft: '-20px', marginRight: '-20px', display: "flex", flexDirection: "row", position: "relative"}}>
                    <Box style={{width: "40px", height: "40px", backgroundColor: "#4992FF", borderRadius: "12px"}}>
                        <Box sx={{display: "flex", justifyContent: "center", width: "100%", height: "100%", alignItems: "center"}}>
                            <Anreise style={{strokeWidth: 0.1, stroke: "#FFFFFF", fill: "#FFFFFF"}}/>
                        </Box>
                    </Box>
                    <Box sx={{paddingLeft: "10px", textAlign: "left"}}>
                        <Typography sx={{lineHeight: "16px", fontWeight: 600}}>{_getDepartureText()}</Typography>
                        {getDepartureText(getSingleConnection())}
                    </Box>
                    <Box sx={{position: "absolute", right: 20, top: 20}}>
                        <Shuffle style={{strokeWidth: 0.3, stroke: "#4992FF", fill: "#4992FF", width: "18px", height: "18px"}}/>
                    </Box>
                    <Box sx={{position: "absolute", right: 41, top: 20}}>
                        <Box sx={{color: "#4992FF", fontSize: "16px", fontWeight: 600, lineHeight: "16px"}}>{getNumberOfTransfers(getSingleConnection())} Umst.</Box>
                    </Box>
                </Box>


                <Timeline>
                    {createEntries(entries, getSingleConnection())}
                </Timeline>

                <Box sx={{borderTop: "1px solid #EAEAEA", padding: '20px', marginLeft: '-20px', marginRight: '-20px'}}>
                    
                    <Button variant={"contained"} fullWidth onClick={() => { window.open(get_live_timetable_link_there()); }}>
                        {t("details.liveabfrage_anreise")}
                    </Button>
                </Box>
            </Fragment>
        }
    </Box>
}