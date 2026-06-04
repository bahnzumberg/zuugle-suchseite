import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/fr";
import "dayjs/locale/it";
import "dayjs/locale/sl";

import { Tour } from "../../models/Tour";
import {
  useDepartureLocation,
  DepartureLocation,
} from "../../hooks/useDepartureLocation";
import { useDianaAutocomplete } from "../../hooks/useDianaAutocomplete";
import {
  fetchDianaToken,
  DIANA_API_BASE,
  mapLanguage,
  localTimeToUtc,
} from "../../utils/dianaApi";
import { DIANA_ACTIVITY_TIMES } from "../../utils/dianaConfig";
import ConnectionResults, { ConnectionsResultData } from "./ConnectionResults";

interface ConnectionSearchFormProps {
  tour: Tour;
}

export default function ConnectionSearchForm({
  tour,
}: ConnectionSearchFormProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.substring(0, 2);

  // Departure location from localStorage
  const {
    departureLocation,
    departureLat,
    departureLon,
    setDepartureLocation,
    clearDepartureLocation,
  } = useDepartureLocation();

  // Autocomplete
  const {
    options,
    loading: autocompleteLoading,
    search: searchAutocomplete,
    clearOptions,
  } = useDianaAutocomplete(lang);

  // Input value for the autocomplete text field
  const [inputValue, setInputValue] = useState(
    departureLocation?.displayName || "",
  );

  // Date state
  const isMultiDay = tour.number_of_days > 1;
  const today = dayjs();

  // Single-day: "today" | "tomorrow" | custom date
  const [dateMode, setDateMode] = useState<"today" | "tomorrow" | "custom">(
    "tomorrow",
  );

  // Disable "Heute" after 12:00 noon for single-day tours
  const isTodayDisabled = !isMultiDay && today.hour() >= 12;
  const [customDate, setCustomDate] = useState<Dayjs | null>(null);

  // Multi-day: departure date + return date
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(today);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(
    today.add(tour.number_of_days - 1, "day"),
  );

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [connectionsResult, setConnectionsResult] =
    useState<ConnectionsResultData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const getSelectedDate = (): string => {
    if (isMultiDay) {
      return departureDate?.format("YYYY-MM-DD") || today.format("YYYY-MM-DD");
    }
    switch (dateMode) {
      case "today":
        return today.format("YYYY-MM-DD");
      case "tomorrow":
        return today.add(1, "day").format("YYYY-MM-DD");
      case "custom":
        return customDate?.format("YYYY-MM-DD") || today.format("YYYY-MM-DD");
    }
  };

  const activityDurationMinutes = Math.round(
    parseFloat(tour.avg_total_tour_duration) * 60,
  );

  /**
   * Build the shared URLSearchParams for the connections API call.
   * Used for both initial search and scroll (before/after) requests.
   */
  const buildSearchParams = (selectedDate: string): URLSearchParams => {
    let userStartLocation: string;
    let userStartLocationType: string;
    if (departureLat && departureLon) {
      userStartLocation = `${departureLat},${departureLon}`;
      userStartLocationType = "coordinates";
    } else {
      userStartLocation = departureLocation!.displayName;
      userStartLocationType = departureLocation!.locationType || "address";
    }

    const utcTimes = {
      earliest_start: localTimeToUtc(
        DIANA_ACTIVITY_TIMES.earliest_start_time,
        selectedDate,
      ),
      latest_start: localTimeToUtc(
        DIANA_ACTIVITY_TIMES.latest_start_time,
        selectedDate,
      ),
      earliest_end: localTimeToUtc(
        DIANA_ACTIVITY_TIMES.earliest_end_time,
        selectedDate,
      ),
      latest_end: localTimeToUtc(
        DIANA_ACTIVITY_TIMES.latest_end_time,
        selectedDate,
      ),
    };

    const params = new URLSearchParams({
      user_start_location: userStartLocation,
      user_start_location_type: userStartLocationType,
      activity_name: tour.title,
      activity_start_location: `${tour.start_stop_lat},${tour.start_stop_lon}`,
      activity_start_location_type: "coordinates",
      activity_end_location: `${tour.end_stop_lat},${tour.end_stop_lon}`,
      activity_end_location_type: "coordinates",
      activity_duration_minutes: String(activityDurationMinutes),
      activity_earliest_start_time: utcTimes.earliest_start,
      activity_latest_start_time: utcTimes.latest_start,
      activity_earliest_end_time: utcTimes.earliest_end,
      activity_latest_end_time: utcTimes.latest_end,
      date: selectedDate,
      lang: mapLanguage(lang),
      use_flex: "false",
      timezone: "Europe/Vienna",
    });

    if (isMultiDay) {
      params.set("activity_duration_days", String(tour.number_of_days));
    }

    return params;
  };

  const handleSearch = async () => {
    if (!departureLocation) return;

    setIsSearching(true);
    setConnectionsResult(null);
    setSearchError(null);

    try {
      const token = await fetchDianaToken();
      const selectedDate = getSelectedDate();
      const params = buildSearchParams(selectedDate);

      const resp = await fetch(`${DIANA_API_BASE}/connections?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => null);
        const code = String(errData?.code ?? "");

        if (code === "6001" || code === "6002") {
          // Quota exceeded — point user to fallback
          setSearchError(t("details.kontingent_erschoepft"));
        } else if (
          // Partial "no connections in one direction" — e.g. 2017-1, 2017-2
          // These always mean the entire search failed; show friendly message.
          code.startsWith("2017") ||
          code.startsWith("2018") ||
          code.startsWith("2019") ||
          code.startsWith("2020") ||
          code.startsWith("2021") ||
          code.startsWith("2022") ||
          code.startsWith("2023") ||
          code === "2024" ||
          code === "2027" ||
          code === "2002"
        ) {
          setSearchError(t("details.keine_verbindungen"));
        } else if (code.startsWith("3") || code.startsWith("2025")) {
          // Routing provider temporarily unavailable — retryable
          setSearchError(t("details.verbindungssuche_fehlgeschlagen"));
        } else {
          setSearchError(t("details.verbindungssuche_fehlgeschlagen"));
        }
        return;
      }

      const data = await resp.json();

      // Check if the response actually has connections
      const hasTo = (data?.connections?.to_activity?.length ?? 0) > 0;
      const hasFrom = (data?.connections?.from_activity?.length ?? 0) > 0;
      if (!hasTo && !hasFrom) {
        setSearchError(t("details.keine_verbindungen"));
        return;
      }

      setConnectionsResult(data);
    } catch (err) {
      console.error("❌ Diana connections error:", err);
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("diana-config") || msg.includes("Credentials")) {
        setSearchError(msg);
      } else {
        setSearchError(t("details.verbindungssuche_fehlgeschlagen"));
      }
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Scroll to earlier connections (prepend to existing list).
   * Uses the first connection's start timestamp as the "before" anchor.
   */
  const handleScrollBefore = async (direction: "to" | "from") => {
    if (!departureLocation || !connectionsResult) return;

    try {
      const token = await fetchDianaToken();
      const selectedDate = getSelectedDate();
      const params = buildSearchParams(selectedDate);

      const connectionsList =
        direction === "to"
          ? connectionsResult.connections.to_activity
          : connectionsResult.connections.from_activity;

      if (connectionsList.length === 0) return;

      const firstTimestamp = connectionsList[0].connection_start_timestamp;

      if (direction === "to") {
        params.set("to_connections_before", firstTimestamp);
      } else {
        params.set("from_connections_before", firstTimestamp);
      }

      const resp = await fetch(`${DIANA_API_BASE}/connections?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) return;

      const newData: ConnectionsResultData = await resp.json();

      setConnectionsResult((prev) => {
        if (!prev) return prev;

        if (direction === "to") {
          const existingIds = new Set(
            prev.connections.to_activity.map((c) => c.connection_id),
          );
          const newConns = (newData.connections.to_activity || []).filter(
            (c) => !existingIds.has(c.connection_id),
          );
          return {
            ...prev,
            connections: {
              ...prev.connections,
              to_activity: [...newConns, ...prev.connections.to_activity],
              has_more_before_to_activity:
                newData.connections.has_more_before_to_activity,
            },
          };
        } else {
          const existingIds = new Set(
            prev.connections.from_activity.map((c) => c.connection_id),
          );
          const newConns = (newData.connections.from_activity || []).filter(
            (c) => !existingIds.has(c.connection_id),
          );
          return {
            ...prev,
            connections: {
              ...prev.connections,
              from_activity: [...newConns, ...prev.connections.from_activity],
              has_more_before_from_activity:
                newData.connections.has_more_before_from_activity,
            },
          };
        }
      });
    } catch (err) {
      console.error("❌ Scroll before error:", err);
    }
  };

  /**
   * Scroll to later connections (append to existing list).
   * Uses the last connection's start timestamp as the "after" anchor.
   */
  const handleScrollAfter = async (direction: "to" | "from") => {
    if (!departureLocation || !connectionsResult) return;

    try {
      const token = await fetchDianaToken();
      const selectedDate = getSelectedDate();
      const params = buildSearchParams(selectedDate);

      const connectionsList =
        direction === "to"
          ? connectionsResult.connections.to_activity
          : connectionsResult.connections.from_activity;

      if (connectionsList.length === 0) return;

      const lastTimestamp =
        connectionsList[connectionsList.length - 1].connection_start_timestamp;

      if (direction === "to") {
        params.set("to_connections_after", lastTimestamp);
      } else {
        params.set("from_connections_after", lastTimestamp);
      }

      const resp = await fetch(`${DIANA_API_BASE}/connections?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) return;

      const newData: ConnectionsResultData = await resp.json();

      setConnectionsResult((prev) => {
        if (!prev) return prev;

        if (direction === "to") {
          const existingIds = new Set(
            prev.connections.to_activity.map((c) => c.connection_id),
          );
          const newConns = (newData.connections.to_activity || []).filter(
            (c) => !existingIds.has(c.connection_id),
          );
          return {
            ...prev,
            connections: {
              ...prev.connections,
              to_activity: [...prev.connections.to_activity, ...newConns],
              has_more_after_to_activity:
                newData.connections.has_more_after_to_activity,
            },
          };
        } else {
          const existingIds = new Set(
            prev.connections.from_activity.map((c) => c.connection_id),
          );
          const newConns = (newData.connections.from_activity || []).filter(
            (c) => !existingIds.has(c.connection_id),
          );
          return {
            ...prev,
            connections: {
              ...prev.connections,
              from_activity: [...prev.connections.from_activity, ...newConns],
              has_more_after_from_activity:
                newData.connections.has_more_after_from_activity,
            },
          };
        }
      });
    } catch (err) {
      console.error("❌ Scroll after error:", err);
    }
  };

  const handleDepartureDateChange = (date: Dayjs | null) => {
    setDepartureDate(date);
    if (date) {
      const minReturn = date.add(tour.number_of_days - 1, "day");
      if (!returnDate || returnDate.isBefore(minReturn)) {
        setReturnDate(minReturn);
      }
    }
  };

  // Match the "infoKey" Typography variant used for labels like "Sportart"
  const sectionLabelSx = {
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "23px",
    color: "#101010",
    mb: "6px",
    textAlign: "left" as const,
  };

  const canSearch = !!departureLocation;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
      <Box
        sx={{
          pt: "16px",
          minWidth: 0,
          textAlign: "left",
        }}
      >
        {/* Section: Startort */}
        <Typography sx={sectionLabelSx}>{t("details.startort")}</Typography>
        <Autocomplete
          fullWidth
          freeSolo
          options={options}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.displayName
          }
          inputValue={inputValue}
          onInputChange={(_e, value, reason) => {
            setInputValue(value);
            if (reason === "input") {
              searchAutocomplete(value);
            }
            if (reason === "clear") {
              clearDepartureLocation();
              clearOptions();
            }
          }}
          onChange={(_e, value) => {
            if (value && typeof value !== "string") {
              const loc: DepartureLocation = {
                displayName: value.displayName,
                locationType: value.locationType,
              };
              setDepartureLocation(loc, value.lat, value.lon);
              setInputValue(value.displayName);
            } else if (!value) {
              clearDepartureLocation();
            }
          }}
          loading={autocompleteLoading}
          renderOption={(props, option) => (
            <li
              {...props}
              key={`${option.lat}-${option.lon}-${option.displayName}`}
            >
              <LocationOnIcon
                sx={{ color: "#8B8B8B", mr: 1, fontSize: "18px" }}
              />
              <Typography sx={{ fontSize: "14px" }}>
                {option.displayName}
              </Typography>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("details.startort_placeholder")}
              size="small"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#8B8B8B" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {autocompleteLoading ? (
                        <CircularProgress size={18} />
                      ) : null}
                      {params.slotProps?.input?.endAdornment}
                    </>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          )}
        />

        {/* Section: Datum + Verbindung suchen in same flex-wrap row */}
        {!isMultiDay ? (
          <>
            <Typography sx={{ ...sectionLabelSx, mt: "20px" }}>
              {t("details.aktivitaetsdatum")}
            </Typography>
            {/* Single-day: all controls in one row */}
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "nowrap",
                mt: "8px",
              }}
            >
              <Button
                variant={dateMode === "today" ? "contained" : "outlined"}
                disabled={isTodayDisabled}
                onClick={() => setDateMode("today")}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  px: "16px",
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                  ...(dateMode === "today"
                    ? {
                        bgcolor: "var(--bzb-bahnblau)",
                        color: "#fff",
                        "&:hover": { bgcolor: "#1a3a66" },
                      }
                    : {
                        borderColor: "#ccc",
                        color: "#333",
                        "&:hover": { borderColor: "#999" },
                      }),
                  "&.Mui-disabled": {
                    borderColor: "#eee",
                    color: "#bbb",
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                {t("details.heute")}
              </Button>
              <Button
                variant={dateMode === "tomorrow" ? "contained" : "outlined"}
                onClick={() => setDateMode("tomorrow")}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  px: "16px",
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                  ...(dateMode === "tomorrow"
                    ? {
                        bgcolor: "var(--bzb-bahnblau)",
                        color: "#fff",
                        "&:hover": { bgcolor: "#1a3a66" },
                      }
                    : {
                        borderColor: "#ccc",
                        color: "#333",
                        "&:hover": { borderColor: "#999" },
                      }),
                }}
              >
                {t("details.morgen")}
              </Button>

              {/* DatePicker wrapper: flex:1 fills remaining space */}
              <Box sx={{ flex: "1 1 0", minWidth: "48px" }}>
                <DatePicker
                  value={dateMode === "custom" ? customDate : null}
                  onChange={(date) => {
                    setDateMode("custom");
                    setCustomDate(date);
                  }}
                  minDate={today}
                  format="DD.MM.YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          ...(dateMode === "custom"
                            ? {
                                bgcolor: "var(--bzb-bahnblau)",
                                color: "#fff",
                                "& fieldset": { borderColor: "transparent" },
                                "& input": { color: "#fff" },
                                "& .MuiInputBase-input": { color: "#fff" },
                                "& .MuiSvgIcon-root": { color: "#fff" },
                              }
                            : {}),
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Verbindung suchen */}
              <Button
                variant="contained"
                disabled={!canSearch || isSearching}
                onClick={handleSearch}
                sx={{
                  flex: "0 0 auto",
                  minWidth: "160px",
                  bgcolor: isSearching
                    ? "var(--bzb-bahnblau)"
                    : "var(--bzb-akelei)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "12px",
                  textTransform: "none",
                  px: "16px",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: isSearching ? "var(--bzb-bahnblau)" : "#5a1d61",
                  },
                  "&.Mui-disabled": { bgcolor: "#ccc", color: "#888" },
                }}
              >
                {isSearching ? (
                  <CircularProgress
                    size={22}
                    sx={{ color: "#fff", mx: "24px" }}
                  />
                ) : (
                  t("details.verbindung_suchen")
                )}
              </Button>
            </Box>
          </>
        ) : (
          /* Multi-day tour: date pickers + button in same flex-wrap row */
          <Box sx={{ mt: "20px" }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                gap: "8px",
              }}
            >
              {/* Date pickers grow → push button right */}
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  flex: "1 1 auto",
                  flexWrap: "wrap",
                  minWidth: 0,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ ...sectionLabelSx }}>
                    {t("details.anreise")}
                  </Typography>
                  <DatePicker
                    value={departureDate}
                    onChange={handleDepartureDateChange}
                    minDate={today}
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: {
                          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ ...sectionLabelSx }}>
                    {t("details.rueckreise")}
                  </Typography>
                  <DatePicker
                    value={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    minDate={
                      departureDate
                        ? departureDate.add(tour.number_of_days - 1, "day")
                        : today
                    }
                    format="DD.MM.YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: {
                          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Search button: mx auto → right when same line, centered when wrapped */}
              <Button
                variant="contained"
                disabled={!canSearch || isSearching}
                onClick={handleSearch}
                sx={{
                  flex: "0 0 auto",
                  mx: "auto",
                  alignSelf: "flex-end",
                  bgcolor: isSearching
                    ? "var(--bzb-bahnblau)"
                    : "var(--bzb-akelei)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "12px",
                  textTransform: "none",
                  px: "20px",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: isSearching ? "var(--bzb-bahnblau)" : "#5a1d61",
                  },
                  "&.Mui-disabled": { bgcolor: "#ccc", color: "#888" },
                }}
              >
                {isSearching ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  t("details.verbindung_suchen")
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* Hint: no location selected */}
        {!departureLocation && inputValue.length > 0 && (
          <Typography
            sx={{
              mt: "8px",
              fontSize: "13px",
              color: "#e65100",
            }}
          >
            {t("details.startort_aus_liste_waehlen")}
          </Typography>
        )}

        {/* Search error */}
        {searchError && !isSearching && (
          <Box
            sx={{
              mt: "16px",
              p: "12px 16px",
              bgcolor: "#fff3e0",
              borderRadius: "10px",
              borderLeft: "4px solid #e65100",
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "#bf360c" }}>
              {searchError}
            </Typography>
          </Box>
        )}

        {/* Connections result */}
        {connectionsResult && (
          <ConnectionResults
            data={connectionsResult}
            coordinateReplacements={{
              lat: departureLat,
              lon: departureLon,
              displayName: departureLocation?.displayName || inputValue,
            }}
            tourDurationHours={Number(tour.avg_total_tour_duration)}
            tour={tour}
            searchDate={getSelectedDate()}
            activityDurationMinutes={activityDurationMinutes}
            onScrollBefore={handleScrollBefore}
            onScrollAfter={handleScrollAfter}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
}
