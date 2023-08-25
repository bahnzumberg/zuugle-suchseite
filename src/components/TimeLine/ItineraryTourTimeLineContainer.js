import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Anreise from "../../icons/Anreise";
import Rueckreise from "../../icons/Rueckreise";
import Überschreitung from "../../icons/Überschreitung";
import {convertNumToTime, parseTourConnectionDescription} from "../../utils/globals";
import Shuffle from "../../icons/Shuffle";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    createEntries,
    createReturnEntries,
    getDepartureText,
    getReturnText,
    getNumberOfTransfers
} from "./utils";
import { useTranslation } from 'react-i18next';
// import { forEach } from 'lodash';

//description
//ItineraryTourTimeLineContainer is a React component that displays a timeline of connections for a tour, along with information about the departure point and the number of transfers.
//The component takes two props, connections and loading. connections is an object containing information about the connections for the tour, and loading is a boolean indicating whether the data is still loading.
//The component first checks if there are any connections for the tour. If there are no connections, it displays a message saying that no connections were found. Otherwise, it parses the connection data using parseTourConnectionDescription function and sets the result to the entries state variable using useState hook.
//The component then displays the departure information and the number of transfers. The departure information includes the departure text and the departure time, while the number of transfers is displayed as an icon with the number of transfers next to it.
//Finally, the component displays the timeline of connections using the Timeline component from Material UI. It calls the createEntries function to create the individual entries for the timeline. At the bottom of the component, there is a button that, when clicked, opens a live timetable for the tour's connection using the get_live_timetable_link_there function.
export default function ItineraryTourTimeLineContainer({
  connections,
  loading,
  duration,
}) {
  // console.log("----------------------------------------------------------------")
  // console.log("L26 connections : ")
  // connections && console.log(connections);
  // console.log("----------------------------------------------------------------")
  // console.log("----------------------------------------------------------------")
  // console.log("L26 duration : ")
  // duration && console.log(duration);
  // console.log("----------------------------------------------------------------")

  const [entries, setEntries] = useState([]); //PARSED array[strings] only one object, a departure description
  const [returnEntries, setReturnEntries] = useState([]); //UNPARSED array[objects] with possibly a few return connections

  const [getMore, setGetMore] = useState(false);
  const [formattedDuration, setformattedDuration] = useState("n/a");

  // the following two vars filled by fcn extractReturns
  const twoReturns = []; // DO WE NEED THESE NOW?
  const remainingReturns = []; //DO WE NEED THESE NOW?

  const { t } = useTranslation();

  // after the useEffect we have state "entries" being a strings array representing the connection details
  useEffect(() => {
    let settingEnt = parseTourConnectionDescription(getSingleConnection());
    setEntries(settingEnt);
    setReturnEntries(connections.returns);
    extractReturns();
  }, [connections]);
  
  const formatDuration = (duration) => { 
    !!duration ? console.log("Duration dude is : ", duration) : console.log("no duration !!!");
    // if(!duration) return " ";
    let _time = " ";
    _time = !!duration && convertNumToTime(duration, true);
    _time = _time.replace(/\s*h\s*$/, '');
    console.log("trimed time ", _time); // Output: "07:00"
    return _time;
  }

  useEffect(() => {
    if(!!duration && typeof(duration) == "string"){
      setformattedDuration(formatDuration(duration));
    }
  }, [duration]);
  

  // entries ?  console.log("entries 1: " + JSON.stringify(entries)) : console.log("No entries found");
  // entries ?  console.log("entries 2: type is :" + typeof(entries)) : console.log("No entries found");
  //checks if there is a connections and returns it extracted from the connections object
  const getSingleConnection = () => {
    return !!connections &&
      !!connections.connections &&
      connections.connections.length > 0
      ? connections.connections[0]
      : null;
  };

  //check if there are return connections and fill twoReturns / remainingReturns
  const extractReturns = () => {
    if (
      !!connections &&
      !!connections.returns &&
      connections.returns.length > 0
    ) {
      let array = connections.returns;
      for (let index = 0; index < array.length; index++) {
        // index== 0 && console.log("connections.returns[index]", array[index]);
        //if index is 0 or 1 -> fill array twoReturns BUT use  parseTourConnectionDescription
        if (index <= 1) {
          twoReturns[index] = parseTourConnectionDescription(
            array[index],
            "return_description_detail"
          );
          // console.log(`twoReturns[index], ${JSON.stringify(twoReturns[index])}`);
        }
        //if index is > 1 -> fill array remainingReturns
        if (index > 1) {
          remainingReturns[index] = parseTourConnectionDescription(
            array[index],
            "return_description_detail"
          );
          // console.log(index)
          // console.log("remainingReturns[index]", remainingReturns[index]);
        }
      }
      return;
    }
    return null;
  };
  extractReturns();

  //case of when connections/connections.connections/or connections.connections[0] does not exist
  if (!!!getSingleConnection()) {
    return (
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
          {" "}
          {t("details.keine_verbindungen")}{" "}
        </Typography>
      </Box>
    );
  }

  const _getDepartureText = () => {
    let connection = getSingleConnection();
    if (!!!connection) {
      return <Fragment></Fragment>;
    }
    if (connection.connection_duration_minutes == 0) {
      return t("details.start_ausgangort");
    } else {
      return t("Details.beste_anreise");
    }
  };

  const _getReturnText = (index) => {
    let connection =
      !!connections && !!connections.returns && connections.returns.length > 0;
    if (!!!connection) {
      return <Fragment></Fragment>;
    }
    return `${t("Details.rückreise")} ${index + 1}`;
  };

  const get_live_timetable_link_there = () => {
    let connection = getSingleConnection();
    return (
      "https://fahrplan.zuugle.at/?a=" +
      encodeURI(connection.connection_departure_stop) +
      "&b=" +
      encodeURI(connection.connection_arrival_stop)
    );
  };

  // for (let index = 0; index < 1; index++) {
  //     let result = JSON.stringify(connections.returns[index]);
  //     console.log("index:", index);
  //     console.log(`connections.returns[${index}] result -->  : ${result}`);
  // }

  const addMoreConnections = () => {
    setGetMore(true);
  };

  
  return (
    <Box
      sx={{
        borderRadius: "16px",
        position: "relative",
        textAlign: "center",
      }}
    >
      {!loading ? (
        <Fragment>
          {/* ... Existing JSX code ... */}
          <Accordion sx={{ borderRadius: "18px !important" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  padding: "20px",
                  marginLeft: "-20px",
                  marginRight: "-20px",
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                }}
              >
                <Box
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#4992FF",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Anreise
                      style={{
                        strokeWidth: 0.1,
                        stroke: "#FFFFFF",
                        fill: "#FFFFFF",
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>
                  <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                    {_getDepartureText()}
                  </Typography>
                  {getDepartureText(getSingleConnection())}
                </Box>
                <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                  <Shuffle
                    style={{
                      strokeWidth: 0.3,
                      stroke: "#4992FF",
                      fill: "#4992FF",
                      width: "18px",
                      height: "18px",
                    }}
                  />
                </Box>
                <Box sx={{ position: "absolute", right: 41, top: 20 }}>
                  <Box
                    sx={{
                      color: "#4992FF",
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "16px",
                    }}
                  >
                    {getNumberOfTransfers(getSingleConnection())} {t('details.umstiege')}
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* {console.log("connection -> entries:", JSON.stringify(entries))}  */}
              {console.log("connection -> part 1: entries", entries)}
              {console.log(
                "connection -> part 2 getSingleConnection():",
                getSingleConnection()
              )}

              <Timeline>
                {createEntries(entries, getSingleConnection())}
              </Timeline>
            </AccordionDetails>
            {/* Box below is a divider */}
            {/* <Box sx={{borderBottom: "1px solid #EAEAEA", padding: '20px', marginLeft: '-20px', marginRight: '-20px', display: "flex", flexDirection: "row", position: "relative"}}>
                </Box> */}
          </Accordion>
          <Divider sx={{ mt: "24px" }} />
          <Accordion
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <AccordionDetails>
              {/* <Box sx={{borderBottom: "1px solid #EAEAEA", padding: '20px', marginLeft: '-20px', marginRight: '-20px', display: "flex", flexDirection: "row", position: "relative"}}> */}
              <Box
                sx={{
                  padding: "20px",
                  marginLeft: "-20px",
                  marginRight: "-20px",
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                }}
              >
                <Box
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#FF7663",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Überschreitung
                      style={{
                        strokeWidth: 0.1,
                        stroke: "#FFFFFF",
                        fill: "#FFFFFF",
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ paddingLeft: "20px", textAlign: "left" }}>
                  <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                  {t('details.circa')} {formattedDuration} {t('details.stunden_tour')}
                  </Typography>
                  <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                  {t('details.lt_tourbeschreibung')}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ mb: "24px" }} />
          {/* Rendering first 2 return connections */}
          {returnEntries.slice(0, 2).map((retObj, index) => (
            <Accordion
              key={index}
              sx={{ borderRadius: "18px !important", mb: "24px" }}
            >
              {/* ... AccordionSummary and AccordionDetails ... */}
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    padding: "20px",
                    marginLeft: "-20px",
                    marginRight: "-20px",
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                  }}
                >
                  <Box
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#4992FF",
                      borderRadius: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Rueckreise
                        style={{
                          strokeWidth: 0.1,
                          stroke: "#FFFFFF",
                          fill: "#FFFFFF",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>
                    <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                      {_getReturnText(index)}
                    </Typography>
                    {/* {console.log("retObj duration in minutes:",retObj.connection_duration_minutes)}
                            {console.log("retObj duration in minutes:",retObj.connection_departure_datetime)} */}
                    {/* {console.log("retObj return_no_of_transfers:",retObj.return_no_of_transfers)} */}
                    {getReturnText(retObj)}
                  </Box>
                  <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                    <Shuffle
                      style={{
                        strokeWidth: 0.3,
                        stroke: "#4992FF",
                        fill: "#4992FF",
                        width: "18px",
                        height: "18px",
                      }}
                    />
                  </Box>
                  <Box sx={{ position: "absolute", right: 41, top: 20 }}>
                    <Box
                      sx={{
                        color: "#4992FF",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "16px",
                      }}
                    >
                      {" "}
                      {getNumberOfTransfers(
                        retObj,
                        "return_no_of_transfers"
                      )}{" "}
                      {t('details.umstiege')}
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {/* {console.log(
                  "return -> part 1 / twoReturns[index]",
                  twoReturns[index]
                )}
                {console.log("return -> part 2 / retObj:", retObj)} */}
                <Timeline>
                  {createReturnEntries(twoReturns[index], retObj)}
                </Timeline>
              </AccordionDetails>
            </Accordion>
          ))}
          {/* more return connections rendered */}
          {getMore &&
            returnEntries.slice(2).map((retObj, index) => (
              <Accordion
                key={index}
                sx={{ borderRadius: "18px !important", mb: "24px" }}
              >
                {/* ... AccordionSummary and AccordionDetails ... */}
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      padding: "20px",
                      marginLeft: "-20px",
                      marginRight: "-20px",
                      display: "flex",
                      flexDirection: "row",
                      position: "relative",
                    }}
                  >
                    <Box
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#4992FF",
                        borderRadius: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
                        <Rueckreise
                          style={{
                            strokeWidth: 0.1,
                            stroke: "#FFFFFF",
                            fill: "#FFFFFF",
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>
                      <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                        {_getReturnText(index+2)}
                      </Typography>
                      {/* {console.log("retObj duration in minutes:",retObj.connection_duration_minutes)}
                            {console.log("retObj duration in minutes:",retObj.connection_departure_datetime)} */}
                      {/* {console.log("retObj return_no_of_transfers:",retObj.return_no_of_transfers)} */}
                      {getReturnText(retObj)}
                    </Box>
                    <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                      <Shuffle
                        style={{
                          strokeWidth: 0.3,
                          stroke: "#4992FF",
                          fill: "#4992FF",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    </Box>
                    <Box sx={{ position: "absolute", right: 41, top: 20 }}>
                      <Box
                        sx={{
                          color: "#4992FF",
                          fontSize: "16px",
                          fontWeight: 600,
                          lineHeight: "16px",
                        }}
                      >
                        {" "}
                        {getNumberOfTransfers(
                          retObj,
                          "return_no_of_transfers"
                        )}{" "}
                        {t('details.umstiege')}
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Timeline>
                    {createReturnEntries(remainingReturns[index+2], retObj )}
                  </Timeline>
                </AccordionDetails>
              </Accordion>
            ))}

          {/* Button for more connections */}
          {!getMore && (returnEntries.length > 0) && 
          (
            <Accordion
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              {/* ... Box with text and onClick ... */}
              <Box
                sx={{
                  marginBottom: 3,
                  marginTop: 0,
                  marginLeft: 2,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={addMoreConnections}
              >
                <Typography
                  color="rgba(0, 0, 0, 0.56)"
                  textAlign="center"
                  fontFamily="Open Sans"
                  fontSize="14.25px"
                  fontWeight={600}
                  lineHeight="22px"
                  sx={{ textDecoration: "underline" }}
                >
                  {returnEntries.length} {" "}
                  {t("Details.rückreise_moeglichkeiten")}
                </Typography>
              </Box>
            </Accordion>
          )}
        </Fragment>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
