import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CabinOutlined from "@mui/icons-material/CabinOutlined";
import PeakIcon from "./icons/PeakIcon";
import LandscapeOutlined from "@mui/icons-material/LandscapeOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { SearchWithType } from "../../features/apiSlice";
import { HTMLAttributes } from "react";
import { ReactComponent as TransportTrain } from "../../icons/svg/ic_transport_train.svg";

export interface SearchSuggestionsProps {
  option: SearchWithType;
  props: HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  };
}

const suggestionIconMap = {
  hut: CabinOutlined,
  peak: PeakIcon,
  range: LandscapeOutlined,
  term: SearchOutlined,
  city: TransportTrain,
};

export default function SearchSuggestions({
  option,
  props,
}: SearchSuggestionsProps) {
  const Icon = suggestionIconMap[option.type] ?? null;
  return (
    <ListItem {...props}>
      <ListItemIcon>
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
      <ListItemText primary={option?.term} />
    </ListItem>
  );
}
