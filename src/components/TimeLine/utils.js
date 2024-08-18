import { Fragment } from "react";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import {
  convertNumToTime,
  simpleConvertNumToTime,
  getTextFromConnectionDescriptionEntry,
  getTimeFromConnectionDescriptionEntry,
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
import { v4 as uuidv4 } from 'uuid';

const keys_1 = [uuidv4(), uuidv4(), uuidv4(), uuidv4(),uuidv4()];
const keys_2 = [uuidv4(), uuidv4(), uuidv4(), uuidv4(),uuidv4()];

export const GetDepartureText = (connection, t) => {
  let isMobile = window.innerWidth <= 600;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 600;
  });

  if (!!!connection) {
    return <Fragment></Fragment>;
  }

  // let depTime = (connection.connection_departure_datetime_entry).slice(11, 16)
  let depTime = (connection.connection_departure_datetime).slice(11, 16)
  
  const departureText = connection.connection_duration_minutes === 0 ? 
    // moment(connection.connection_departure_datetime_entry).format("DD.MM HH:mm") :
    moment(connection.connection_departure_datetime).format("DD.MM HH:mm") :
    `${depTime} - ${moment(connection.connection_arrival_datetime).format("HH:mm")}`;

  return (
    <Typography sx={{ color: "#000000", fontWeight: 500, paddingTop: "3px", width: "300px", 

      lineHeight: !isMobile ? "18px" : "16px", fontSize: "20px", 
    }}>
      {departureText}
    </Typography>
  );
};

export const getReturnText = (connection, t) => {
  if (!!!connection) {
    return <Fragment></Fragment>;
  }
  let retDepTime = (connection.return_departure_datetime).slice(11, 16)
  const returnText = connection.return_duration_minutes === 0 ? 
    moment(connection.return_departure_datetime).format("DD.MM HH:mm") :
    `${retDepTime} - ${moment(connection.return_arrival_datetime).format("HH:mm")} `;

  return returnText;

};

export const getNumberOfTransfers = (
  connection,
  field = "connection_no_of_transfers"
) => {
  if (!!!connection) {
    return "";
  }
  return connection[field];
};

// Preparaing for getIconFromText
// transport-type arrays
let train_key = ['train_key','Zug','Train','le train','Treno','Vlak'];
let metro_key = ['metro_key','U Bahn','Underground','le métro','Metropolitana','Podzemna železnica'];
let tram_key = ['tram_key','Strassenbahn','Tram','le tramway','Tram','Tramvaj'];
let bus_key = ['bus_key','Bus','Bus','le bus','Autobus','Avtobus'];
let car_key = ['car_key','Taxi','Taxi','le taxi','Taxi','Taxi'];
let transfer_key = ['transfer_key','Umstiegszeit','transfer time','temps de transfert','tempo di trasferimento','čas prestopa'];
let cableCar_key = ['cableCar_key','Seilbahn','Cable car','le téléphérique','Funivia','Žičnica'];

// crucial : key values for this object are the same names of transport-type arrays above. (walk is default)
const transportIcons = {
  train_key: <TransportTrain style={{ strokeWidth: 0.8, stroke: "#4992FF" }} />,
  metro_key: <TransportTrain style={{ strokeWidth: 0.8, stroke: "#4992FF" }} />,
  tram_key: <Tram style={{ strokeWidth: 0.8, stroke: "#4992FF" }} />, 
  bus_key: <TransportBus style={{ strokeWidth: 0.8, stroke: "#4992FF" }} />,
  car_key: <Car style={{strokeWidth: 2,stroke: "#4992FF",width: "24px",height: "24px"}}/>,
  cableCar_key: <Seilbahn style={{strokeWidth: 2,stroke: "#4992FF",width: "24px",height: "24px"}}/>,
  transfer_key: <ShuffleBlack style={{ strokeWidth: 0.8 }} />,
  walk: <TransportWalk style={{ strokeWidth: 0.8, stroke: "#4992FF" }} />
};
// array of arrays contains all the defined transport-type arrays 
const transportNameArrays = [train_key, metro_key,tram_key,bus_key, car_key ,cableCar_key,transfer_key];

