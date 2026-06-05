import { useEffect, useRef, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Tour } from "../../models/Tour";

// Declare the global DianaWidget constructor so TypeScript knows about it
declare global {
  interface Window {
    dianaActivityConfig?: Record<string, unknown>;
    DianaWidget?: new (
      config: Record<string, unknown>,
      containerId: string,
    ) => { setSelectedDate?: (date: string) => void };
  }
}

interface DianaWidgetWrapperProps {
  tour: Tour;
  cityLabel?: string;
}

// Use same base URL logic as apiSlice: dev → localhost:8080, prod → relative
const API_BASE =
  window.location.host.indexOf("localhost") >= 0
    ? (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api")
    : `${window.location.protocol}//${window.location.host}/api`;

const DIANA_TOKEN_URL = `${API_BASE}/diana-token`;
const WIDGET_BUNDLE_URL = "/DianaWidget.bundle.js";

/**
 * Fetches a Diana API access token from our backend proxy.
 */
async function fetchDianaToken(): Promise<string> {
  const resp = await fetch(DIANA_TOKEN_URL);
  if (!resp.ok) {
    throw new Error(`Diana token fetch failed: ${resp.status}`);
  }
  const data = await resp.json();
  return data.access_token;
}

/**
 * Dynamically loads the DianaWidget bundle script if not already present.
 */
function loadWidgetScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded?
    if (window.DianaWidget) {
      resolve();
      return;
    }

    // Already loading?
    const existing = document.querySelector(
      `script[src="${WIDGET_BUNDLE_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Widget script failed to load")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = WIDGET_BUNDLE_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Widget script failed to load"));
    document.head.appendChild(script);
  });
}

/**
 * Map i18n language code to Diana widget language format.
 */
function mapLanguage(lang: string): string {
  const code = lang.substring(0, 2).toUpperCase();
  // Diana supports: DE, EN, FR, IT, TH, ES
  // Slovenian (SL) falls back to EN
  const supported = ["DE", "EN", "FR", "IT"];
  return supported.includes(code) ? code : "EN";
}

/**
 * Convert tour's avg_total_tour_duration (decimal hours, e.g. 5.75)
 * to minutes for the Diana API.
 */
function durationToMinutes(duration: string): number {
  const hours = parseFloat(duration);
  if (isNaN(hours) || hours <= 0) return 180; // default 3h
  return Math.round(hours * 60);
}

const DianaWidgetWrapper = ({ tour, cityLabel }: DianaWidgetWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const onTokenExpired = useCallback(async () => {
    return await fetchDianaToken();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        // 1. Get token
        const token = await fetchDianaToken();
        if (cancelled) return;

        // 2. Load widget bundle
        await loadWidgetScript();
        if (cancelled) return;

        if (!window.DianaWidget) {
          throw new Error("DianaWidget not found after script load");
        }

        // 3. Build config
        const startCoords = `${tour.connection_arrival_stop_lat},${tour.connection_arrival_stop_lon}`;

        // For traverses (start ≠ end), we still use the same coordinates
        // because the Tour model only provides arrival stop coordinates.
        // The Diana API will find the nearest public transport stop.
        const endCoords = startCoords;

        const config: Record<string, unknown> = {
          activityName: tour.title,
          activityStartLocation: startCoords,
          activityStartLocationType: "coordinates",
          activityEndLocation: endCoords,
          activityEndLocationType: "coordinates",
          activityEarliestStartTime: "06:00",
          activityLatestStartTime: "13:00",
          activityEarliestEndTime: "10:00",
          activityLatestEndTime: "20:00",
          activityDurationMinutes: durationToMinutes(
            tour.avg_total_tour_duration,
          ),
          apiToken: token,
          language: mapLanguage(i18n.language),
          timezone: "Europe/Vienna",
          share: true,
          allowShareView: true,
          cacheUserStartLocation: true,
          userStartLocationCacheTTLMinutes: 60,
          onApiTokenExpired: onTokenExpired,
        };

        // Multi-day tours
        if (tour.number_of_days > 1) {
          config.multiday = true;
        }

        // Pre-fill city if available
        if (cityLabel) {
          config.overrideUserStartLocation = cityLabel;
          config.overrideUserStartLocationType = "address";
        }

        // 4. Instantiate widget
        const containerId = "dianaWidgetContainer";
        if (containerRef.current) {
          // Clear any previous widget content
          containerRef.current.innerHTML = "";
        }

        widgetRef.current = new window.DianaWidget(config, containerId);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error("Diana Widget init error:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Widget konnte nicht geladen werden",
          );
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [tour.id, cityLabel, onTokenExpired]);

  if (error) {
    return (
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "14px", color: "#101010", lineHeight: "20px" }}
        >
          Fahrplan konnte nicht geladen werden.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", minHeight: "400px" }}>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      <div
        id="dianaWidgetContainer"
        ref={containerRef}
        style={{
          maxHeight: "620px",
          borderRadius: "12px",
          overflow: "hidden",
          display: loading ? "none" : "block",
        }}
      />
    </Box>
  );
};

export default DianaWidgetWrapper;
