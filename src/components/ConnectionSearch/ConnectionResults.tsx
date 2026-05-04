/**
 * ConnectionResults — Renders the Diana /connections API response.
 *
 * Structure (matching the reference screenshot):
 *   - Hinfahrt section: horizontal connection tabs + timeline
 *   - Activity summary box
 *   - Rückfahrt section: horizontal connection tabs + timeline
 */
import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import SubwayIcon from "@mui/icons-material/Subway";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HikingIcon from "@mui/icons-material/Hiking";
import HomeIcon from "@mui/icons-material/Home";
import PlaceIcon from "@mui/icons-material/Place";
import ParkIcon from "@mui/icons-material/Park";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CommuteIcon from "@mui/icons-material/Commute";
import { icons } from "../../icons/icons";
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────

interface ConnectionElement {
  from_location: string;
  to_location: string;
  departure_time: string;
  arrival_time: string;
  type: string; // "JNY" = journey, "TRSF" = transfer
  vehicle_name?: string;
  vehicle_type?: number;
  n_intermediate_stops?: number;
  direction?: string;
  platform_orig?: string;
  platform_dest?: string;
}

interface Connection {
  connection_id: number;
  connection_start_timestamp: string;
  connection_end_timestamp: string;
  connection_transfers: number;
  connection_elements: ConnectionElement[];
}

interface Activity {
  activity_name: string;
  activity_start_location_display_name?: string;
  activity_end_location_display_name?: string;
  activity_duration_minutes: number;
}

export interface ConnectionsResultData {
  activity: Activity;
  connections: {
    to_activity: Connection[];
    from_activity: Connection[];
    recommended_to_activity_connection: number;
    recommended_from_activity_connection: number;
  };
}

export interface CoordinateReplacement {
  lat: number | null;
  lon: number | null;
  displayName: string;
}

interface ConnectionResultsProps {
  data: ConnectionsResultData;
  coordinateReplacements?: CoordinateReplacement;
  tourDurationHours?: number;
}

// ─── Helpers ──────────────────────────────────────────────────

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("de-AT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Vienna",
  });
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Vienna",
  });
}

function calcDurationMinutes(start: string, end: string): number {
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
}

