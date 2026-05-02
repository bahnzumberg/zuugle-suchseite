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

interface ActiveChip {
  key: string;
  label: string;
  onDelete: () => void;
}

export default function TotalToursHeader({
  loadedTours,
}: {
  loadedTours?: { total: number };
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const storedFilter = useSelector((state: RootState) => state.filter);
  const city = useSelector((state: RootState) => state.search.city);

  /**
   * Build a list of removable chips from the active filter state.
   */
  function buildChips(): ActiveChip[] {
    const chips: ActiveChip[] = [];

    // City chip
    if (city) {
      chips.push({
        key: "city",
        label: `${t("search.ab_heimatbahnhof")} ${city.label}`,
        onDelete: () => dispatch(cityUpdated(null)),
      });
    }

    // Helper to remove a single key from the stored filter
    const removeFilterKey = (...keys: (keyof FilterObject)[]) => {
      const next = { ...storedFilter };
      for (const k of keys) {
        delete next[k];
      }
      dispatch(filterUpdated(next));
    };

    // Boolean filters
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

    // Range filters (ascent, distance, transport duration)
    if (
      storedFilter.minAscent !== undefined ||
      storedFilter.maxAscent !== undefined
    ) {
      const label = `${t("filter.anstieg")}: ${storedFilter.minAscent ?? 0}–${storedFilter.maxAscent ?? "∞"} hm`;
      chips.push({
        key: "ascent",
        label,
        onDelete: () =>
          removeFilterKey("minAscent", "maxAscent", "minDescent", "maxDescent"),
      });
    }
    if (
      storedFilter.minDistance !== undefined ||
      storedFilter.maxDistance !== undefined
    ) {
      const label = `${t("filter.gehdistanz")}: ${storedFilter.minDistance ?? 0}–${storedFilter.maxDistance ?? "∞"} km`;
      chips.push({
        key: "distance",
        label,
        onDelete: () => removeFilterKey("minDistance", "maxDistance"),
      });
    }
    if (
      storedFilter.minTransportDuration !== undefined ||
      storedFilter.maxTransportDuration !== undefined
    ) {
      const label = `${t("details.anreisedauer")}: ${storedFilter.minTransportDuration ?? 0}–${storedFilter.maxTransportDuration ?? "∞"} h`;
      chips.push({
        key: "transport",
        label,
        onDelete: () =>
          removeFilterKey("minTransportDuration", "maxTransportDuration"),
      });
    }

    // Array-based filters
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
              {chips.length > 0 ? ":" : ""}
            </Typography>
          )}
          {chips.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              {chips.map((chip) => (
                <Chip
                  key={chip.key}
                  label={chip.label}
                  onDelete={chip.onDelete}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    backgroundColor: "var(--bzb-lindgruen)",
                    color: "var(--bzb-bahnblau)",
                    fontWeight: 500,
                    fontSize: "13px",
                    borderRadius: "16px",
                    "& .MuiChip-deleteIcon": {
                      color: "rgba(37, 73, 128, 0.6)",
                      fontSize: "16px",
                      "&:hover": {
                        color: "var(--bzb-bahnblau)",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
