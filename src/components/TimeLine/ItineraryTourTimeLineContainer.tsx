import Timeline from "@mui/lab/Timeline";
import Box from "@mui/material/Box";
import { Fragment, useState } from "react";
import {
  getReturnText,
  getNumberOfTransfers,
  formatDuration,
  createEntries,
  createReturnEntries,
  getDepartureText,
} from "./utils";
import { useTranslation } from "react-i18next";
import { simpleConvertNumToTime } from "../../utils/globals";
import { Tour } from "../../models/Tour";
import { Connection, ConnectionResult } from "../../models/Connections";
import { CustomIcon } from "../../icons/CustomIcon";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import Divider from "@mui/material/Divider";
import ItineraryAccordionSummary from "./ItineraryAccordionSummary";

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
      return "";
    }
    if (connection.connection_duration_minutes === 0) {
      return t("details.start_ausgangort");
    } else {
      return `${t("Details.beste_anreise_kurz")}  (${simpleConvertNumToTime(connection.connection_duration_minutes / 60)})`;
    }
  };

  const _getReturnText = (index: number, connection: Connection) => {
    if (connection.return_duration_minutes) {
      return `${t("Details.rückreise")} ${index + 1}  (${simpleConvertNumToTime(connection.return_duration_minutes / 60)})`;
    } else {
      return "";
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
              <ItineraryAccordionSummary
                iconName="anreise"
                text1={_getDepartureText()}
                text2={getDepartureText(getSingleConnection())}
                numberOfTransfers={getNumberOfTransfers(getSingleConnection())}
              />
              <AccordionDetails>
                <Timeline position="right">
                  {createEntries(getSingleConnection())}
                </Timeline>
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ mt: "24px" }} />

            {/* 2nd Accordion - the tour itself*/}
            <Accordion
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
              key="duration-accordion"
            >
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    py: "10px",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      backgroundColor: "#FF7663",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
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
                  <Box sx={{ textAlign: "left" }}>
                    <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
                      {t("details.circa")}{" "}
                      {tour?.number_of_days > 1
                        ? tour?.number_of_days + " " + t("details.tage")
                        : `${formattedDuration} ${t("details.stunden_tour")}`}
                    </Typography>
                    <Typography sx={{ lineHeight: "16px", fontWeight: 600 }}>
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
                <ItineraryAccordionSummary
                  iconName="rückreise"
                  text1={_getReturnText(index, connection)}
                  text2={getReturnText(connection)}
                  numberOfTransfers={getNumberOfTransfers(
                    connection,
                    "return_no_of_transfers",
                  )}
                />
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
                  <ItineraryAccordionSummary
                    iconName="rückreise"
                    text1={_getReturnText(index + 2, connection)}
                    text2={getReturnText(connection)}
                    numberOfTransfers={getNumberOfTransfers(
                      connection,
                      "return_no_of_transfers",
                    )}
                  />
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
                    sx={{
                      fontSize: { xs: "12px", sm: "14px" },
                      fontWeight: 600,
                      lineHeight: { xs: "19px", sm: "22px" },
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
