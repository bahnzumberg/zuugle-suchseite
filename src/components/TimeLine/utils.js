import {Fragment} from "react";
import {Typography} from "@mui/material";
import moment from "moment";
import {
    convertNumToTime,
    getTextFromConnectionDescriptionEntry,
    getTimeFromConnectionDescriptionEntry
} from "../../utils/globals";
import * as React from "react";
import TransportTrain from "../../icons/TransportTrain";
import TransportBus from "../../icons/TransportBus";
import TransportWalk from "../../icons/TransportWalk";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Box from "@mui/material/Box";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import MyTimeLineDot from "./MyTimeLineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import ShuffleBlack from "../../icons/ShuffleBlack";
import Seilbahn from "../../icons/Seilbahn";
import Tram from "../../icons/Tram";
import Car from "../../icons/Car";

export const getDepartureText = (connection) => {
    if (!!!connection) {
        return <Fragment></Fragment>;
    }

    if(connection.connection_duration_minutes == 0){
        return <Typography sx={{color: "#8B8B8B", fontWeight: 600, paddingTop: "3px"}}>
            {moment(connection.connection_departure_datetime).format("DD.MM HH:mm")}
        </Typography>
    }

    return <Typography sx={{color: "#8B8B8B", fontWeight: 600, paddingTop: "3px"}}>
        {moment(connection.connection_departure_datetime).format("DD.MM HH:mm")} bis {moment(connection.connection_arrival_datetime).format("HH:mm")} ({convertNumToTime(connection.connection_duration_minutes / 60)})
    </Typography>
}

export const getNumberOfTransfers = (connection) => {
    if (!!!connection) {
        return "";
    }
    return connection.connection_no_of_transfers;
}

export const getIconFromText = (text) => {
    if (!!text && (text.indexOf(' Zug ') >= 0 || text.indexOf(' U-Bahn ') >= 0)) {
        return <TransportTrain style={{strokeWidth: 0.3, stroke: "#101010"}}/>
    } else if (!!text && text.indexOf(' Straßenbahn ') >= 0) {
        return <Tram style={{strokeWidth: 0.3, stroke: "#101010"}}/>
    }  else if (!!text && text.indexOf(' Bus ') >= 0) {
        return <TransportBus style={{strokeWidth: 0.3, stroke: "#101010"}}/>
    } else if (!!text && text.indexOf(' Taxi ') >= 0) {
        return <Car style={{strokeWidth: 2, stroke: "#101010", width: "24px", height: "24px"}}/>
    } else if (!!text && text.indexOf('Umstiegszeit') >= 0) {
        return <ShuffleBlack style={{strokeWidth: 0.3}}/>
    } else if(!!text && text.toLowerCase().indexOf('seilbahn') >= 0){
        return <Seilbahn style={{strokeWidth: 2, stroke: "#101010", width: "24px", height: "24px"}}/>
    } else {
        return <TransportWalk style={{strokeWidth: 0.3, stroke: "#101010"}}/>
    }
}

export const createReturnEntries = (entries, connection) => {
    let toReturn = [];
    if(!!entries && entries.length > 0){
        let _entries = entries.filter(e => !!e && e.length > 0);
        let newStart = "     ";
        if(!!connection.totour_track_duration){
            newStart = moment(connection.return_departure_datetime).add(moment(connection['fromtour_track_duration'], 'HH:mm:ss').minutes() * -1, 'minutes');
            if(!!newStart){
                newStart = newStart.format('HH:mm');
            }
        }
        toReturn.push(getDepartureEntry(`${newStart} Ankunft bei Tourende`));

        for(let i=0; i<_entries.length; i++){
            let entry = _entries[i];
            if((i)%2 == 0){
                let _text = entry.trim();
                if(_text.indexOf('|') == 0 || _text.indexOf('=') == 0 || _text.indexOf('>') == 0 || _text.indexOf('<') == 0){
                    _text = _text.substring(1);
                }
                toReturn.push(getDetailEntry(_text, i, _entries.length));
            } else {
                toReturn.push(getStationEntry(entry, ((i+1) == _entries.length)));
            }
        }

    }
    return toReturn;
}

