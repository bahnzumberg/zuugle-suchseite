/**
 * ConnectionResults — Renders the Diana /connections API response.
 *
 * Structure (matching the reference screenshot):
 *   - Hinfahrt section: horizontal connection tabs + timeline
 *   - Activity summary box
 *   - Rückfahrt section: horizontal connection tabs + timeline
 *   - Action buttons row (Ticket, Teilen, Kalender)
 */
import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

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

import ShareIcon from "@mui/icons-material/Share";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { icons } from "../../icons/icons";
import { useTranslation } from "react-i18next";
import { DIANA_PROXY_BASE } from "../../utils/dianaApi";
import { Tour } from "../../models/Tour";

// ─── Types ────────────────────────────────────────────────────

interface ConnectionElement {
  from_location: string;
  from_location_coordinates?: { lat: number; lon: number };
  to_location: string;
  to_location_coordinates?: { lat: number; lon: number };
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
    has_more_before_to_activity?: boolean | null;
    has_more_after_to_activity?: boolean | null;
    has_more_before_from_activity?: boolean | null;
    has_more_after_from_activity?: boolean | null;
  };
  live?: boolean;
}

export interface CoordinateReplacement {
  lat: number | null;
  lon: number | null;
  displayName: string;
  citySlug?: string;
  cityName?: string;
}

