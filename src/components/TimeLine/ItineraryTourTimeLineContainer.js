import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Divider,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Anreise from "../../icons/Anreise";
import Rueckreise from "../../icons/Rueckreise";
import Überschreitung from "../../icons/Überschreitung";
import Shuffle from "../../icons/Shuffle";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    createEntries,
    createReturnEntries,
    GetDepartureText,
    getReturnText,
    getNumberOfTransfers
} from "./utils";
import { useTranslation } from 'react-i18next';
import { jsonToStringArray } from "../../utils/transformJson";
import useMediaQuery from "@mui/material/useMediaQuery";
import {convertNumToTime} from "../../utils/globals";
// import { useSearchParams , useParams } from "react-router-dom";
// import { hideModal, showModal } from "../../actions/modalActions";
// import FullScreenCityInput from "../../components/Search/FullScreenCityInput";



export default function ItineraryTourTimeLineContainer({
  connections,
  loading,
  duration,
  tour,
  city
}) {
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const [entries, setEntries] = useState([]); //PARSED array[of strings], related to only one object, a departure description
  const [returnEntries, setReturnEntries] = useState([]); //UNPARSED array[objects] with possibly a few return connections

  const [getMore, setGetMore] = useState(false);
  const [formattedDuration, setformattedDuration] = useState("n/a");
  const [city_selected, setCity_selected] = useState(true)

  // the following two vars filled by fcn extractReturns
  const twoReturns = []; 
  const remainingReturns = [];

  const { t } = useTranslation();


  // after the useEffect we have state "entries" being a strings array representing the connection details
  useEffect(() => {
    let settingEnt = jsonToStringArray(getSingleConnection(), "to", t);
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
    if (city ==='no-city'){
      setCity_selected(false);
    }
    else {
      setCity_selected(true);
    }
  }, [city]);


  useEffect(() => {
    if(!!duration && typeof(duration) == "string"){
      setformattedDuration(formatDuration(duration));
    }
  }, [duration]);
  
  //checks if there is a connections (object) and returns one extracted connection (object)
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
        
        if (index <= 1) {
          twoReturns[index] = jsonToStringArray(
            array[index],
            "from",
            t
          );
        }
  
        if (index > 1) {
          remainingReturns[index] = jsonToStringArray(
            array[index],
            "from",
            t
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
      {
      !city_selected ? (
        <>
        <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
          <p>{t("details.bitte_stadt_waehlen")}</p>
        </Typography>
        </>
      )
      :
        <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
          {" "}
          {t("details.keine_verbindungen")}{" "}
        </Typography>
      }
      </Box>


    );
  }

  const _getDepartureText = () => {
    let connection = getSingleConnection();
    if (!!!connection) {
      return <Fragment></Fragment>;
    }
    if (connection.connection_duration_minutes === 0) {
      return t("details.start_ausgangort");
    } else {
      return `${t("Details.beste_anreise_kurz")}  (${convertNumToTime(connection.connection_duration_minutes / 60, true)})`;
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
          {/* ... first accordion ... */}
          <Accordion sx={{ borderRadius: "18px !important" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  marginLeft: "-20px",
                  marginRight: "-20px",
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  width: !isMobile ? '100%' : 'calc(100% - 10px)',
                  boxSizing: 'border-box',
                  margin: !isMobile  && "0 auto", // Center horizontally if mobile
                  // maxWidth: "260px",
                }}
              >
                <Box
                  style={{
                    width: !isMobile ? "40px" : "30",
                    height: !isMobile ? "40px" : "30",
                    backgroundColor: "#4992FF",
                    borderRadius: !isMobile ? "12px" : "8px",
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
                    <Anreise    /* icon */
                      style={{
                        strokeWidth: 0.1,
                        stroke: "#FFFFFF",
                        fill: "#FFFFFF",
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ paddingLeft: "10px", textAlign: "left" }}> 
                  <Typography sx={{ lineHeight: !isMobile ? "18px" : "14px", fontWeight: 500, fontSize: "14px", color:"#8B8B8B"  }}>
                    {_getDepartureText()}
                  </Typography>
                    {GetDepartureText(getSingleConnection(), t)}
                </Box>
                <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                  <Shuffle
                    style={{
                      strokeWidth: 0.3,
                      stroke: "#4992FF",
                      fill: "#4992FF",
                      width: !isMobile ? "18px" : "16px",
                      height:!isMobile ? "18px" : "16px",
                    }}
                  />
                </Box>
                <Box sx={{ position: "absolute", right: 41, top: 20 }}>
                  <Box
                    sx={{
                      color: "#4992FF",
                      fontSize: !isMobile ? "16px" : "14px",
                      fontWeight: 600,
                      lineHeight: !isMobile ? "16px" : "14px",
                    }}
                  >
                    {getNumberOfTransfers(getSingleConnection())} {t('details.umstiege')}
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Timeline>
                {createEntries(entries, getSingleConnection(), t )}
              </Timeline>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ mt: "24px" }} />

          {/* 2nd Accordion / return connections */}
          <Accordion  //border-radius needed here ?
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
                  width: !isMobile ? '100%' : 'calc(100% - 10px)',
                  boxSizing: 'border-box',
                  margin: !isMobile  && "0 auto", // Center horizontally if mobile
                }}
              >
                <Box
                  style={{
                    width: !isMobile ? "40px" : "30",
                    height: !isMobile ? "40px" : "30",
                    backgroundColor: "#FF7663",
                    borderRadius: !isMobile ? "12px" : "8px",
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
                <Box sx={{ paddingLeft: "20px", textAlign: "left" }}> {/* TODO : padding value is appropriate? */}
                  <Typography sx={{ lineHeight: !isMobile ? "16px" : "14px", fontWeight: !isMobile ? 600 : 500 }}>
                  {t('details.circa')} {" "}
                  {(tour?.number_of_days > 1) ? (tour?.number_of_days + " " + t('details.tage')) : 
                  `${formattedDuration} ${t('details.stunden_tour')}`}
                  </Typography>
                  <Typography sx={{ lineHeight: !isMobile ? "16px" : "14px", fontWeight: !isMobile ? 600 : 500 }}>
                  {t('details.lt_tourbeschreibung')}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          
          <Divider sx={{ mb: "24px" }} />
          {/* Rendering first 2 return connections */}
          {returnEntries.slice(0, 2).map((retObj, index) => (
            
            
            //3rd Accordion / additional return connections 
            <Accordion
              key={index}
              sx={{ borderRadius: "18px !important", mb: "24px" }} // TODO :check the 24px mb for mobile
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    marginLeft: "-20px",
                    marginRight: "-20px",
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                    width: !isMobile ? '100%' : 'calc(100% - 10px)',
                    boxSizing: 'border-box',
                    margin: !isMobile  && "0 auto", // Center horizontally if mobile
                  }}
                >
                  <Box
                    style={{
                      width: !isMobile ? "40px" : "30",
                      height:!isMobile ? "40px" : "30",
                      backgroundColor: "#4992FF",
                      borderRadius: !isMobile ? "12px" : "8px",
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
                  <Box sx={{ paddingLeft: "10px", textAlign: "left" }}> {/* TODO padding value is appropriate? */}
                    <Typography sx={{ lineHeight:!isMobile ? "16px" : "14px", fontWeight: !isMobile ? 600 : 500 }}>
                      {_getReturnText(index)}
                    </Typography>
                    {getReturnText(retObj, t)}
                  </Box>
                  <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                    <Shuffle
                      style={{
                        strokeWidth: 0.3,
                        stroke: "#4992FF",
                        fill: "#4992FF",
                        width: !isMobile ? "18px" : "16px",
                        height: !isMobile ? "18px" : "16px",
                      }}
                    />
                  </Box>
                  <Box sx={{ position: "absolute", right: 41, top: 20 }}>
                    <Box
                      sx={{
                        color: "#4992FF",
                        fontSize: !isMobile ? "16px" : "14px",
                        fontWeight: !isMobile ? 600 : 500,
                        lineHeight: !isMobile ? "16px" : "14px",
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
                  {createReturnEntries(twoReturns[index], retObj,t)}
                </Timeline>
              </AccordionDetails>
            </Accordion>
          ))}
          {/* more return connections rendered */}
          {getMore &&
            returnEntries.slice(2).map((retObj, index) => (
              <Accordion
                key={index}
                sx={{ borderRadius: "18px !important", mb: "24px" }} // TODO :check the 24px mb for mobile
              >
                {/* ... AccordionSummary and AccordionDetails ... */}
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      marginLeft: "-20px",
                      marginRight: "-20px",
                      display: "flex",
                      flexDirection: "row",
                      position: "relative",
                      width: !isMobile ? '100%' : 'calc(100% - 10px)',
                      boxSizing: 'border-box',
                      margin: !isMobile  && "0 auto", // Center horizontally if mobile
                    }}
                  >
                    <Box
                      style={{
                        width: !isMobile ? "40px" : "30",
                        height: !isMobile ? "40px" : "30",
                        backgroundColor: "#4992FF",
                        borderRadius: !isMobile ? "12px" : "8px",
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
                    <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>{/* TODO padding value is appropriate? */}
                      <Typography 
                        sx={{ 
                          lineHeight: !isMobile ? "16px" : "14px", fontWeight: !isMobile ? 600 : 500 
                        }}>
                        {_getReturnText(index+2)}
                      </Typography>
                      {getReturnText(retObj, t )}
                    </Box>
                    <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                      <Shuffle
                        style={{
                          strokeWidth: 0.3,
                          stroke: "#4992FF",
                          fill: "#4992FF",
                          width: !isMobile ? "18px" : "16px",
                          height: !isMobile ? "18px" : "16px",  
                        }}
                      />
                    </Box>
                    <Box sx={{ position: "absolute", right: 41, top: 20 }}>
                      <Box
                        sx={{
                          color: "#4992FF",
                          fontSize: !isMobile ? "16px" : "14px",
                          fontWeight: !isMobile ? 600 : 500,
                          lineHeight: !isMobile ? "16px" : "14px",
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
                    {createReturnEntries(remainingReturns[index+2], retObj, t )}
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
                  fontSize={!isMobile ? "14.25px" : "12.47px"}
                  fontWeight={!isMobile ? 600 : 500}
                  lineHeight={!isMobile ? "22px" : "19.25px"}
                  sx={{ textDecoration: "underline",
                        fontFamily: `"Open Sans", "Helvetica", "Arial", sans-serif`
                   }}
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