export const createEntries = (entries, connection) => {
    let toReturn = [];
    if(!!entries && entries.length > 0){
        let _entries = entries.filter(e => !!e && e.length > 0);
        toReturn.push(getDepartureEntry(_entries[0]));
        for(let i=1; i<_entries.length; i++){
            let entry = _entries[i];
            if((i-1)%2 == 0){
                let _text = entry.trim();
                if(_text.indexOf('|') == 0 || _text.indexOf('=') == 0 || _text.indexOf('>') == 0){
                    _text = _text.substring(1);
                }
                toReturn.push(getDetailEntry(_text, i, _entries.length));
            } else {
                toReturn.push(getStationEntry(entry, i == _entries.length));
            }
        }
        let newStart = "     ";
        if(!!connection.totour_track_duration){
            newStart = moment(connection.connection_arrival_datetime).add(moment(connection['totour_track_duration'], 'HH:mm:ss').minutes(), 'minutes');
            if(!!newStart){
                newStart = newStart.format('HH:mm');
            }
        }
        toReturn.push(getArrivalEntry(`${newStart} Ankunft bei Tourstart`));
    }
    return toReturn;
}

export const getDetailEntry = (entry, index, length) => {
    return <TimelineItem>
        <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, marginTop: "auto", marginBottom: "auto"}} className={"timeline-opposite-container"}>
            <div>
                {getIconFromText(entry)}
            </div>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{minWidth: '12px'}}>
            <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
        </TimelineSeparator>
        <TimelineContent sx={{...getBorder(index, length), paddingTop: "16px", paddingBottom: "16px"}}>
            <Typography variant={"text"} color={'#8B8B8B'} sx={{fontSize: "14px", lineHeight: "16px"}}>{entry}</Typography>
        </TimelineContent>
    </TimelineItem>
}

export const getStationEntry = (entry, isLast = false) => {
    return <TimelineItem sx={{minHeight: 0}}>
        <TimelineOppositeContent color="text.secondary"
                                 sx={{flex: 0.2, paddingTop: !!isLast ? "24px": "0px", lineHeight: "14px", paddingBottom: !!isLast ? "0px" : "24px"}} className={"timeline-opposite-container"}>
            <Box sx={{color: "#101010", fontSize: "14px"}}>
                {getTimeFromConnectionDescriptionEntry(entry)}
            </Box>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{minWidth: '12px'}}>
            {!!isLast ? <Fragment>
                <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
                <MyTimeLineDot/>
            </Fragment> : <Fragment>
                <MyTimeLineDot/>
                <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
            </Fragment>}

        </TimelineSeparator>
        <TimelineContent sx={{paddingTop: !!isLast ? "24px" : "0px", lineHeight: "16px", paddingBottom: !!isLast ? "0px" : "24px", color: "#101010"}}>
            {getTextFromConnectionDescriptionEntry(entry)}
        </TimelineContent>
    </TimelineItem>;
}


export const getDepartureEntry = (entry) => {
    return <TimelineItem sx={{minHeight: 0}}>
        <TimelineOppositeContent color="text.secondary"
                                 sx={{flex: 0.2, paddingTop: "0px", lineHeight: "14px", paddingBottom: "24px"}} className={"timeline-opposite-container"}>
            <Box sx={{color: "#101010", fontSize: "14px"}}>
                {getTimeFromConnectionDescriptionEntry(entry)}
            </Box>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{minWidth: '12px'}}>
            <MyTimeLineDot/>
            <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
        </TimelineSeparator>
        <TimelineContent sx={{paddingTop: "0px", lineHeight: "16px", paddingBottom: "24px", color: "#101010"}}>
            {getTextFromConnectionDescriptionEntry(entry)}
        </TimelineContent>
    </TimelineItem>;
}

export const getArrivalEntry = (entry) => {
    return <TimelineItem sx={{minHeight: 0}}>
        <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, paddingTop: "24px", paddingBottom: 0}} className={"timeline-opposite-container"}>
            <Box sx={{lineHeight: "14px", paddingBottom: 0, color: "#101010", fontSize: "14px"}}>
                {getTimeFromConnectionDescriptionEntry(entry)}
            </Box>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{minWidth: '12px'}}>
            <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
            <MyTimeLineDot/>
        </TimelineSeparator>
        <TimelineContent sx={{paddingTop: "24px", paddingBottom: "0px", lineHeight: "16px", position: "relative"}}>
            <Box sx={{position: "absolute", bottom: 0, color: "#101010"}}>
                {getTextFromConnectionDescriptionEntry(entry)}
            </Box>
        </TimelineContent>
    </TimelineItem>;
}

export const getBorder = (index, length) => {
    if (index == (length - 1)) {
        return {borderBottom: '1px solid #EAEAEA', borderTop: '1px solid #EAEAEA'}
    } else {
        return {borderTop: '1px solid #EAEAEA'}
    }
}

