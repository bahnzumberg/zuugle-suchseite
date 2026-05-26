import { useRef, useState, useLayoutEffect, useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { useAppDispatch } from "../hooks";
import { filterUpdated } from "../features/filterSlice";
import { cityUpdated } from "../features/searchSlice";
import { FilterObject } from "../models/Filter";
import {
  getCountryTranslationMap,
  getDifficultyTranslationMap,
  getLanguageTranslationMap,
  getSportTypeTranslationMap,
} from "./Filter/utils";

const MAX_CHIPS = 5;

interface ActiveChip {
  key: string;
  label: string;
  onDelete: () => void;
}

export default function TotalToursHeader({
  loadedTours,
  setFilterOn,
}: {
  loadedTours?: { total: number };
  setFilterOn?: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const storedFilter = useSelector((state: RootState) => state.filter);
  const city = useSelector((state: RootState) => state.search.city);

  // maxVisible = how many regular chips to show before "N weitere Filter"
  // Starts at MAX_CHIPS - 1 = 4; reduced by ResizeObserver if overflow
  const [maxVisible, setMaxVisible] = useState(MAX_CHIPS - 1);
  const chipsRowRef = useRef<HTMLDivElement>(null);

  function buildChips(): ActiveChip[] {
    const chips: ActiveChip[] = [];

    if (city) {
      chips.push({
        key: "city",
        label: `${t("search.ab_heimatbahnhof")} ${city.label}`,
        onDelete: () => dispatch(cityUpdated(null)),
      });
    }

    const removeFilterKey = (...keys: (keyof FilterObject)[]) => {
      const next = { ...storedFilter };
      for (const k of keys) delete next[k];
      dispatch(filterUpdated(next));
    };

    if (storedFilter.singleDayTour === true) {
      chips.push({
        key: "singleDay",
        label: t("filter.tagestour"),
        onDelete: () => removeFilterKey("singleDayTour"),
      });
    }
    if (storedFilter.multipleDayTour === true) {
      chips.push({
        key: "multiDay",
        label: t("filter.mehrtagestour"),
        onDelete: () => removeFilterKey("multipleDayTour"),
      });
    }
    if (storedFilter.summerSeason === true) {
      chips.push({
        key: "summer",
        label: t("filter.sommertour"),
        onDelete: () => removeFilterKey("summerSeason"),
      });
    }
    if (storedFilter.winterSeason === true) {
      chips.push({
        key: "winter",
        label: t("filter.wintertour"),
        onDelete: () => removeFilterKey("winterSeason"),
      });
    }
    if (storedFilter.traverse === true) {
      chips.push({
        key: "traverse",
        label: t("filter.nur_ueberschreitungen"),
        onDelete: () => removeFilterKey("traverse"),
      });
    }

    if (
      storedFilter.minAscent !== undefined ||
      storedFilter.maxAscent !== undefined
    ) {
      chips.push({
        key: "ascent",
        label: `${t("filter.anstieg")}: ${storedFilter.minAscent ?? 0}–${storedFilter.maxAscent ?? "∞"} hm`,
        onDelete: () =>
          removeFilterKey("minAscent", "maxAscent", "minDescent", "maxDescent"),
      });
    }
    if (
      storedFilter.minDistance !== undefined ||
      storedFilter.maxDistance !== undefined
    ) {
      chips.push({
        key: "distance",
        label: `${t("filter.gehdistanz")}: ${storedFilter.minDistance ?? 0}–${storedFilter.maxDistance ?? "∞"} km`,
        onDelete: () => removeFilterKey("minDistance", "maxDistance"),
      });
    }
    if (
      storedFilter.minTransportDuration !== undefined ||
      storedFilter.maxTransportDuration !== undefined
    ) {
      chips.push({
        key: "transport",
        label: `${t("details.anreisedauer")}: ${storedFilter.minTransportDuration ?? 0}–${storedFilter.maxTransportDuration ?? "∞"} h`,
        onDelete: () =>
          removeFilterKey("minTransportDuration", "maxTransportDuration"),
      });
    }

    const sportMap = getSportTypeTranslationMap(t);
    if (storedFilter.types && storedFilter.types.length > 0) {
      for (const type of storedFilter.types) {
        chips.push({
          key: `type-${type}`,
          label: sportMap[type] ?? type,
          onDelete: () => {
            const next = (storedFilter.types ?? []).filter((v) => v !== type);
            dispatch(
              filterUpdated({
                ...storedFilter,
                types: next.length ? next : undefined,
              }),
            );
          },
        });
      }
    }

    const diffMap = getDifficultyTranslationMap(t);
    if (storedFilter.difficulties && storedFilter.difficulties.length > 0) {
      for (const diff of storedFilter.difficulties) {
        chips.push({
          key: `diff-${diff}`,
          label: `${t("filter.schwierigkeit")}: ${diffMap[diff] ?? diff}`,
          onDelete: () => {
            const next = (storedFilter.difficulties ?? []).filter(
              (v) => v !== diff,
            );
            dispatch(
              filterUpdated({
                ...storedFilter,
                difficulties: next.length ? next : undefined,
              }),
            );
          },
        });
      }
    }

    const langMap = getLanguageTranslationMap(t);
    if (storedFilter.languages && storedFilter.languages.length > 0) {
      for (const lang of storedFilter.languages) {
        chips.push({
          key: `lang-${lang}`,
          label: langMap[lang] ?? lang,
          onDelete: () => {
            const next = (storedFilter.languages ?? []).filter(
              (v) => v !== lang,
            );
            dispatch(
              filterUpdated({
                ...storedFilter,
                languages: next.length ? next : undefined,
              }),
            );
          },
        });
      }
    }

    if (storedFilter.ranges && storedFilter.ranges.length > 0) {
      for (const range of storedFilter.ranges) {
        chips.push({
          key: `range-${range}`,
          label: range,
          onDelete: () => {
            const next = (storedFilter.ranges ?? []).filter((v) => v !== range);
            dispatch(
              filterUpdated({
                ...storedFilter,
                ranges: next.length ? next : undefined,
              }),
            );
          },
        });
      }
    }

    const countryMap = getCountryTranslationMap(t);
    if (storedFilter.countries && storedFilter.countries.length > 0) {
      for (const country of storedFilter.countries) {
        chips.push({
          key: `country-${country}`,
          label: countryMap[country] ?? country,
          onDelete: () => {
            const next = (storedFilter.countries ?? []).filter(
              (v) => v !== country,
            );
            dispatch(
              filterUpdated({
                ...storedFilter,
                countries: next.length ? next : undefined,
              }),
            );
          },
        });
      }
    }

    if (storedFilter.providers && storedFilter.providers.length > 0) {
      for (const provider of storedFilter.providers) {
        chips.push({
          key: `provider-${provider}`,
          label: provider,
          onDelete: () => {
            const next = (storedFilter.providers ?? []).filter(
              (v) => v !== provider,
            );
            dispatch(
              filterUpdated({
                ...storedFilter,
                providers: next.length ? next : undefined,
              }),
            );
          },
        });
      }
    }

    return chips;
  }

  const chips = buildChips();

  // Decide how many chips to show
  const needsOverflow = chips.length > MAX_CHIPS;
  const visibleCount = needsOverflow ? maxVisible : chips.length;
  const hiddenCount = needsOverflow ? chips.length - visibleCount : 0;
  const visibleChips = chips.slice(0, visibleCount);

  // Reduce maxVisible if chip row overflows (runs before paint)
  useLayoutEffect(() => {
    if (!needsOverflow) return;
    const el = chipsRowRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth + 1) {
      setMaxVisible((v) => Math.max(1, v - 1));
    }
  }, [maxVisible, needsOverflow, chips.length]);

  // On container resize, reset to max and let layout effect adjust
  useEffect(() => {
    const el = chipsRowRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setMaxVisible(MAX_CHIPS - 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chipSx = {
    flexShrink: 0,
    backgroundColor: "var(--bzb-lindgruen)",
    color: "var(--bzb-bahnblau)",
    fontWeight: 500,
    fontSize: "13px",
    borderRadius: "16px",
    "& .MuiChip-deleteIcon": {
      color: "rgba(37, 73, 128, 0.6)",
      fontSize: "16px",
      "&:hover": { color: "var(--bzb-bahnblau)" },
    },
  };

  return (
    <Box className={"header-line-main"} sx={{ width: "100%" }}>
      <Box
        sx={{
          paddingTop: "35px",
          paddingBottom: "6px",
          paddingX: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          overflow: "hidden",
          flexWrap: "nowrap",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          {loadedTours?.total != undefined && (
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#333",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {Number(loadedTours.total).toLocaleString()}
              {loadedTours.total === 1
                ? ` ${t("main.ergebnis")}`
                : ` ${t("main.ergebnisse")}`}
              {chips.length > 0 && (
                <Box
                  component="span"
                  sx={{ color: "#aaa", fontWeight: 400, ml: "2px" }}
                >
                  {" "}
                  |
                </Box>
              )}
            </Typography>
          )}
          {chips.length > 0 && (
            <Box
              ref={chipsRowRef}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              {visibleChips.map((chip) => (
                <Chip
                  key={chip.key}
                  label={chip.label}
                  onDelete={chip.onDelete}
                  size="small"
                  sx={chipSx}
                />
              ))}
              {hiddenCount > 0 && (
                <Chip
                  label={`${hiddenCount} ${t("filter.weitere_filter")}`}
                  size="small"
                  onClick={() => setFilterOn?.(true)}
                  sx={{
                    ...chipSx,
                    flexShrink: 0,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--bzb-bahnblau)",
                      color: "#fff",
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
