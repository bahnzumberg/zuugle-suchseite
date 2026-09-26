import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useMap } from "react-leaflet";
import L from "leaflet";
import CloudQueueOutlinedIcon from "@mui/icons-material/CloudQueueOutlined";
import { WeatherMetadata } from "../../models/weatherOverlay";

export function formatWeatherDayLabel(
  dateStr: string,
  t: TFunction,
  locale = "de-AT",
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const nowDate = new Date(year, month, day);

  const [dy, dm, dd] = dateStr.split("-").map(Number);
  const targetDate = new Date(dy, dm - 1, dd);

  const diffMs = targetDate.getTime() - nowDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return t("weather.today", { defaultValue: "Heute" });
  }
  if (diffDays === 1) {
    return t("weather.tomorrow", { defaultValue: "Morgen" });
  }

  const weekday = targetDate.toLocaleDateString(locale, { weekday: "short" });
  const padDay = String(dd).padStart(2, "0");
  const padMonth = String(dm).padStart(2, "0");
  return `${weekday}, ${padDay}.${padMonth}.`;
}

export function formatWeatherGeneratedAt(
  isoString: string,
  t: TFunction,
  locale = "de-AT",
): string {
  try {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Vienna",
    });
    const timeStr = d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Vienna",
    });
    const formattedDateTime = `${dateStr}, ${timeStr}`;

    return t("weather.as_of", {
      date: formattedDateTime,
      defaultValue: `Stand: ${formattedDateTime} Uhr`,
    });
  } catch {
    return isoString;
  }
}

interface WeatherButtonAndDaysProps {
  metadata: WeatherMetadata | null;
  isActive: boolean;
  selectedDate: string | null;
  onToggleActive: () => void;
  onSelectDate: (date: string) => void;
}