export const getDetailedEntries = (connection, field1 = "connection_description_parsed") => {
    if (!!!connection || !!!connection[field1] || connection[field1].length < 2) {
        return <Fragment></Fragment>;
    }

    let entries = connection[field1].slice(1);

    return entries.map((entry, index) => {
        return <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, marginTop: "auto", marginBottom: "auto"}} className={"timeline-opposite-container"}>
                <div>
                    {getIconFromText(entry)}
                </div>
            </TimelineOppositeContent>
            <TimelineSeparator sx={{minWidth: '12px'}}>
                <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
            </TimelineSeparator>
            <TimelineContent sx={{...getBorder(index, entries.length), paddingTop: "16px", paddingBottom: "16px"}}>
                <Typography variant={"text"} color={'#8B8B8B'} sx={{fontSize: "14px", lineHeight: "16px"}}>{entry}</Typography>
            </TimelineContent>
        </TimelineItem>
    })
}

export const getWalkEntry = (connection, field1 = "totour_track_duration", from = false) => {
    if (!!!connection) {
        return <Fragment></Fragment>;
    }

    const newStart = moment(connection.connection_arrival_datetime).add(moment(connection[field1], 'HH:mm:ss').minutes(), 'minutes');

    if(!!from){
        return [<TimelineItem sx={{minHeight: 0}}>
            <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, marginTop: "auto", marginBottom: "auto"}} className={"timeline-opposite-container"}>
                <div>
                </div>
            </TimelineOppositeContent>
            <TimelineSeparator sx={{minWidth: '12px'}}>
                <MyTimeLineDot/>
                <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
            </TimelineSeparator>
            <TimelineContent sx={{paddingTop: "0px", lineHeight: "16px", paddingBottom: "24px", color: "#101010"}}>
                Ankunft bei Tourende
            </TimelineContent>
        </TimelineItem>,
            <TimelineItem>
                <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, marginTop: "auto", marginBottom: "auto"}} className={"timeline-opposite-container"}>
                    <div>
                        <TransportWalk style={{strokeWidth: 0.3, stroke: "#101010"}}/>
                    </div>
                </TimelineOppositeContent>
                <TimelineSeparator sx={{minWidth: '12px'}}>
                    <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
                </TimelineSeparator>
                <TimelineContent sx={{paddingTop: "16px", paddingBottom: "16px"}}>
                    <Typography variant={"text"} color={'#8B8B8B'} sx={{fontSize: "14px"}}>{!!from ? `Gehe ${moment(connection[field1], 'HH:mm:ss').format("HH:mm")} zur Haltestelle` : `Gehe ${moment(connection[field1], 'HH:mm:ss').format("HH:mm")} zu Tourstart`}</Typography>
                </TimelineContent>
            </TimelineItem>]
    }


    return [
        <TimelineItem>
            <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, marginTop: "auto", marginBottom: "auto"}} className={"timeline-opposite-container"}>
                <div>
                    <TransportWalk style={{strokeWidth: 0.3, stroke: "#101010"}}/>
                </div>
            </TimelineOppositeContent>
            <TimelineSeparator sx={{minWidth: '12px'}}>
                <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
            </TimelineSeparator>
            <TimelineContent sx={{paddingTop: "16px", paddingBottom: "16px"}}>
                <Typography variant={"text"} color={'#8B8B8B'} sx={{fontSize: "14px"}}>{!!from ? `Gehe ${moment(connection[field1], 'HH:mm:ss').format("HH:mm")} zur Haltestelle` : `Gehe ${moment(connection[field1], 'HH:mm:ss').format("HH:mm")} zu Tourstart`}</Typography>
            </TimelineContent>
        </TimelineItem>,
        <TimelineItem sx={{minHeight: 0}}>
            <TimelineOppositeContent color="text.secondary" sx={{flex: 0.2, paddingTop: "24px", paddingBottom: 0}} className={"timeline-opposite-container"}>
                <Box sx={{lineHeight: "14px", paddingBottom: 0, color: "#101010", fontSize: "14px"}}>
                    {newStart.format("HH:mm")}
                </Box>
            </TimelineOppositeContent>
            <TimelineSeparator sx={{minWidth: '12px'}}>
                <TimelineConnector sx={{backgroundColor: "#4992FF"}}/>
                <MyTimeLineDot/>
            </TimelineSeparator>
            <TimelineContent sx={{paddingTop: "24px", paddingBottom: "0px", lineHeight: "16px", position: "relative"}}>
                <Box sx={{position: "absolute", bottom: 0, color: "#101010"}}>
                    {!!from ? '' : 'Ankunft bei Tourstart'}
                </Box>
            </TimelineContent>
        </TimelineItem>]
}
