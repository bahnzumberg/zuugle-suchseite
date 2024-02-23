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

export default function ItineraryTourTimeLineContainer({
  connections,
  loading,
  duration,
  tour
}) {
  
  const [entries, setEntries] = useState([]); //PARSED array[strings] only one object, a departure description
  const [returnEntries, setReturnEntries] = useState([]); //UNPARSED array[objects] with possibly a few return connections

  const [getMore, setGetMore] = useState(false);
  const [formattedDuration, setformattedDuration] = useState("n/a");

  // the following two vars filled by fcn extractReturns
  const twoReturns = []; 
  const remainingReturns = [];

  const { t } = useTranslation();

  // after the useEffect we have state "entries" being a strings array representing the connection details
  useEffect(() => {
    let settingEnt = parseTourConnectionDescription(getSingleConnection());
    setEntries(settingEnt);
    setReturnEntries(connections.returns);
    extractReturns();
  }, [connections]);
  
  const formatDuration = (duration) => { 
    
    let _time = " ";
    _time = !!duration && convertNumToTime(duration, true);
    _time = _time.replace(/\s*h\s*$/, '');
    return _time;
  }

  useEffect(() => {
    if(!!duration && typeof(duration) == "string"){
      setformattedDuration(formatDuration(duration));
    }
  }, [duration]);
  
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
        //when index is 0 or 1 -> fill array twoReturns BUT use  parseTourConnectionDescription
        if (index <= 1) {
          twoReturns[index] = parseTourConnectionDescription(
            array[index],
            "return_description_detail"
          );
        }
        //when index is > 1 -> fill array remainingReturns
        if (index > 1) {
          remainingReturns[index] = parseTourConnectionDescription(
            array[index],
            "return_description_detail"
          );
        }
      }
      return;
    }
    return null;
  };
  extractReturns();

  //when connections/connections.connections/or connections.connections[0] do not exist
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
      return t("Details.beste_anreise_kurz");
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
              <Timeline>
                {createEntries(entries, getSingleConnection())}
              </Timeline>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ mt: "24px" }} />
          <Accordion
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <AccordionDetails>
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
                  {t('details.circa')} {" "}
                  {(tour?.number_of_days > 1) ? (tour?.number_of_days + " " + t('details.tage')) : 
                  `${formattedDuration} ${t('details.stunden_tour')}`}
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
          {!getMore && (returnEntries.length > 2) && 
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
                  {returnEntries.length - 2} {" "}
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
