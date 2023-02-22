import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import Box from "@mui/material/Box";
import {Button, Typography} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import {convertNumToTime, formatOnlyTime, parseTourConnectionDescription} from "../../utils/globals";
import {
    createReturnEntries
} from "./utils";
import Rueckreise from "../../icons/Rueckreise";

export default function TourReturnTimeLineContainer({connections, loading, date, selectedIndex, setSelectedIndex}){

    const [internalLoading, setInternalLoading] = useState(false);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        setEntries(parseTourConnectionDescription(getSingleConnection(), "return_description_detail"));
    }, [connections])

    useEffect(() => {
        setEntries(parseTourConnectionDescription(getSingleConnection(), "return_description_detail"));
    }, [selectedIndex])

    const getSingleConnection = () => {
        if(!!connections && !!connections.returns && connections.returns.length > 0 && connections.returns.length > selectedIndex){
            return connections.returns[selectedIndex]
        }
    }

    const getDate = () => {
        let conn = getSingleConnection();
        if(!!conn){
            if(!!!_isEmptyConnection()){
                return moment(conn.return_departure_datetime).format('DD.MM.YYYY');
            } else {
                return moment(conn.return_departure_datetime).format('DD.MM. HH:mm');
            }
        }
        return "Unbekannt"
    }

    const getReturnTimes = () => {
        if(!!connections && !!connections.returns && !!connections.returns.length > 0){
            return connections.returns.map((entry, index) => {
                const isSelected = index === selectedIndex;
                return <Box key={index} style={{display: "inline-block", marginRight: "20px"}} className={"cursor-link"} onClick={() => {
                    setInternalLoading(true)
                    setTimeout(() => {
                        setSelectedIndex(index)
                        setInternalLoading(false)
                    }, 150)
                }}>
                    <Box key={index} sx={{backgroundColor: (isSelected ? "#4992FF" : "#F7F7F7"), padding: "12px", borderRadius: "12px"}}>
                        <Typography sx={{color: (isSelected ? "#FFFFFF" : "#101010"), fontWeight: 600}}>{formatOnlyTime(entry.return_departure_datetime)}-{formatOnlyTime(entry.return_arrival_datetime)}</Typography>
                        <Typography sx={{color: (isSelected ? "rgba(255,255,255, 0.7)" : "#8B8B8B"), fontWeight: 600}}>{convertNumToTime(entry.return_duration_minutes / 60)} | {entry.return_no_of_transfers} Umst.</Typography>
                    </Box>
                </Box>
            })
        }
    }

    const _getDepartureText = () => {
        let connection = getSingleConnection();
        if(!!!connection){
            return <Fragment></Fragment>;
        }
        if(connection.return_duration_minutes == 0){
            return 'Ankunft beim Endpunkt';
        } else {
            return 'Rückreise';
        }
    }

    const _isEmptyConnection = () => {
        let connection = getSingleConnection();
        if(!!!connection){
            return false;
        }
        return connection.return_duration_minutes == 0;
    }


    if(!!!connections || !!!connections.returns || connections.returns.length == 0){
        return <Fragment />
    }

    const get_live_timetable_link_back = () => {
        let connection = getSingleConnection();
        return 'https://fahrplan.zuugle.at/?a=' + encodeURI(connection.connection_returns_departure_stop) + '&b='+ encodeURI(connection.connection_departure_stop);
    }

    return <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', padding: '20px', position: 'relative', textAlign: "center" }}>
        {!!loading ? <CircularProgress /> :
            <Fragment>
                <Box sx={{borderBottom: "1px solid #EAEAEA", padding: '20px', marginLeft: '-20px', marginRight: '-20px'}}>
                    <Box sx={{ display: "flex", flexDirection: "row", position: "relative"}}>
                        <Box style={{width: "40px", height: "40px", backgroundColor: "#4992FF", borderRadius: "12px"}}>
                            <Box sx={{display: "flex", justifyContent: "center", width: "100%", height: "100%", alignItems: "center"}}>
                                <Rueckreise style={{strokeWidth: 0.1, stroke: "#FFFFFF", fill: "#FFFFFF"}}/>
                            </Box>
                        </Box>
                        <Box sx={{paddingLeft: "10px", textAlign: "left"}}>
                            <Typography sx={{lineHeight: "16px", fontWeight: 600}}>{_getDepartureText()}</Typography>
                            <Typography sx={{color: "#8B8B8B", fontWeight: 600}}>{getDate()}</Typography>
                        </Box>

                    </Box>

                    {!!!_isEmptyConnection() &&
                        <Box style={{width: "100%", overflowX: "scroll", whiteSpace: "nowrap", marginTop: "20px"}}>
                            {getReturnTimes()}
                        </Box>
                    }
                </Box>

                <Fragment>
                    <Timeline>
                        {createReturnEntries(entries, getSingleConnection())}
                    </Timeline>

                    <Box sx={{borderTop: "1px solid #EAEAEA", padding: '20px', marginLeft: '-20px', marginRight: '-20px'}}>
                        <Button variant={"contained"} fullWidth onClick={() => { window.open(get_live_timetable_link_back()); }}>Liveabfrage für die Heimreise prüfen</Button>
                    </Box>
                </Fragment>

            </Fragment>
        }
    </Box>
}