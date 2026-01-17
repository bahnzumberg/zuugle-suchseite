import { Fragment, JSX } from "react";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { convertNumToTime } from "../../utils/globals";
import { useIsMobile } from "../../utils/muiUtils";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Box from "@mui/material/Box";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import MyTimeLineDot from "./MyTimeLineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import {
  ArrivalJSON,
  Connection,
  ConnectionJSON,
  ConnectionType,
  DepartureJSON,
  TransferJSON,
} from "../../models/Connections";
import { t } from "i18next";
import { CustomIcon } from "../../icons/CustomIcon";

dayjs.extend(duration);

export const DepartureText = ({
  connection,
}: {
  connection: Connection | null;
}) => {
  const isMobile = useIsMobile();

  if (!connection) {
    return <Fragment></Fragment>;
  }

  const depTime = connection.connection_departure_datetime.slice(11, 16);

  const departureText =
    connection.connection_duration_minutes === 0
      ? dayjs(connection.connection_departure_datetime).format("DD.MM HH:mm")
      : `${depTime} - ${dayjs(connection.connection_arrival_datetime).format(
          "HH:mm",
        )}`;

  return (
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
      {departureText}
    </Typography>
  );
};

export const getReturnText = (connection: Connection) => {
  if (!connection) {
    return <Fragment></Fragment>;
  }
  const retDepTime = connection.return_departure_datetime.slice(11, 16);
  const returnText =
    connection.return_duration_minutes === 0
      ? dayjs(connection.return_departure_datetime).format("DD.MM HH:mm")
      : `${retDepTime} - ${dayjs(connection.return_arrival_datetime).format(
          "HH:mm",
        )}`;

  return returnText;
};

export const getNumberOfTransfers = (
  connection: Connection | null,
  field:
    | "return_no_of_transfers"
    | "connection_no_of_transfers" = "connection_no_of_transfers",
) => {
  if (!connection) {
    return "";
  }
  return connection[field];
};

// Transport icons
const transportIcons: Record<string, JSX.Element> = {
  train_key: (
    <CustomIcon
      name="transportTrain"
      style={{ strokeWidth: 0.8, stroke: "#4992FF" }}
    />
  ),
  metro_key: (
    <CustomIcon
      name="transportTrain"
      style={{ strokeWidth: 0.8, stroke: "#4992FF" }}
    />
  ),
  tram_key: (
    <CustomIcon name="tram" style={{ strokeWidth: 0.8, stroke: "#4992FF" }} />
  ),
  bus_key: (
    <CustomIcon
      name="transportBus"
      style={{ strokeWidth: 0.8, stroke: "#4992FF" }}
    />
  ),
  car_key: (
    <CustomIcon
      name="car"
      style={{
        strokeWidth: 2,
        stroke: "#4992FF",
        width: "24px",
        height: "24px",
      }}
    />
  ),
  cableCar_key: (
    <CustomIcon
      name="seilbahn"
      style={{
        strokeWidth: 2,
        stroke: "#4992FF",
        width: "24px",
        height: "24px",
      }}
    />
  ),
  transfer_key: <CustomIcon name="shuffleBlack" style={{ strokeWidth: 0.8 }} />,
  walk: (
    <CustomIcon
      name="transportWalk"
      style={{ strokeWidth: 0.8, stroke: "#4992FF" }}
    />
  ),
};

function getIconForConnectionDescriptionEntry(
  entry: ConnectionJSON | TransferJSON,
) {
  if (entry.T === "C") {
    switch (entry.CT) {
      case ConnectionType.TRAIN:
        return transportIcons["train_key"];
      case ConnectionType.BUS:
        return transportIcons["bus_key"];
      case ConnectionType.TRAM:
        return transportIcons["tram_key"];
      case ConnectionType.SUBWAY:
        return transportIcons["metro_key"];
      case ConnectionType.CABLE_CAR:
        return transportIcons["cableCar_key"];
      case ConnectionType.TAXI:
        return transportIcons["car_key"];
      default:
        return transportIcons["walk"];
    }
  } else if (entry.T === "T") {
    return transportIcons["transfer_key"];
  }
}

const connectionTypes: Record<number, string> = {
  1: "details.zug",
  2: "details.bus",
  3: "details.strassenbahn",
  4: "details.u_bahn",
  5: "details.einschienenbahn",
  6: "details.zahnradbahn",
  7: "details.standseilbahn",
  8: "details.seilbahn",
  9: "details.faehre",
  10: "details.taxi",
  20: "details.verschiedenes",
};

function getTextForConnectionDescriptionEntry(
  entry: ConnectionJSON | TransferJSON,
) {
  if (entry.T === "C") {
    const connectionType = connectionTypes[entry.CT];
    return `${t("details.std_mit_nach", { CD: entry.CD, connectionType: t(connectionType), CN: entry.CN })}`;
  } else if (entry.T === "T") {
    return `${t("details.std_umstiegszeit", { TD: entry.TD })}`;
  }
}

function convertTimeToMinutes(timeString: string) {
  // String in Teile zerlegen
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  // Berechnung der Gesamtminuten
  const totalMinutes = hours * 60 + minutes + seconds / 60;
  return totalMinutes;
}

export function convertTimeToHHMM(timeString: string) {
  // String in Teile zerlegen
  const parts = timeString.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);

  // Stunden und Minuten formatieren
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return formattedTime;
}
export const formatDuration = (duration: number) => {
  let _time = duration ? convertNumToTime(duration, true) : " ";
  _time = _time.replace(/\s*h\s*$/, "");
  return _time;
};