// function getTransportIcon(text) {
function getIconFromText(text) {
  if (!text) return null; // Handle empty text case

  for (const transportArray of transportNameArrays) {    
    const transportType = transportArray[0]; // Assuming the first element is the key

    for (const transportName of transportArray.slice(1)) { // Iterate from 2nd element/ first element being the key
      if (text.indexOf(`${transportName}`) >= 0) {
        return transportIcons[transportType];
      }
    }
  }

  // If no match found, return a default icon
  return transportIcons["walk"]; 
}

export const createReturnEntries = (entries, connection, t) => {
  let toReturn = [];
  if (!!entries && entries.length > 0) {
    let _entries = entries.filter((e) => !!e && e.length > 0); //ensures that only non-empty and truthy elements are included in the filtered array.
    let newStart = "     ";
    if (!!connection.totour_track_duration) {
      newStart = moment(connection.return_departure_datetime).add(
        moment(connection["fromtour_track_duration"], "HH:mm:ss").minutes() *
          -1,
        "minutes"
      );
      if (!!newStart) {
        newStart = newStart.format("HH:mm");
      }
    }
    toReturn.push(getDepartureEntry(`${newStart} ${t('details.ankunft_bei_tourende')}`));

    for (let i = 0; i < _entries.length; i++) {
      let entry = _entries[i];
      if (i % 2 === 0) {
        let _text = entry.trim();
        if (
          _text.indexOf("|") === 0 ||
          _text.indexOf("=") === 0 ||
          _text.indexOf(">") === 0 ||
          _text.indexOf("<") === 0
        ) {
          _text = _text.substring(1);
        }
        toReturn.push(getDetailEntry(_text, keys_2[i], _entries.length));
      } else {
        toReturn.push(getStationEntry(entry, i + 1 === _entries.length, keys_2[i]));
      }
    }
  }
  return toReturn;
};

export const createEntries = (entries, connection, t) => {
  let toReturn = [];
  if (!!entries && entries.length > 0) {
    let _entries = entries.filter((e) => !!e && e.length > 0);
    toReturn.push(getDepartureEntry(_entries[0]));
    for (let i = 1; i < _entries.length; i++) {
      let entry = _entries[i];
      if ((i - 1) % 2 === 0) {
        let _text = entry.trim();
        if (
          _text.indexOf("|") === 0 ||
          _text.indexOf("=") === 0 ||
          _text.indexOf(">") === 0
        ) {
          _text = _text.substring(1);
        }
        toReturn.push(getDetailEntry(_text, keys_1[i], _entries.length));
      } else {
        toReturn.push(getStationEntry(entry,i === _entries.length, keys_1[i]));// any number above the max 5 expected entries
      }
    }
    let newStart = "     ";
    if (!!connection.totour_track_duration) {
      newStart = moment(connection.connection_arrival_datetime).add(
        moment(connection["totour_track_duration"], "HH:mm:ss").minutes(),
        "minutes"
      );
      if (!!newStart) {
        newStart = newStart.format("HH:mm");
      }
    }
    toReturn.push(getArrivalEntry(`${newStart} ${t("details.ankunft_bei_tourstart")}`));
  }
  return toReturn;
};