export const WeatherButtonAndDays: React.FC<WeatherButtonAndDaysProps> = ({
  metadata,
  isActive,
  selectedDate,
  onToggleActive,
  onSelectDate,
}) => {
  const { t, i18n } = useTranslation();

  const initContainer = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    L.DomEvent.disableScrollPropagation(node);
  }, []);

  if (!metadata || !metadata.days || metadata.days.length === 0) {
    return null;
  }

  return (
    <div
      ref={initContainer}
      className="leaflet-top leaflet-left weather-control-wrapper leaflet-control"
      style={{
        pointerEvents: "auto",
        marginTop: "12px",
        marginLeft: "12px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Wanderwetter Button */}
        <button
          type="button"
          onClick={() => onToggleActive()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 16px",
            borderRadius: "9999px",
            border: isActive ? "none" : "1px solid rgba(0, 0, 0, 0.12)",
            backgroundColor: isActive ? "#712579" : "rgba(255, 255, 255, 0.95)",
            color: isActive ? "#ffffff" : "#254980",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.85rem",
            boxShadow: isActive
              ? "0 2px 8px rgba(113, 37, 121, 0.4)"
              : "0 2px 6px rgba(0, 0, 0, 0.15)",
            transition: "all 0.18s ease-in-out",
          }}
        >
          <CloudQueueOutlinedIcon
            sx={{
              fontSize: 20,
              color: isActive ? "#ffffff" : "#712579",
            }}
          />
          <span>{t("weather.button", "Wanderwetter")}</span>
        </button>

        {/* Day selection directly underneath */}
        {isActive && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginTop: "8px",
              maxWidth: "340px",
            }}
          >
            {metadata.days.map((day) => {
              const isSelected = selectedDate === day.date;
              const label = formatWeatherDayLabel(day.date, t, i18n.language);
              return (
                <button
                  type="button"
                  key={day.date}
                  onClick={() => onSelectDate(day.date)}
                  style={{
                    borderRadius: "16px",
                    padding: "4px 12px",
                    fontSize: "0.75rem",
                    fontWeight: isSelected ? 700 : 600,
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(0, 0, 0, 0.15)",
                    backgroundColor: isSelected
                      ? "#712579"
                      : "rgba(255, 255, 255, 0.95)",
                    color: isSelected ? "#ffffff" : "#333333",
                    cursor: "pointer",
                    boxShadow: isSelected
                      ? "0 2px 6px rgba(113, 37, 121, 0.4)"
                      : "0 1px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.15s ease-in-out",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface WeatherLegendProps {
  metadata: WeatherMetadata | null;
  isActive: boolean;
}

export const WeatherLegend: React.FC<WeatherLegendProps> = ({
  metadata,
  isActive,
}) => {
  const { t, i18n } = useTranslation();

  const initContainer = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    L.DomEvent.disableScrollPropagation(node);
  }, []);

  if (!isActive || !metadata) {
    return null;
  }

  const formattedGeneratedAt = formatWeatherGeneratedAt(
    metadata.generated_at,
    t,
    i18n.language,
  );

  return (
    <div
      ref={initContainer}
      className="leaflet-top leaflet-right weather-control-wrapper leaflet-control"
      style={{
        pointerEvents: "auto",
        marginTop: "12px",
        marginRight: "12px",
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(4px)",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          padding: "8px 12px",
          minWidth: "175px",
          maxWidth: "220px",
        }}
      >
        {/* Gradient Bar */}
        <div
          style={{
            height: "8px",
            borderRadius: "4px",
            background:
              "linear-gradient(to right, #3b0f70 0%, #7b1fa2 15%, #b52a8f 30%, #e04a5f 45%, #f07d1a 58%, #e3b41c 72%, #8cbf2f 86%, #2f9e44 100%)",
          }}
        />

        {/* Labels below gradient */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
            fontSize: "0.72rem",
            color: "#666666",
            fontWeight: 500,
          }}
        >
          <span>{t("weather.legend_dangerous", "Gefährlich")}</span>
          <span>{t("weather.legend_excellent", "Ausgezeichnet")}</span>
        </div>

        {/* Subtle Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#ebebeb",
            margin: "6px 0",
          }}
        />

        {/* As of timestamp */}
        <div
          style={{
            fontSize: "0.7rem",
            color: "#666666",
            lineHeight: 1.2,
          }}
        >
          {formattedGeneratedAt}
        </div>
      </div>
    </div>
  );
};

/**
 * Creates a dedicated Leaflet pane for the weather overlay.
 * z-index 250 puts it above tilePane (200) and below overlayPane (400) / markerPane (600).
 */
export function WeatherPane() {
  const map = useMap();
  useEffect(() => {
    let pane = map.getPane("weatherPane");
    if (!pane) {
      pane = map.createPane("weatherPane");
      pane.style.zIndex = "250";
      pane.style.pointerEvents = "none";
    }
    // Physically insert weatherPane right after tilePane in the DOM
    const tilePane = map.getPane("tilePane");
    if (tilePane && tilePane.parentNode && pane && pane.parentNode) {
      tilePane.parentNode.insertBefore(pane, tilePane.nextSibling);
    }
  }, [map]);
  return null;
}

/**
 * Synchronizes the weather-active-map class to the Leaflet map container element.
 * React-Leaflet's MapContainer does not reactively update its DOM className after mount.
 */
export function WeatherClassWatcher({ isActive }: { isActive: boolean }) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;
    if (isActive) {
      container.classList.add("weather-active-map");
    } else {
      container.classList.remove("weather-active-map");
    }
  }, [map, isActive]);
  return null;
}

/**
 * Leaflet Control: Fullscreen toggle button rendered inside the map (bottom-left corner).
 */
export function FullscreenControl({
  isFullscreen,
  onToggle,
}: {
  isFullscreen: boolean;
  onToggle: () => void;
}) {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent map interactions from propagating through the button
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
  }, [map]);

  return (
    <div
      className="leaflet-bottom leaflet-left"
      style={{ pointerEvents: "auto" }}
    >
      <div ref={containerRef} className="leaflet-control leaflet-bar">
        <button
          type="button"
          onClick={onToggle}
          title={isFullscreen ? "Vollbild beenden" : "Vollbild"}
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#333">
            {isFullscreen ? (
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            ) : (
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
