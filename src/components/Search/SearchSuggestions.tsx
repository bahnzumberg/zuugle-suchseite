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
import { ReactComponent as TransportTrain } from "../../icons/svg/ic_transport_train.svg";

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

export default function SearchSuggestions({
  option,
  props,
}: SearchSuggestionsProps) {
  const { t } = useTranslation();
  const Icon = suggestionIconMap[option.type];
  const title = t(suggestionTitleMap[option.type]);
  const helperKey = suggestionHelperMap[option.type];
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
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
      title={title}
    >
      <ListItemIcon sx={{ "& path": { fill: "#8b8b8b" } }}>
        <div
          style={{
            borderRadius: "10px",
            backgroundColor: "#d9d9d9",
            height: "40px",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Icon ? (
            <Icon style={{ fontSize: "24px", color: "#8b8b8b" }} />
          ) : null}
        </div>
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
