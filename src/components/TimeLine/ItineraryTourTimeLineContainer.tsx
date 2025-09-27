import Timeline from "@mui/lab/Timeline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
  Link,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Fragment, useEffect, useState } from "react";
import Anreise from "../../icons/Anreise";
import Rueckreise from "../../icons/Rueckreise";
import Überschreitung from "../../icons/Überschreitung";
import Shuffle from "../../icons/Shuffle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  createEntries,
  createReturnEntries,
  GetDepartureText,
  getReturnText,
  getNumberOfTransfers,
} from "./utils";
import { useTranslation } from "react-i18next";
import { jsonToStringArray } from "../../utils/transformJson";
import {
  convertNumToTime,
  simpleConvertNumToTime,
  randomKey,
  useIsMobile,
} from "../../utils/globals";
import { useGetCitiesQuery } from "../../features/apiSlice";
import { Tour } from "../../models/Tour";
import { Connection, ConnectionResult } from "../../models/Connections";

export interface ItineraryTourTimeLineContainerProps {
  connections: ConnectionResult[] | undefined;
  loading: boolean;
  duration: string;
  tour: Tour;
  city: string | undefined;
  dateIndex: number;
  idOne: string | undefined;
}

export default function ItineraryTourTimeLineContainer({
  connections,
  loading,
  duration,
  tour,
  city,
  dateIndex,
  idOne,
}: ItineraryTourTimeLineContainerProps) {
  const connectionsForDate =
    !city || !connections ? undefined : connections[dateIndex];
  //set connections to single one
  const { data: cities = [] } = useGetCitiesQuery();

  const emptyConnArray =
    !connectionsForDate || connectionsForDate.connections.length === 0;

  const isMobile = useIsMobile();

  const [entries, setEntries] = useState<string[]>([]); //PARSED array[of strings], related to only one object, a departure description
  const [returnEntries, setReturnEntries] = useState<Connection[]>([]); //UNPARSED array[objects] with possibly a few return connections

  const [getMore, setGetMore] = useState(false);
  const [formattedDuration, setformattedDuration] = useState("n/a");
  const [city_selected, setCity_selected] = useState(true);

  // the following two vars filled by fcn extractReturns
  const twoReturns: string[][] = [];
  const remainingReturns: string[][] = [];

  const { t } = useTranslation();

  // after the useEffect we have state "entries" being a strings array representing the connection details
  useEffect(() => {
    if (!emptyConnArray) {
      const settingEnt = jsonToStringArray(getSingleConnection(), "to");
      setEntries(settingEnt);
      setReturnEntries(connectionsForDate.returns);
      extractReturns();
    }
  }, [connectionsForDate]);

  useEffect(() => {
    if (!city) {
      setCity_selected(false);
    } else {
      setCity_selected(true);
    }
  }, [city]);

  useEffect(() => {
    if (!!duration && typeof duration == "string") {
      setformattedDuration(formatDuration(Number(duration)));
    }
  }, [duration]);

  const formatDuration = (duration: number) => {
    let _time = duration ? convertNumToTime(duration, true) : " ";
    _time = _time.replace(/\s*h\s*$/, "");
    return _time;
  };

  //checks if there is a connections (object) and returns one extracted connection (object)
  const getSingleConnection = () => {
    if (!emptyConnArray) {
      return connectionsForDate.connections[0];
    } else return null;
  };

  //check if there are return connections and fill twoReturns / remainingReturns
  const extractReturns = () => {
    if (connectionsForDate?.returns && connectionsForDate.returns.length > 0) {
      const array = connectionsForDate.returns;
      for (let index = 0; index < array.length; index++) {
        if (index <= 1) {
          twoReturns[index] = jsonToStringArray(array[index], "from");
        }

        if (index > 1) {
          remainingReturns[index] = jsonToStringArray(array[index], "from");
        }
      }
      return;
    }
    return null;
  };
  extractReturns();

  const _getDepartureText = () => {
    const connection = getSingleConnection();
    if (!connection) {
      return <Fragment></Fragment>;
    }
    if (connection.connection_duration_minutes === 0) {
      return t("details.start_ausgangort");
    } else {
      return `${t("Details.beste_anreise_kurz")}  (${simpleConvertNumToTime(connection.connection_duration_minutes / 60)})`;
    }
  };

  const _getReturnText = (index: number, retObj: Connection) => {
    if (retObj.return_duration_minutes) {
      return `${t("Details.rückreise")} ${index + 1}  (${simpleConvertNumToTime(retObj.return_duration_minutes / 60)})`;
    } else if (!retObj) {
      return <Fragment></Fragment>;
    }
  };

  const addMoreConnections = () => {
    setGetMore(true);
  };

  if (emptyConnArray) {
    return (
      <>
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            position: "relative",
            textAlign: "center",
          }}
        >
          {!city_selected ? (
            <>
              <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                {t("details.bitte_stadt_waehlen")}
              </Typography>
            </>
          ) : (
            <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
              {" "}
              {t("details.keine_verbindungen")}{" "}
            </Typography>
          )}
        </Box>
        {!city_selected && (
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px",
              position: "relative",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <List>
              {!!cities &&
                cities.map((_city) => {
                  return (
                    <Link
                      href={`/tour/${idOne}/${_city.value}`}
                      key={randomKey(7)}
                    >
                      <ListItem
                        key={randomKey(7)}
                        sx={{
                          borderRadius: "12px",
                          padding: "5px",
                          mb: "5px",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#EBEBEB",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ borderRadius: "11px", background: "#DDD" }}
                          >
                            <svg
                              width="22"
                              height="16"
                              viewBox="0 0 22 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.879883 1.29848C0.879883 0.872922 1.23279 0.52002 1.65834 0.52002H9.96193C13.5117 0.52002 16.2934 1.36076 18.2032 2.80351C20.1338 4.26701 21.1199 6.31177 21.1199 8.56412C21.1199 9.32183 20.8189 10.0484 20.2791 10.5777C19.7394 11.1175 19.0128 11.4185 18.2655 11.4185H1.65834C1.23279 11.4185 0.879883 11.0656 0.879883 10.64C0.879883 10.4428 0.952539 10.256 1.07709 10.121C0.952539 9.98611 0.879883 9.79928 0.879883 9.60207V1.29848ZM6.06963 2.07694H2.43681V5.70976H6.06963V2.07694ZM7.62655 5.70976V2.07694H9.96193C10.4083 2.07694 10.8442 2.08732 11.2594 2.11846V5.70976H7.62655ZM12.8163 5.70976V2.29491C14.7157 2.6063 16.1896 3.22907 17.2587 4.04905C17.9022 4.53688 18.4108 5.09737 18.7845 5.70976H12.8163ZM19.4176 7.26669C19.5111 7.68187 19.563 8.1178 19.563 8.56412C19.563 8.90664 19.428 9.23879 19.1789 9.47752C18.9402 9.71625 18.608 9.86156 18.2655 9.86156H2.39529C2.42643 9.77852 2.43681 9.69549 2.43681 9.60207V7.26669H19.4176Z"
                                fill="#101010"
                              />
                              <path
                                d="M1.65834 14.0134C1.23279 14.0134 0.879883 14.3663 0.879883 14.7918C0.879883 15.2174 1.23279 15.5703 1.65834 15.5703H20.3414C20.767 15.5703 21.1199 15.2174 21.1199 14.7918C21.1199 14.3663 20.767 14.0134 20.3414 14.0134H1.65834Z"
                                fill="#101010"
                              />
                            </svg>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={_city.label} />
                      </ListItem>
                    </Link>
                  );
                })}
            </List>
          </Box>
        )}
      </>
    );
  } else {
    return (
      <Box
        sx={{
          borderRadius: "16px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {!loading && getSingleConnection() && (
          <Fragment>
            {/* ... first accordion ... */}
            <Accordion
              sx={{ borderRadius: "18px !important" }}
              key={randomKey(7)}
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
                    width: !isMobile ? "100%" : "calc(100% - 10px)",
                    boxSizing: "border-box",
                    margin: !isMobile ? "0 auto" : "0 40px", // Center horizontally if mobile
                    maxWidth: isMobile ? "260px" : null,
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
                      <Anreise /* icon */
                        style={{
                          strokeWidth: 0.1,
                          stroke: "#FFFFFF",
                          fill: "#FFFFFF",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>
                    <Typography
                      sx={{
                        lineHeight: !isMobile ? "18px" : "14px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#8B8B8B",
                      }}
                    >
                      {_getDepartureText()}
                    </Typography>
                    {GetDepartureText(getSingleConnection())}
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
                        fontWeight: 600,
                        lineHeight: !isMobile ? "16px" : "14px",
                      }}
                    >
                      {getNumberOfTransfers(getSingleConnection())}{" "}
                      {t("details.umstiege")}
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Timeline key={randomKey(7)}>
                  {createEntries(entries, getSingleConnection())}
                </Timeline>
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ mt: "24px" }} />

            {/* 2nd Accordion / return connections */}
            <Accordion //border-radius needed here ?
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
              key={randomKey(7)}
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
                    width: !isMobile ? "100%" : "calc(100% - 10px)",
                    boxSizing: "border-box",
                    margin: "0 auto",
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
                  <Box sx={{ paddingLeft: "20px", textAlign: "left" }}>
                    {" "}
                    {/* TODO : padding value is appropriate? */}
                    <Typography
                      sx={{
                        lineHeight: !isMobile ? "16px" : "14px",
                        fontWeight: !isMobile ? 600 : 500,
                      }}
                    >
                      {t("details.circa")}{" "}
                      {tour?.number_of_days > 1
                        ? tour?.number_of_days + " " + t("details.tage")
                        : `${formattedDuration} ${t("details.stunden_tour")}`}
                    </Typography>
                    <Typography
                      sx={{
                        lineHeight: !isMobile ? "16px" : "14px",
                        fontWeight: !isMobile ? 600 : 500,
                      }}
                    >
                      {t("details.lt_tourbeschreibung")}
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
                key={randomKey(7)}
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
                      width: !isMobile ? "100%" : "calc(100% - 10px)",
                      boxSizing: "border-box",
                      margin: !isMobile ? "0 auto" : "0 40px", // Center horizontally if mobile
                      maxWidth: isMobile ? "260px" : null,
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
                    <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>
                      {" "}
                      {/* TODO padding value is appropriate? */}
                      <Typography
                        sx={{
                          lineHeight: !isMobile ? "18px" : "14px",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#8B8B8B",
                        }}
                      >
                        {_getReturnText(index, retObj)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#000000",
                          fontWeight: 500,
                          paddingTop: "3px",
                          width: "300px",
                          lineHeight: !isMobile ? "18px" : "16px",
                          fontSize: "20px",
                        }}
                      >
                        {getReturnText(retObj)}
                      </Typography>
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
                          "return_no_of_transfers",
                        )}{" "}
                        {t("details.umstiege")}
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
                  key={randomKey(7)}
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
                        width: !isMobile ? "100%" : "calc(100% - 10px)",
                        boxSizing: "border-box",
                        margin: !isMobile ? "0 auto" : "0 40px", // Center horizontally if mobile
                        maxWidth: isMobile ? "260px" : null,
                      }}
                      key={randomKey(7)}
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
                      <Box sx={{ paddingLeft: "10px", textAlign: "left" }}>
                        <Typography
                          sx={{
                            lineHeight: !isMobile ? "18px" : "14px",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#8B8B8B",
                          }}
                        >
                          {_getReturnText(index + 2, retObj)}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#000000",
                            fontWeight: 500,
                            paddingTop: "3px",
                            width: "300px",
                            lineHeight: !isMobile ? "18px" : "16px",
                            fontSize: "20px",
                          }}
                        >
                          {getReturnText(retObj)}
                        </Typography>
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
                            "return_no_of_transfers",
                          )}{" "}
                          {t("details.umstiege")}
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Timeline>
                      {createReturnEntries(remainingReturns[index + 2], retObj)}
                    </Timeline>
                  </AccordionDetails>
                </Accordion>
              ))}

            {/* Button for more connections */}
            {!getMore && returnEntries.length > 2 && (
              <Accordion
                sx={{ backgroundColor: "transparent", boxShadow: "none" }}
                key={randomKey(7)}
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
                    sx={{
                      textDecoration: "underline",
                      fontFamily: `"Open Sans", "Helvetica", "Arial", sans-serif`,
                    }}
                  >
                    {returnEntries.length - 2}{" "}
                    {t("Details.rückreise_moeglichkeiten")}
                  </Typography>
                </Box>
              </Accordion>
            )}
          </Fragment>
        )}
      </Box>
    );
  }
}