export const createReturnEntries = (connection: Connection) => {
  const timelineItems = [];
  const entries = connection.return_description_json;
  let newStart = dayjs(connection.return_departure_datetime).format("HH:mm");

  if (connection.fromtour_track_duration) {
    newStart = dayjs(connection.return_departure_datetime)
      .subtract(convertTimeToMinutes(connection.fromtour_track_duration), "m")
      .format("HH:mm");
  }

  timelineItems.push(
    getDepartureEntry(
      { T: "D", DT: newStart, DS: t("details.ankunft_bei_tourende") },
      "departure-start",
    ),
  );

  if (connection.fromtour_track_duration) {
    timelineItems.push(
      walkToFromEntry(
        `${t("details.std_rueckstiegsdauer_vom_touren_endpunkt", { from_tour_track_duration: convertTimeToHHMM(connection.fromtour_track_duration) })}`,
        "from-tour-duration",
      ),
    );
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.T === "C" || entry.T === "T") {
      timelineItems.push(getDetailEntry(entry, `detail-${i}`));
    } else {
      timelineItems.push(
        getStationEntry(entry, i + 1 === entries.length, `station-${i}`),
      );
    }
  }

  return timelineItems;
};

export const createEntries = (connection: Connection | null) => {
  if (!connection) {
    return [];
  }
  const timelineItems = [];
  const entries = connection.connection_description_json;
  if (entries.length > 0 && entries[0].T === "D") {
    timelineItems.push(getDepartureEntry(entries[0], "departure-first"));
  }
  for (let i = 1; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.T === "C" || entry.T === "T") {
      timelineItems.push(getDetailEntry(entry, `detail-${i}`));
    } else {
      timelineItems.push(getStationEntry(entry, false, `station-${i}`));
    }
  }
  let newStart = "     ";
  if (connection?.totour_track_duration) {
    timelineItems.push(
      walkToFromEntry(
        `${t("details.std_zustiegsdauer_zum_touren_ausgangspunkt", { totour_track_duration: convertTimeToHHMM(connection.totour_track_duration) })}`,
        "to-tour-duration",
      ),
    );
    newStart = dayjs(connection.connection_arrival_datetime)
      .add(convertTimeToMinutes(connection["totour_track_duration"]), "m")
      .format("HH:mm");
  }
  timelineItems.push(
    getArrivalEntry(
      { T: "A", AT: newStart, AS: t("details.ankunft_bei_tourstart") },
      "arrival-end",
    ),
  );

  return timelineItems;
};

export const getDetailEntry = (
  entry: ConnectionJSON | TransferJSON,
  key: string,
) => {
  return (
    <TimelineItem key={key}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
        className={"timeline-opposite-container"}
      >
        <div>{getIconForConnectionDescriptionEntry(entry)}</div>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          borderTop: "1px solid #EAEAEA",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <Typography
          variant={"text"}
          color={"#8B8B8B"}
          sx={{ fontSize: "14px", lineHeight: "16px" }}
        >
          {getTextForConnectionDescriptionEntry(entry)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export const getStationEntry = (
  entry: DepartureJSON | ArrivalJSON,
  isLast = false,
  key: string,
) => {
  return (
    <TimelineItem sx={{ minHeight: 0 }} key={key}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{
          flex: 0.2,
          paddingTop: isLast ? "24px" : "0px",
          lineHeight: "14px",
          paddingBottom: isLast ? "0px" : "24px",
        }}
        className={"timeline-opposite-container"}
      >
        <Box sx={{ color: "#101010", fontSize: "14px" }}>
          {entry.T === "D" ? entry.DT : entry.AT}
        </Box>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        {isLast ? (
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
          paddingTop: isLast ? "24px" : "0px",
          lineHeight: "16px",
          paddingBottom: isLast ? "0px" : "24px",
          color: "#101010",
        }}
      >
        {entry.T === "D" ? entry.DS : entry.AS}
      </TimelineContent>
    </TimelineItem>
  );
};

export const walkToFromEntry = (text: string, key: string) => {
  return (
    <TimelineItem key={key}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ flex: 0.2, marginTop: "auto", marginBottom: "auto" }}
        className={"timeline-opposite-container"}
      >
        <div>{transportIcons["walk"]}</div>
      </TimelineOppositeContent>
      <TimelineSeparator sx={{ minWidth: "12px" }}>
        <TimelineConnector sx={{ backgroundColor: "#4992FF", width: "3px" }} />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          borderTop: "1px solid #EAEAEA",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <Typography
          variant={"text"}
          color={"#8B8B8B"}
          sx={{ fontSize: "14px", lineHeight: "16px" }}
        >
          {text}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export const getDepartureEntry = (entry: DepartureJSON, key: string) => {
  return (
    <TimelineItem sx={{ minHeight: 0 }} key={key}>
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
        <Box sx={{ color: "#101010", fontSize: "14px" }}>{entry.DT}</Box>
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
        {entry.DS}
      </TimelineContent>
    </TimelineItem>
  );
};

export const getArrivalEntry = (entry: ArrivalJSON, key: string) => {
  return (
    <TimelineItem sx={{ minHeight: 0 }} key={key}>
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
          {entry.AT}
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
          {entry.AS}
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};

export function formatToHHMM(durationString: string) {
  const parsedDuration = dayjs.duration(durationString);

  // Extract hours and minutes from the duration
  const hours = Math.floor(parsedDuration.asHours());
  const minutes = parsedDuration.minutes();

  // Format hours and minutes to HH:mm
  const formattedDuration = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;

  return formattedDuration;
}
