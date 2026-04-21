import Timeline from "@mui/lab/Timeline";
import Box from "@mui/material/Box";
import { Fragment, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DepartureText,
  getReturnText,
  getNumberOfTransfers,
  formatDuration,
  createEntries,
  createReturnEntries,
} from "./utils";
import { useTranslation } from "react-i18next";
import { simpleConvertNumToTime } from "../../utils/globals";
import { useIsMobile } from "../../utils/muiUtils";
import { Tour } from "../../models/Tour";
import { Connection, ConnectionResult } from "../../models/Connections";
import { CustomIcon } from "../../icons/CustomIcon";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import Divider from "@mui/material/Divider";

export interface ItineraryTourTimeLineContainerProps {
  connections: ConnectionResult[] | undefined;
  tour: Tour;
  dateIndex: number;
}

export default function ItineraryTourTimeLineContainer({
  connections,
  tour,
  dateIndex,
}: ItineraryTourTimeLineContainerProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const connectionsForDate = !connections ? undefined : connections[dateIndex];
  const noConnectionsForDate =
    !connectionsForDate || connectionsForDate.connections.length === 0;
  const [getMore, setGetMore] = useState(false);

  const formattedDuration =
    !!tour?.duration && typeof tour.duration === "string"
      ? formatDuration(Number(tour.duration))
      : "n/a";

  //checks if there is a connections (object) and returns one extracted connection (object)
  const getSingleConnection = () => {
    if (!noConnectionsForDate) {
      return connectionsForDate.connections[0];
    } else return null;
  };

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

  if (noConnectionsForDate) {
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
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#101010",
              lineHeight: "20px",
            }}
          >
            {t("details.keine_verbindungen")}
          </Typography>
        </Box>
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
        {getSingleConnection() && (
          <Fragment>
            {/* ... first accordion ... */}
            <Accordion
              sx={{ borderRadius: "18px !important" }}
              key="departure-accordion"
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
                      <CustomIcon
                        name="anreise"
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
                    <DepartureText connection={getSingleConnection()} />
                  </Box>
                  <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                    <CustomIcon
                      name="shuffle"
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
                <Timeline position="right">
                  {createEntries(getSingleConnection())}
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
              key="duration-accordion"
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
                      <CustomIcon
                        name="überschreitung"
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
            {connectionsForDate.returns.slice(0, 2).map((connection, index) => (
              //3rd Accordion / additional return connections
              <Accordion
                key={`return-connection-${index}`}
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
                        <CustomIcon
                          name="rückreise"
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
                        {_getReturnText(index, connection)}
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
                        {getReturnText(connection)}
                      </Typography>
                    </Box>
                    <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                      <CustomIcon
                        name="shuffle"
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
                          connection,
                          "return_no_of_transfers",
                        )}{" "}
                        {t("details.umstiege")}
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Timeline position="right">
                    {createReturnEntries(connection)}
                  </Timeline>
                </AccordionDetails>
              </Accordion>
            ))}
            {/* more return connections rendered */}
            {getMore &&
              connectionsForDate.returns.slice(2).map((connection, index) => (
                <Accordion
                  key={`more-return-connection-${index}`}
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
                          <CustomIcon
                            name="rückreise"
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
                          {_getReturnText(index + 2, connection)}
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
                          {getReturnText(connection)}
                        </Typography>
                      </Box>
                      <Box sx={{ position: "absolute", right: 20, top: 20 }}>
                        <CustomIcon
                          name="shuffle"
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
                            connection,
                            "return_no_of_transfers",
                          )}{" "}
                          {t("details.umstiege")}
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Timeline position="right">
                      {createReturnEntries(connection)}
                    </Timeline>
                  </AccordionDetails>
                </Accordion>
              ))}

            {/* Button for more connections */}
            {!getMore && connectionsForDate.returns.length > 2 && (
              <Accordion
                sx={{ backgroundColor: "transparent", boxShadow: "none" }}
                key="more-connections-button"
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
                    {connectionsForDate.returns.length - 2}{" "}
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