function formatDuration(minutes: number): string {
  if (!minutes || isNaN(minutes)) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${h}:${mm} h`;
}

/** Format decimal hours (e.g. 7.5 → "7:30 h") — same logic as convertNumToTime(n, true) */
function formatDurationFromHours(decimalHours: number): string {
  if (!decimalHours || isNaN(decimalHours)) return "-";
  const sign = decimalHours >= 0 ? 1 : -1;
  decimalHours = decimalHours * sign;
  const hour = Math.floor(decimalHours);
  let decpart = decimalHours - hour;
  const min = 1 / 60;
  decpart = min * Math.round(decpart / min);
  let minute = String(Math.floor(decpart * 60));
  if (minute.length < 2) minute = "0" + minute;
  return `${hour}:${minute} h`;
}

function transferLabel(n: number, t: (key: string) => string): string {
  if (n === 0) return t("details.direkt");
  if (n === 1) return `1 ${t("details.umstieg")}`;
  return `${n} ${t("details.umstiege")}`;
}

/**
 * Replace coordinate-based location names with human-readable names.
 * Diana API returns "(lat, lon)" when the user_start_location was coordinates.
 * We match those against the known departure coordinates and replace with
 * the display name from the autocomplete.
 */
function resolveLocationName(
  name: string,
  replacements?: CoordinateReplacement,
): string {
  if (!replacements?.lat || !replacements?.lon || !replacements?.displayName) {
    return name;
  }

  // Match patterns like "(47.3827, 15.0942)" or "(47.38, 15.09)"
  const coordPattern = /^\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/;
  const match = name.match(coordPattern);
  if (!match) return name;

  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);

  // Compare with a tolerance of ~100m
  const tolerance = 0.002;
  if (
    Math.abs(lat - replacements.lat) < tolerance &&
    Math.abs(lon - replacements.lon) < tolerance
  ) {
    return replacements.displayName;
  }

  return name;
}

/**
 * Vehicle type labels from Diana API documentation.
 * Keys: vehicle_type ID. Values: localized labels per language.
 */
const VEHICLE_TYPE_LABELS: Record<number, Record<string, string>> = {
  1: { de: "Zug", en: "Train", sl: "Vlak", it: "Treno", fr: "Train" },
  2: { de: "Bus", en: "Bus", sl: "Avtobus", it: "Bus", fr: "Bus" },
  3: {
    de: "Straßenbahn",
    en: "Tram",
    sl: "Tramvaj",
    it: "Tram",
    fr: "Tramway",
  },
  4: { de: "U-Bahn", en: "Subway", sl: "Metro", it: "Metro", fr: "Métro" },
  5: {
    de: "Einschienenbahn",
    en: "Monorail",
    sl: "Monorail",
    it: "Monorotaia",
    fr: "Monorail",
  },
  6: {
    de: "Zahnradbahn",
    en: "Cog Train",
    sl: "Zobna železnica",
    it: "Cremagliera",
    fr: "Crémaillère",
  },
  7: {
    de: "Standseilbahn",
    en: "Funicular",
    sl: "Funicular",
    it: "Funicolare",
    fr: "Funiculaire",
  },
  8: {
    de: "Seilbahn",
    en: "Aerial Lift",
    sl: "Žičnica",
    it: "Funivia",
    fr: "Téléporté",
  },
  9: { de: "Fähre", en: "Ferry", sl: "Trajekt", it: "Traghetto", fr: "Ferry" },
  10: { de: "Taxi", en: "Taxi", sl: "Taksi", it: "Taxi", fr: "Taxi" },
  20: {
    de: "Verschiedenes",
    en: "Miscellaneous",
    sl: "Raznovrsten",
    it: "Misto",
    fr: "Différents",
  },
  30: { de: "Haus", en: "House", sl: "Hiša", it: "Casa", fr: "Maison" },
  31: { de: "Straße", en: "Street", sl: "Ulica", it: "Strada", fr: "Rue" },
  32: { de: "Platz", en: "Square", sl: "Trg", it: "Piazza", fr: "Place" },
  33: { de: "Park", en: "Park", sl: "Park", it: "Parco", fr: "Parc" },
};

/**
 * Returns a SVG icon (from project assets) wrapped in a Tooltip with the
 * localized vehicle type label. Falls back to MUI icons for types without
 * a dedicated SVG asset.
 */
function VehicleIcon({
  vehicleType,
  lang,
}: {
  vehicleType?: number;
  lang: string;
}) {
  const labels =
    vehicleType !== undefined ? VEHICLE_TYPE_LABELS[vehicleType] : undefined;
  const shortLang = lang.substring(0, 2);
  const label = labels ? labels[shortLang] || labels["de"] : "";

  const svgStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    marginRight: "6px",
    flexShrink: 0,
    verticalAlign: "middle",
  };
  const muiSx = {
    fontSize: "20px",
    mr: "6px",
    verticalAlign: "middle",
    color: "#444",
  };

  let icon: React.ReactNode;
  switch (vehicleType) {
    case 1: // Zug
    case 5: // Einschienenbahn
    case 6: // Zahnradbahn
      icon = <icons.transportTrain style={svgStyle} />;
      break;
    case 2: // Bus
      icon = <icons.transportBus style={svgStyle} />;
      break;
    case 3: // Straßenbahn
      icon = <icons.tram style={svgStyle} />;
      break;
    case 7: // Standseilbahn
    case 8: // Seilbahn
      icon = <icons.seilbahn style={svgStyle} />;
      break;
    case 4:
      icon = <SubwayIcon sx={muiSx} />;
      break;
    case 9:
      icon = <DirectionsBoatIcon sx={muiSx} />;
      break;
    case 10:
      icon = <LocalTaxiIcon sx={muiSx} />;
      break;
    case 20:
      icon = <CommuteIcon sx={muiSx} />;
      break;
    case 30:
      icon = <HomeIcon sx={muiSx} />;
      break;
    case 31:
      icon = <DirectionsWalkIcon sx={muiSx} />;
      break;
    case 32:
      icon = <PlaceIcon sx={muiSx} />;
      break;
    case 33:
      icon = <ParkIcon sx={muiSx} />;
      break;
    default:
      icon = <icons.transportTrain style={svgStyle} />;
  }

  return (
    <Tooltip title={label} placement="top" arrow>
      <Box
        component="span"
        sx={{ display: "inline-flex", alignItems: "center", cursor: "default" }}
      >
        {icon}
      </Box>
    </Tooltip>
  );
}

/** Get localized vehicle type label for the current i18n language. */
function getVehicleTypeLabel(
  vehicleType: number | undefined,
  lang: string,
): string | undefined {
  if (vehicleType === undefined) return undefined;
  const labels = VEHICLE_TYPE_LABELS[vehicleType];
  if (!labels) return undefined;
  const shortLang = lang.substring(0, 2);
  return labels[shortLang] || labels["de"];
}

// ─── Sub-components ───────────────────────────────────────────

/** Horizontally scrollable connection selector tabs */
function ConnectionTabs({
  connections,
  selectedId,
  recommendedId,
  onSelect,
  t,
}: {
  connections: Connection[];
  selectedId: number;
  recommendedId: number;
  onSelect: (id: number) => void;
  t: (key: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to recommended on mount
  useEffect(() => {
    const idx = connections.findIndex((c) => c.connection_id === recommendedId);
    if (idx > 0 && scrollRef.current) {
      const child = scrollRef.current.children[idx] as HTMLElement;
      child?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [recommendedId, connections]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        width: "100%",
        pb: "8px",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { height: "4px" },
        "&::-webkit-scrollbar-thumb": {
          background: "#ccc",
          borderRadius: "2px",
        },
      }}
    >
      {connections.map((conn) => {
        const isSelected = conn.connection_id === selectedId;
        const timeRange = `${formatTime(conn.connection_start_timestamp)} - ${formatTime(conn.connection_end_timestamp)}`;
        return (
          <Box
            key={conn.connection_id}
            onClick={() => onSelect(conn.connection_id)}
            sx={{
              minWidth: "120px",
              px: "12px",
              py: "8px",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "center",
              flexShrink: 0,
              border: isSelected
                ? "2px solid var(--bzb-bahnblau)"
                : "1px solid #ddd",
              bgcolor: isSelected ? "var(--bzb-bahnblau)" : "#fff",
              color: isSelected ? "#fff" : "#333",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: "var(--bzb-bahnblau)",
                bgcolor: isSelected ? "var(--bzb-bahnblau)" : "#f0f4ff",
              },
            }}
          >
            <Typography
              sx={{ fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}
            >
              {timeRange}
            </Typography>
            <Typography sx={{ fontSize: "11px", mt: "2px" }}>
              {transferLabel(conn.connection_transfers, t)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

/** Timeline for a single connection's elements */
function ConnectionTimeline({
  elements,
  coordinateReplacements,
  lang,
  t,
}: {
  elements: ConnectionElement[];
  coordinateReplacements?: CoordinateReplacement;
  lang: string;
  t: (key: string) => string;
}) {
  const firstEl = elements[0];
  const lastEl = elements[elements.length - 1];
  const firstIsNonJourney =
    firstEl && (firstEl.type === "WALK" || firstEl.type === "TRSF");
  const lastIsNonJourney =
    lastEl && (lastEl.type === "WALK" || lastEl.type === "TRSF");

  return (
    <Box sx={{ mt: "12px" }}>
      {/* Show first station if the first element is a WALK/TRSF */}
      {firstIsNonJourney && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "2px solid var(--bzb-akelei)",
                bgcolor: "var(--bzb-akelei)",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--bzb-akelei)",
              minWidth: "50px",
              mr: "12px",
            }}
          >
            {formatTime(firstEl.departure_time)}
          </Typography>
          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            {resolveLocationName(firstEl.from_location, coordinateReplacements)}
          </Typography>
        </Box>
      )}

      {elements.map((el, idx) => {
        const isTransfer = el.type === "TRSF";
        const isFirst = idx === 0;
        const isLast = idx === elements.length - 1;
        const durationMin = calcDurationMinutes(
          el.departure_time,
          el.arrival_time,
        );

        const isWalk = el.type === "WALK";

        if (isWalk) {
          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                pl: "76px",
                py: "4px",
                ml: "14px",
                borderLeft: "2px dashed var(--bzb-akelei)",
              }}
            >
              <DirectionsWalkIcon
                sx={{ fontSize: "16px", color: "var(--bzb-akelei)", mr: "6px" }}
              />
              <Typography sx={{ fontSize: "14px", color: "var(--bzb-akelei)" }}>
                {t("details.fussweg")} ({durationMin} {t("details.min_minute")})
              </Typography>
            </Box>
          );
        }

        if (isTransfer) {
          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                pl: "76px",
                py: "4px",
                ml: "14px",
                borderLeft: "2px dashed #ccc",
              }}
            >
              <SwapHorizIcon
                sx={{ fontSize: "16px", color: "#888", mr: "6px" }}
              />
              <Typography sx={{ fontSize: "14px", color: "#888" }}>
                {t("details.umstieg")} ({durationMin} {t("details.min_minute")})
              </Typography>
            </Box>
          );
        }

        // Journey leg
        return (
          <Box key={idx}>
            {/* Departure */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: "30px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "2px solid var(--bzb-akelei)",
                    bgcolor: isFirst ? "var(--bzb-akelei)" : "#fff",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--bzb-akelei)",
                  minWidth: "50px",
                  mr: "12px",
                }}
              >
                {formatTime(el.departure_time)}
              </Typography>
              <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                {resolveLocationName(el.from_location, coordinateReplacements)}
              </Typography>
            </Box>

            {/* Vehicle info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                ml: "14px",
                pl: "76px",
                borderLeft: "2px solid var(--bzb-akelei)",
                py: "2px",
              }}
            >
              <Box>
                {/* Icon + Fahrzeugname */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <VehicleIcon vehicleType={el.vehicle_type} lang={lang} />
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 600, color: "#333" }}
                  >
                    {[
                      getVehicleTypeLabel(el.vehicle_type, lang),
                      el.vehicle_name,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </Typography>
                </Box>
                {/* Richtung + Abfahrtsgleis in einer Zeile */}
                {(el.direction || el.platform_orig) && (
                  <Typography
                    sx={{ fontSize: "14px", color: "#888", mt: "1px" }}
                  >
                    {el.direction && `\u2192 ${el.direction}`}
                    {el.direction && el.platform_orig && `, `}
                    {el.platform_orig &&
                      `${t("details.gleis")} ${el.platform_orig}`}
                  </Typography>
                )}
                {/* Fahrdauer + Halte */}
                <Typography sx={{ fontSize: "14px", color: "#888", mt: "1px" }}>
                  ({durationMin} {t("details.min_minute")}
                  {el.n_intermediate_stops !== undefined &&
                    `, ${el.n_intermediate_stops} ${t("details.halte")}`}
                  )
                </Typography>
              </Box>
            </Box>

            {/* Arrival: show when last JNY, or next element is TRSF/WALK */}
            {(isLast ||
              (idx < elements.length - 1 &&
                (elements[idx + 1].type === "TRSF" ||
                  elements[idx + 1].type === "WALK"))) && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: "30px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      border: "2px solid var(--bzb-akelei)",
                      bgcolor: isLast ? "var(--bzb-akelei)" : "#fff",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--bzb-akelei)",
                    minWidth: "50px",
                    mr: "12px",
                  }}
                >
                  {formatTime(el.arrival_time)}
                </Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                  {resolveLocationName(el.to_location, coordinateReplacements)}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}

      {/* Show last station if the last element is a WALK/TRSF */}
      {lastIsNonJourney && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "2px solid var(--bzb-akelei)",
                bgcolor: "var(--bzb-akelei)",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--bzb-akelei)",
              minWidth: "50px",
              mr: "12px",
            }}
          >
            {formatTime(lastEl.arrival_time)}
          </Typography>
          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            {resolveLocationName(lastEl.to_location, coordinateReplacements)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function ConnectionResults({
  data,
  coordinateReplacements,
  tourDurationHours,
}: ConnectionResultsProps) {
  const { t, i18n } = useTranslation();
  const { connections, activity } = data;

  const [selectedToId, setSelectedToId] = useState(
    connections.recommended_to_activity_connection,
  );
  const [selectedFromId, setSelectedFromId] = useState(
    connections.recommended_from_activity_connection,
  );

  // Toggle state: details hidden by default
  const [toExpanded, setToExpanded] = useState(false);
  const [fromExpanded, setFromExpanded] = useState(false);

  const selectedTo = connections.to_activity.find(
    (c) => c.connection_id === selectedToId,
  );
  const selectedFrom = connections.from_activity.find(
    (c) => c.connection_id === selectedFromId,
  );

  // Toggle handlers: clicking active tab closes, clicking other tab opens
  const handleToSelect = (id: number) => {
    if (id === selectedToId && toExpanded) {
      setToExpanded(false);
    } else {
      setSelectedToId(id);
      setToExpanded(true);
    }
  };

  const handleFromSelect = (id: number) => {
    if (id === selectedFromId && fromExpanded) {
      setFromExpanded(false);
    } else {
      setSelectedFromId(id);
      setFromExpanded(true);
    }
  };

  // Activity time calculation
  const arrivalTime = selectedTo?.connection_end_timestamp;
  const departureTime = selectedFrom?.connection_start_timestamp;
  const availableMinutes =
    arrivalTime && departureTime
      ? calcDurationMinutes(arrivalTime, departureTime)
      : activity.activity_duration_minutes;

  const hinfahrtDate = selectedTo
    ? formatDate(selectedTo.connection_start_timestamp)
    : "";
  const rueckfahrtDate = selectedFrom
    ? formatDate(selectedFrom.connection_start_timestamp)
    : "";

  return (
    <Box sx={{ mt: "24px", minWidth: 0, textAlign: "left" }}>
      {/* ─── Anreise Datum ─── */}
      {connections.to_activity.length > 0 && (
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--bzb-akelei)",
              mb: "8px",
            }}
          >
            {t("details.anreise")} {hinfahrtDate}
          </Typography>

          {/* Horizontale Anreisenavigation */}
          <ConnectionTabs
            connections={connections.to_activity}
            selectedId={selectedToId}
            recommendedId={connections.recommended_to_activity_connection}
            onSelect={handleToSelect}
            t={t}
          />

          {/* Anreise Detail (toggle) */}
          {toExpanded && selectedTo && (
            <ConnectionTimeline
              elements={selectedTo.connection_elements}
              coordinateReplacements={coordinateReplacements}
              lang={i18n.language}
              t={t}
            />
          )}
        </Box>
      )}

      {/* ─── Activity Box ─── */}
      <Box
        sx={{
          mt: "20px",
          mb: "20px",
          p: "16px",
          bgcolor: "#f5f0f6",
          borderRadius: "12px",
          borderLeft: "4px solid var(--bzb-akelei)",
        }}
      >
        {/* Tourdauer */}
        <Typography
          sx={{
            fontSize: "16px",
            color: "#555",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <HikingIcon
            sx={{ fontSize: "20px", color: "var(--bzb-akelei)", flexShrink: 0 }}
          />
          {t("details.tourdauer")}:{" "}
          <strong>
            {tourDurationHours !== undefined
              ? formatDurationFromHours(tourDurationHours)
              : formatDuration(activity.activity_duration_minutes)}
          </strong>
        </Typography>
        <Divider sx={{ my: "8px" }} />
        {/* Verfügbare Gehzeit */}
        <Typography
          sx={{
            fontSize: "16px",
            color: "#555",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <HikingIcon
            sx={{ fontSize: "20px", color: "var(--bzb-akelei)", flexShrink: 0 }}
          />
          {t("details.verfuegbare_gehzeit")}:{" "}
          <strong>{formatDuration(availableMinutes)}</strong>
        </Typography>
        {activity.activity_start_location_display_name &&
          activity.activity_end_location_display_name && (
            <Typography sx={{ fontSize: "14px", color: "#555", mt: "4px" }}>
              {activity.activity_start_location_display_name} →{" "}
              {activity.activity_end_location_display_name}
            </Typography>
          )}
      </Box>

      {/* ─── Rückreise Datum ─── */}
      {connections.from_activity.length > 0 && (
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--bzb-akelei)",
              mb: "8px",
            }}
          >
            {t("details.rueckreise")} {rueckfahrtDate}
          </Typography>

          {/* Rückreise Detail (toggle) — above the tabs */}
          {fromExpanded && selectedFrom && (
            <ConnectionTimeline
              elements={selectedFrom.connection_elements}
              coordinateReplacements={coordinateReplacements}
              lang={i18n.language}
              t={t}
            />
          )}

          {/* Horizontale Rückreisenavigation */}
          <ConnectionTabs
            connections={connections.from_activity}
            selectedId={selectedFromId}
            recommendedId={connections.recommended_from_activity_connection}
            onSelect={handleFromSelect}
            t={t}
          />
        </Box>
      )}
    </Box>
  );
}