export const getDetailEntry = (entry, index, length) => {
  return (
    <TimelineItem key={index} >
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
        className={"timeline-opposite-container"}
      >
        <div>{getIconFromText(entry)}</div>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          ...getBorder(index, length),
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <Typography
          variant={"text"}
          color={"#8B8B8B"}
          sx={{ fontSize: "14px", lineHeight: "16px" }}
        >
          {entry}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export const getStationEntry = (entry , isLast = false, index) => {
  return (
    <TimelineItem sx={{ minHeight: 0 }} key={index}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{
          flex: 0.2,
          paddingTop: !!isLast ? "24px" : "0px",
          lineHeight: "14px",
          paddingBottom: !!isLast ? "0px" : "24px",
        }}
        className={"timeline-opposite-container"}
      >
        <Box sx={{ color: "#101010", fontSize: "14px" }}>
          {getTimeFromConnectionDescriptionEntry(entry)}
        </Box>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        {!!isLast ? (
          <Fragment>
            <TimelineConnector
              sx={{ backgroundColor: "#4992FF", width: "3px" }}
            />
            <MyTimeLineDot />
          </Fragment>
        ) : (
          <Fragment>
            <MyTimeLineDot />
            <TimelineConnector
              sx={{ backgroundColor: "#4992FF", width: "3px" }}
            />
          </Fragment>
        )}
      </TimelineSeparator>
      <TimelineContent
        sx={{
          paddingTop: !!isLast ? "24px" : "0px",
          lineHeight: "16px",
          paddingBottom: !!isLast ? "0px" : "24px",
          color: "#101010",
        }}
      >
        {getTextFromConnectionDescriptionEntry(entry)}
      </TimelineContent>
    </TimelineItem>
  );
};

export const getDepartureEntry = (entry) => {
  return (
    <TimelineItem sx={{ minHeight: 0 }}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{
          flex: 0.2,
          paddingTop: "0px",
          lineHeight: "14px",
          paddingBottom: "24px",
        }}
        className={"timeline-opposite-container"}
      >
        <Box sx={{ color: "#101010", fontSize: "14px" }}>
          {getTimeFromConnectionDescriptionEntry(entry)}
        </Box>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <MyTimeLineDot />
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          paddingTop: "0px",
          lineHeight: "16px",
          paddingBottom: "24px",
          color: "#101010",
        }}
      >
        {getTextFromConnectionDescriptionEntry(entry)}
      </TimelineContent>
    </TimelineItem>
  );
};

export const getArrivalEntry = (entry) => {
  return (
    <TimelineItem sx={{ minHeight: 0 }}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ flex: 0.2, paddingTop: "24px", paddingBottom: 0 }}
        className={"timeline-opposite-container"}
      >
        <Box
          sx={{
            lineHeight: "14px",
            paddingBottom: 0,
            color: "#101010",
            fontSize: "14px",
          }}
        >
          {getTimeFromConnectionDescriptionEntry(entry)}
        </Box>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
        <MyTimeLineDot />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          paddingTop: "24px",
          paddingBottom: "0px",
          lineHeight: "16px",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", bottom: 0, color: "#101010" }}>
          {getTextFromConnectionDescriptionEntry(entry)}
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};

export const getBorder = (index, length) => {
  if (index === length - 1) {
    return {
      borderBottom: "1px solid #EAEAEA",
      borderTop: "1px solid #EAEAEA",
    };
  } else {
    return { borderTop: "1px solid #EAEAEA" };
  }
};

export const getDetailedEntries = (
  connection,
  field1 = "connection_description_parsed"
) => {
  if (!!!connection || !!!connection[field1] || connection[field1].length < 2) {
    return <Fragment></Fragment>;
  }

  let entries = connection[field1].slice(1);

  return entries.map((entry, index) => {
    return (
      <TimelineItem key={index}>
        <TimelineOppositeContent
          color="text.secondary"
          sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
          className={"timeline-opposite-container"}
        >
          <div>{getIconFromText(entry)}</div>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{ minWidth: "12px" }}>
          <TimelineConnector
            sx={{ backgroundColor: "#4992FF", width: "3px" }}
          />
        </TimelineSeparator>
        <TimelineContent
          sx={{
            ...getBorder(index, entries.length),
            paddingTop: "16px",
            paddingBottom: "16px",
          }}
        >
          <Typography
            variant={"text"}
            color={"#8B8B8B"}
            sx={{ fontSize: "14px", lineHeight: "16px" }}
          >
            {entry}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    );
  });
};

