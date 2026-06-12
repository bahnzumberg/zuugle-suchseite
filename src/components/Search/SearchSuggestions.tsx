import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CabinOutlined from "@mui/icons-material/CabinOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import PeakIcon from "./icons/PeakIcon";
import LandscapeOutlined from "@mui/icons-material/LandscapeOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { SearchWithType } from "../../features/apiSlice";
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import TransportTrain from "../../icons/svg/ic_transport_train.svg?react";

export interface SearchSuggestionsProps {
  option: SearchWithType;
  props: HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  };
}

export const suggestionIconMap = {
  hut: CabinOutlined,
  peak: PeakIcon,
  range: LandscapeOutlined,
  term: SearchOutlined,
  city: TransportTrain,
};

const suggestionTitleMap = {
  hut: "filter.hut_filter_suggestion",
  peak: "filter.peak_filter_suggestion",
  range: "filter.region_filter_suggestion",
  term: "filter.term_filter_suggestion",
  city: "filter.city_filter_suggestion",
};

const suggestionHelperMap: Partial<Record<SearchWithType["type"], string>> = {
  range: "filter.region_filter_helper",
};

export const suggestionColorMap: Record<string, string> = {
  city: "var(--bzb-bahnblau)",
  range: "var(--bzb-bahnblau)",
  peak: "var(--bzb-akelei)",
  hut: "var(--bzb-akelei)",
  term: "#888",
};

export default function SearchSuggestions({
  option,
  props,
}: SearchSuggestionsProps) {
  const { t } = useTranslation();
  const Icon = suggestionIconMap[option.type];
  const title = t(suggestionTitleMap[option.type]);
  const helperKey = suggestionHelperMap[option.type];
  const iconColor = suggestionColorMap[option.type] ?? "#888";
  const secondaryText = helperKey ? (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
    >
      {option.type === "range" && (
        <TuneOutlinedIcon sx={{ fontSize: "0.9rem" }} />
      )}
      {t(helperKey)}
    </Box>
  ) : undefined;

  return (
    <ListItem
      {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderRadius: 1.5,
        mx: 0.5,
        my: 0.25,
        width: "auto",
      }}
      title={title}
    >
      <ListItemIcon
        sx={{ minWidth: 32, color: iconColor, "& path": { fill: iconColor } }}
      >
        {Icon ? (
          <Icon style={{ fontSize: "20px", width: 20, height: 20 }} />
        ) : null}
      </ListItemIcon>
      <ListItemText
        primary={option?.term}
        secondary={secondaryText}
        slotProps={{
          secondary: { sx: { fontSize: "0.8rem", lineHeight: 1.2 } },
        }}
      />
    </ListItem>
  );
}