interface ConnectionResultsProps {
  data: ConnectionsResultData;
  coordinateReplacements?: CoordinateReplacement;
  tourDurationHours?: number;
  tour?: Tour;
  searchDate?: string;
  activityDurationMinutes?: number;
  shareTimeHints?: {
    toStart?: string;
    toEnd?: string;
    fromStart?: string;
    fromEnd?: string;
  } | null;
  onStopHover?: (coords: { lat: number; lon: number } | null) => void;
  useFlex?: boolean;
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
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
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

/**
 * Format an ISO timestamp to ICS-compatible format: "20260529T120000Z"
 */
function toIcsDate(isoString: string): string {
  return isoString.replace(/[-:]/g, "").replace(/\.\d+/, "").replace(" ", "T");
}

/**
 * Replace coordinate-based location names with human-readable names.
 * Diana API returns "(lat, lon)" when the user_start_location was coordinates.
 */
function resolveLocationName(
  name: string,
  replacements?: CoordinateReplacement,
): string {
  if (!replacements?.lat || !replacements?.lon || !replacements?.displayName) {
    return name;
  }

  const coordPattern = /^\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)$/;
  const match = name.match(coordPattern);
  if (!match) return name;

  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);

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
    case 1:
    case 5:
    case 6:
      icon = <icons.transportTrain style={svgStyle} />;
      break;
    case 2:
      icon = <icons.transportBus style={svgStyle} />;
      break;
    case 3:
      icon = <icons.tram style={svgStyle} />;
      break;
    case 7:
    case 8:
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
  onSelect,
  conflictThreshold,
  conflictCheckStart,
}: {
  connections: Connection[];
  selectedId: number;
  recommendedId: number;
  onSelect: (id: number) => void;
  conflictThreshold?: string;
  /** When true, checks connection_start_timestamp < threshold (for Rückfahrt).
   *  When false/undefined, checks connection_end_timestamp > threshold (for Hinfahrt). */
  conflictCheckStart?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected tab fully into view (never clipped left or right)
  useEffect(() => {
    const idx = connections.findIndex((c) => c.connection_id === selectedId);
    if (idx >= 0 && scrollRef.current) {
      const child = scrollRef.current.children[idx] as HTMLElement;
      if (child) {
        const container = scrollRef.current;
        const childLeft = child.offsetLeft;
        const childRight = childLeft + child.offsetWidth;
        const viewLeft = container.scrollLeft;
        const viewRight = viewLeft + container.clientWidth;
        const pad = 4; // small breathing room in px

        if (childLeft - pad < viewLeft) {
          // Clipped on the left → align left edge
          container.scrollTo({ left: childLeft - pad, behavior: "smooth" });
        } else if (childRight + pad > viewRight) {
          // Clipped on the right → align right edge
          container.scrollTo({
            left: childRight + pad - container.clientWidth,
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedId, connections]);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}
    >
      {/* Tab scroll area */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          flex: 1,
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
          const durationMin = calcDurationMinutes(
            conn.connection_start_timestamp,
            conn.connection_end_timestamp,
          );
          const durationLabel = formatDuration(durationMin);
          const transfers = conn.connection_transfers;

          // Conflict greying:
          // Hinfahrt: grey when arrival (end) is after Rückfahrt departure → conn_end > threshold
          // Rückfahrt: grey when departure (start) is before Hinfahrt arrival → conn_start < threshold
          const isConflicting =
            conflictThreshold != null &&
            (conflictCheckStart
              ? new Date(conn.connection_start_timestamp) <
                new Date(conflictThreshold)
              : new Date(conn.connection_end_timestamp) >
                new Date(conflictThreshold));

          return (
            <Box
              key={conn.connection_id}
              onClick={() => onSelect(conn.connection_id)}
              sx={{
                minWidth: "100px",
                px: "8px",
                py: "6px",
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
                opacity: isConflicting && !isSelected ? 0.35 : 1,
                "&:hover": {
                  borderColor: "var(--bzb-bahnblau)",
                  bgcolor: isSelected ? "var(--bzb-bahnblau)" : "#f0f4ff",
                  opacity: isConflicting && !isSelected ? 0.6 : 1,
                },
              }}
            >
              <Typography
                sx={{ fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {timeRange}
              </Typography>
              <Typography
                sx={{ fontSize: "11px", mt: "2px", whiteSpace: "nowrap" }}
              >
                {durationLabel} &nbsp;{transfers} ⇄
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/** Timeline for a single connection's elements */
function ConnectionTimeline({
  elements,
  coordinateReplacements,
  lang,
  t,
  onStopHover,
}: {
  elements: ConnectionElement[];
  coordinateReplacements?: CoordinateReplacement;
  lang: string;
  t: (key: string) => string;
  onStopHover?: (coords: { lat: number; lon: number } | null) => void;
}) {
  const firstEl = elements[0];
  const lastEl = elements[elements.length - 1];
  const firstIsNonJourney =
    firstEl && (firstEl.type === "WALK" || firstEl.type === "TRSF");
  const lastIsNonJourney =
    lastEl && (lastEl.type === "WALK" || lastEl.type === "TRSF");

  return (
    <Box sx={{ mt: "20px", mb: "20px" }}>
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
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              cursor: firstEl.from_location_coordinates ? "pointer" : undefined,
            }}
            onMouseEnter={() =>
              firstEl.from_location_coordinates &&
              onStopHover?.(firstEl.from_location_coordinates)
            }
            onMouseLeave={() => onStopHover?.(null)}
          >
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
          // Arrival platform from the preceding leg, departure platform from the next leg
          const prevPlatform =
            idx > 0 ? elements[idx - 1].platform_dest : undefined;
          const nextPlatform =
            idx < elements.length - 1
              ? elements[idx + 1].platform_orig
              : undefined;
          const tInterp = t as unknown as (
            key: string,
            opts: Record<string, string>,
          ) => string;
          const platformInfo =
            prevPlatform && nextPlatform
              ? `, ${tInterp("details.von_gleis_zu_gleis", { from: prevPlatform, to: nextPlatform })}`
              : prevPlatform
                ? `, ${tInterp("details.von_gleis", { from: prevPlatform })}`
                : nextPlatform
                  ? `, ${tInterp("details.zu_gleis", { to: nextPlatform })}`
                  : "";
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
                {platformInfo}
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
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: el.from_location_coordinates ? "pointer" : undefined,
                }}
                onMouseEnter={() =>
                  el.from_location_coordinates &&
                  onStopHover?.(el.from_location_coordinates)
                }
                onMouseLeave={() => onStopHover?.(null)}
              >
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
                {(el.direction || el.platform_orig) && (
                  <Typography
                    sx={{ fontSize: "14px", color: "#888", mt: "1px" }}
                  >
                    {el.direction && `→ ${el.direction}`}
                    {el.direction && el.platform_orig && `, `}
                    {el.platform_orig &&
                      `${t("details.gleis")} ${el.platform_orig}`}
                  </Typography>
                )}
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
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: el.to_location_coordinates ? "pointer" : undefined,
                  }}
                  onMouseEnter={() =>
                    el.to_location_coordinates &&
                    onStopHover?.(el.to_location_coordinates)
                  }
                  onMouseLeave={() => onStopHover?.(null)}
                >
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
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              cursor: lastEl.to_location_coordinates ? "pointer" : undefined,
            }}
            onMouseEnter={() =>
              lastEl.to_location_coordinates &&
              onStopHover?.(lastEl.to_location_coordinates)
            }
            onMouseLeave={() => onStopHover?.(null)}
          >
            {resolveLocationName(lastEl.to_location, coordinateReplacements)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── ICS generation ───────────────────────────────────────────

function generateIcs(
  toConn: Connection,
  fromConn: Connection,
  tourTitle: string,
): string {
  const now = toIcsDate(new Date().toISOString());

  const formatLegs = (elements: ConnectionElement[]): string =>
    elements
      .filter((el) => el.type !== "TRSF" && el.type !== "WALK")
      .map(
        (el) =>
          `${formatTime(el.departure_time)} ${el.from_location} → ${formatTime(el.arrival_time)} ${el.to_location}${el.vehicle_name ? ` (${el.vehicle_name})` : ""}`,
      )
      .join("\\n");

  // Build human-readable route summaries from actual connection endpoints
  const toElements = toConn.connection_elements;
  const fromElements = fromConn.connection_elements;
  const toFrom = toElements[0]?.from_location || "";
  const toTo = toElements[toElements.length - 1]?.to_location || "";
  const fromFrom = fromElements[0]?.from_location || "";
  const fromTo = fromElements[fromElements.length - 1]?.to_location || "";

  const toStart = toIcsDate(toConn.connection_start_timestamp);
  const toEnd = toIcsDate(toConn.connection_end_timestamp);
  const fromStart = toIcsDate(fromConn.connection_start_timestamp);
  const fromEnd = toIcsDate(fromConn.connection_end_timestamp);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zuugle//Bahn zum Berg//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:hinfahrt-${toStart}@zuugle`,
    `DTSTAMP:${now}`,
    `DTSTART:${toStart}`,
    `DTEND:${toEnd}`,
    `SUMMARY:Anreise: ${toFrom} → ${toTo}`,
    `DESCRIPTION:${formatLegs(toConn.connection_elements)}`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:wanderung-${toEnd}@zuugle`,
    `DTSTAMP:${now}`,
    `DTSTART:${toEnd}`,
    `DTEND:${fromStart}`,
    `SUMMARY:${tourTitle}`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:rueckfahrt-${fromStart}@zuugle`,
    `DTSTAMP:${now}`,
    `DTSTART:${fromStart}`,
    `DTEND:${fromEnd}`,
    `SUMMARY:Rückreise: ${fromFrom} → ${fromTo}`,
    `DESCRIPTION:${formatLegs(fromConn.connection_elements)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Main component ───────────────────────────────────────────

export default function ConnectionResults({
  data,
  coordinateReplacements,
  tourDurationHours,
  tour,
  searchDate,
  activityDurationMinutes,
  shareTimeHints,
  onStopHover,
  useFlex,
}: ConnectionResultsProps) {
  const { t, i18n } = useTranslation();
  const { connections, activity } = data;

  // Pick initial selection: match share hints if available, else use recommended
  const resolveInitialTo = (): number => {
    if (shareTimeHints?.toStart) {
      const match = connections.to_activity.find(
        (c) =>
          c.connection_start_timestamp === shareTimeHints.toStart &&
          c.connection_end_timestamp === shareTimeHints.toEnd,
      );
      if (match) return match.connection_id;
    }
    return connections.recommended_to_activity_connection;
  };

  const resolveInitialFrom = (): number => {
    if (shareTimeHints?.fromStart) {
      const match = connections.from_activity.find(
        (c) =>
          c.connection_start_timestamp === shareTimeHints.fromStart &&
          c.connection_end_timestamp === shareTimeHints.fromEnd,
      );
      if (match) return match.connection_id;
    }
    return connections.recommended_from_activity_connection;
  };

  const [selectedToId, setSelectedToId] = useState(resolveInitialTo);
  const [selectedFromId, setSelectedFromId] = useState(resolveInitialFrom);

  // Sync selected IDs when data changes (after scroll prepend/append)
  useEffect(() => {
    // Only reset if the currently selected ID no longer exists in the list
    const toExists = connections.to_activity.some(
      (c) => c.connection_id === selectedToId,
    );
    if (!toExists) {
      setSelectedToId(connections.recommended_to_activity_connection);
    }
  }, [connections.to_activity]);

  useEffect(() => {
    const fromExists = connections.from_activity.some(
      (c) => c.connection_id === selectedFromId,
    );
    if (!fromExists) {
      setSelectedFromId(connections.recommended_from_activity_connection);
    }
  }, [connections.from_activity]);

  // Toggle state: details expanded by default so user sees timeline immediately
  const [toExpanded, setToExpanded] = useState(true);
  const [fromExpanded, setFromExpanded] = useState(true);

  // Action button states

  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const selectedTo = connections.to_activity.find(
    (c) => c.connection_id === selectedToId,
  );
  const selectedFrom = connections.from_activity.find(
    (c) => c.connection_id === selectedFromId,
  );

  // Toggle handlers: clicking active tab collapses, clicking other tab expands
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
  const arrivalAtActivity = selectedTo?.connection_end_timestamp;
  const departureFromActivity = selectedFrom?.connection_start_timestamp;

  const diffMin =
    arrivalAtActivity && departureFromActivity
      ? calcDurationMinutes(arrivalAtActivity, departureFromActivity)
      : null;

  const tourDurationMinutes = tourDurationHours
    ? Math.round(tourDurationHours * 60)
    : activity.activity_duration_minutes;

  const hasConflict = diffMin !== null && diffMin < 0;
  const hasTimeWarning =
    diffMin !== null && diffMin >= 0 && diffMin < tourDurationMinutes;

  // Conflict thresholds for greying tabs:
  // A Hinfahrt tab is conflicting when its end > selectedFrom.start
  // A Rückfahrt tab is conflicting when its start < selectedTo.end
  const toConflictThreshold = departureFromActivity; // Hinfahrt: conn_end > from.start = conflict
  const fromConflictThreshold = arrivalAtActivity; // Rückfahrt: conn_start < to.end = conflict

  // Buttons disabled when conflict or no selection
  const actionsDisabled = hasConflict || !selectedTo || !selectedFrom;

  const hinfahrtDate = selectedTo
    ? formatDate(selectedTo.connection_start_timestamp)
    : "";
  const rueckfahrtDate = selectedFrom
    ? formatDate(selectedFrom.connection_start_timestamp)
    : "";

  // ── Share handler
  const handleShare = async () => {
    if (actionsDisabled) return;
    setShareLoading(true);
    try {
      const payload = {
        origin:
          coordinateReplacements?.lat && coordinateReplacements?.lon
            ? `${coordinateReplacements.lat},${coordinateReplacements.lon}`
            : coordinateReplacements?.displayName || "",
        origin_display_name: coordinateReplacements?.displayName || "",
        origin_lat: coordinateReplacements?.lat
          ? String(coordinateReplacements.lat)
          : null,
        origin_lon: coordinateReplacements?.lon
          ? String(coordinateReplacements.lon)
          : null,
        date: searchDate || new Date().toISOString().substring(0, 10),
        dateEnd: null,
        duration: activityDurationMinutes
          ? String(activityDurationMinutes)
          : null,
        alpenvereinaktiv_tour_id: null,
        to_connection_start_time:
          selectedTo?.connection_start_timestamp ?? null,
        to_connection_end_time: selectedTo?.connection_end_timestamp ?? null,
        from_connection_start_time:
          selectedFrom?.connection_start_timestamp ?? null,
        from_connection_end_time:
          selectedFrom?.connection_end_timestamp ?? null,
        activity: null,
        shareURLPrefix: window.location.origin + window.location.pathname,
      };

      const resp = await fetch(`${DIANA_PROXY_BASE}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const { shareId } = await resp.json();
      const shareUrl = `${window.location.origin}${window.location.pathname}?diana-share=${shareId}${useFlex ? "&flex=1" : ""}`;

      // Use native Web Share API if available, otherwise copy to clipboard
      if (navigator.share) {
        await navigator.share({
          title: tour?.title || "Zuugle",
          text: t("details.teilen_text"),
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (err) {
      // User cancelled the share dialog — not an error
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Share error:", err);
    } finally {
      setShareLoading(false);
    }
  };

  // ── Calendar/ICS handler
  const handleCalendar = () => {
    if (actionsDisabled || !selectedTo || !selectedFrom) return;
    const tourTitle = tour?.title || t("details.wanderung");
    const icsContent = generateIcs(selectedTo, selectedFrom, tourTitle);

    // Build filename: "Wanderung-DD-MM-YYYY.ics" from the Hinfahrt date
    const d = new Date(selectedTo.connection_start_timestamp);
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    downloadIcs(icsContent, `Wanderung-${dd}-${mm}-${yyyy}.ics`);
  };

  return (
    <Box sx={{ mt: "24px", minWidth: 0, textAlign: "left" }}>
      {/* ─── Anreise Datum ─── */}
      {connections.to_activity.length > 0 && (
        <Box>
          <Box
            id="anreise-header"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mb: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--bzb-akelei)",
              }}
            >
              {t("details.anreise")} {hinfahrtDate}
            </Typography>
            {/* Live badge */}
            {data.live === true && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  bgcolor: "#e8f5e9",
                  border: "1px solid #66bb6a",
                  borderRadius: "12px",
                  px: "8px",
                  py: "2px",
                }}
              >
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    bgcolor: "#2e7d32",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#2e7d32",
                    lineHeight: 1,
                  }}
                >
                  {t("details.echtzeit")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Horizontale Anreisenavigation */}
          <ConnectionTabs
            connections={connections.to_activity}
            selectedId={selectedToId}
            recommendedId={connections.recommended_to_activity_connection}
            onSelect={handleToSelect}
            conflictThreshold={toConflictThreshold}
          />

          {/* Anreise Detail (toggle) */}
          {toExpanded && selectedTo && (
            <ConnectionTimeline
              elements={selectedTo.connection_elements}
              coordinateReplacements={coordinateReplacements}
              lang={i18n.language}
              t={t}
              onStopHover={onStopHover}
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
        {/* Header: Hiking icon + Wanderung label */}
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--bzb-akelei)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            mb: "8px",
          }}
        >
          <HikingIcon sx={{ fontSize: "20px", flexShrink: 0 }} />
          {t("details.wanderung")}
        </Typography>

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
          {t("details.tourdauer")}:{" "}
          <strong>
            {tourDurationHours !== undefined
              ? formatDurationFromHours(tourDurationHours)
              : formatDuration(activity.activity_duration_minutes)}
          </strong>
        </Typography>

        <Divider sx={{ my: "8px" }} />

        {/* Von HH:MM bis HH:MM */}
        {arrivalAtActivity && departureFromActivity && (
          <Typography
            sx={{
              fontSize: "15px",
              color: "#555",
              mb: "6px",
            }}
          >
            {t("details.von_bis_zeiten")
              .replace("{0}", formatTime(arrivalAtActivity))
              .replace("{1}", formatTime(departureFromActivity))}
          </Typography>
        )}

        {/* Conflict / warning / available time */}
        {diffMin !== null && (
          <>
            {hasConflict && (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#c62828",
                  mt: "4px",
                }}
              >
                {t("details.terminkonflikt")}
              </Typography>
            )}
            {hasTimeWarning && (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#e65100",
                  mt: "4px",
                }}
              >
                {"⚠ " +
                  t("details.zeitmangel_kurz").replace(
                    "{0}",
                    formatDuration(diffMin),
                  )}
              </Typography>
            )}
            {!hasConflict && !hasTimeWarning && (
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <HikingIcon
                  sx={{
                    fontSize: "20px",
                    color: "var(--bzb-akelei)",
                    flexShrink: 0,
                  }}
                />
                {t("details.verfuegbare_gehzeit")}:{" "}
                <strong>{formatDuration(diffMin)}</strong>
              </Typography>
            )}
          </>
        )}

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
              onStopHover={onStopHover}
            />
          )}

          {/* Horizontale Rückreisenavigation */}
          <Box sx={{ mt: "12px" }}>
            <ConnectionTabs
              connections={connections.from_activity}
              selectedId={selectedFromId}
              recommendedId={connections.recommended_from_activity_connection}
              onSelect={handleFromSelect}
              conflictThreshold={fromConflictThreshold}
              conflictCheckStart={true}
            />
          </Box>
        </Box>
      )}

      {/* ─── Action Buttons ─── */}
      <Box
        sx={{
          mt: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Teilen */}
        <Button
          variant="contained"
          startIcon={
            shareLoading ? (
              <CircularProgress size={16} sx={{ color: "#fff" }} />
            ) : (
              <ShareIcon />
            )
          }
          disabled={actionsDisabled || shareLoading}
          onClick={handleShare}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            px: "16px",
            py: "6px",
            bgcolor: shareCopied ? "var(--bzb-bahnblau)" : "var(--bzb-akelei)",
            color: "#fff",
            "&:hover": { bgcolor: shareCopied ? "#1a3a66" : "#5a1d61" },
            "&.Mui-disabled": {
              bgcolor: "#ccc",
              color: "#888",
            },
          }}
        >
          {shareCopied ? `✔ ${t("details.link_kopiert")}` : t("details.teilen")}
        </Button>

        {/* Kalender */}
        <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          disabled={actionsDisabled}
          onClick={handleCalendar}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            px: "16px",
            py: "6px",
            bgcolor: "var(--bzb-akelei)",
            color: "#fff",
            "&:hover": { bgcolor: "#5a1d61" },
            "&.Mui-disabled": {
              bgcolor: "#ccc",
              color: "#888",
            },
          }}
        >
          {t("details.kalender")}
        </Button>
      </Box>
    </Box>
  );
}