export const getWalkEntry = (
  connection,
  field1 = "totour_track_duration",
  from = false
) => {
  if (!!!connection) {
    return <Fragment></Fragment>;
  }

  const newStart = moment(connection.connection_arrival_datetime).add(
    moment(connection[field1], "HH:mm:ss").minutes(),
    "minutes"
  );

  if (!!from) {
    return [
      <TimelineItem sx={{ minHeight: 0 }}>
        <TimelineOppositeContent
          color="text.secondary"
          sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
          className={"timeline-opposite-container"}
        >
          <div></div>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{ minWidth: "12px" }}>
          <MyTimeLineDot />
          <TimelineConnector
            sx={{ backgroundColor: "#4992FF", width: "3px" }}
          />
        </TimelineSeparator>
        <TimelineContent
          sx={{
            paddingTop: "0px",
            lineHeight: "16px",
            paddingBottom: "24px",
            color: "#101010",
          }}
        >
          Ankunft bei Tourende
        </TimelineContent>
      </TimelineItem>,
      <TimelineItem>
        <TimelineOppositeContent
          color="text.secondary"
          sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
          className={"timeline-opposite-container"}
        >
          <div>
            <TransportWalk style={{ strokeWidth: 0.8, stroke: "#101010" }} />
          </div>
        </TimelineOppositeContent>
        <TimelineSeparator sx={{ minWidth: "12px" }}>
          <TimelineConnector
            sx={{ backgroundColor: "#4992FF", width: "3px" }}
          />
        </TimelineSeparator>
        <TimelineContent sx={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <Typography
            variant={"text"}
            color={"#8B8B8B"}
            sx={{ fontSize: "14px" }}
          >
            {!!from
              ? `Gehe ${moment(connection[field1], "HH:mm:ss").format(
                  "HH:mm"
                )} zur Haltestelle`
              : `Gehe ${moment(connection[field1], "HH:mm:ss").format(
                  "HH:mm"
                )} zu Tourstart`}
          </Typography>
        </TimelineContent>
      </TimelineItem>,
    ];
  }

  return [
    <TimelineItem>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
        className={"timeline-opposite-container"}
      >
        <div>
          <TransportWalk style={{ strokeWidth: 0.8, stroke: "#101010" }} />
        </div>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
      </TimelineSeparator>
      <TimelineContent sx={{ paddingTop: "16px", paddingBottom: "16px" }}>
        <Typography
          variant={"text"}
          color={"#8B8B8B"}
          sx={{ fontSize: "14px" }}
        >
          {!!from
            ? `Gehe ${moment(connection[field1], "HH:mm:ss").format(
                "HH:mm"
              )} zur Haltestelle`
            : `Gehe ${moment(connection[field1], "HH:mm:ss").format(
                "HH:mm"
              )} zu Tourstart`}
        </Typography>
      </TimelineContent>
    </TimelineItem>,
    <TimelineItem sx={{ minHeight: 0 }}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ flex: 0.2, paddingTop: "24px", paddingBottom: 0 }}
        className={"timeline-opposite-container"}
      >
        <Box
          sx={{
            lineHeight: "14px",
            paddingBottom: 0,
            color: "#101010",
            fontSize: "14px",
          }}
        >
          {newStart.format("HH:mm")}
        </Box>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
        <MyTimeLineDot />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          paddingTop: "24px",
          paddingBottom: "0px",
          lineHeight: "16px",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", bottom: 0, color: "#101010" }}>
          {!!from ? "" : "Ankunft bei Tourstart"}
        </Box>
      </TimelineContent>
    </TimelineItem>,
  ];
};

export function formatToHHMM(durationString) {
  const parsedDuration = moment.duration(durationString);
  const formattedDuration = moment.utc(parsedDuration.asMilliseconds()).format("HH:mm");
  return formattedDuration;
}
// Example usage:
// const originalDuration = "00:25:39 Std";
// const transformedDuration = toHHMM(originalDuration);

