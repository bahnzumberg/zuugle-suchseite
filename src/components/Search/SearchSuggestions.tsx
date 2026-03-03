import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CabinOutlined from "@mui/icons-material/CabinOutlined";
import PeakIcon from "./icons/PeakIcon";
import LandscapeOutlined from "@mui/icons-material/LandscapeOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { AutocompleteSuggestionType } from "../../features/apiSlice";

export interface Suggestion {
  text: string;
  type: AutocompleteSuggestionType;
}

export interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}

const suggestionIconMap = {
  hut: CabinOutlined,
  peak: PeakIcon,
  range: LandscapeOutlined,
  term: SearchOutlined,
};

export default function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  return (
    <List>
      {suggestions.map((option, index) => {
        const Icon = suggestionIconMap[option.type] ?? null;
        return (
          <ListItem disablePadding key={index}>
            <ListItemButton
              onClick={(ev) => {
                onSelect(option?.text);
                ev.preventDefault();
              }}
            >
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
              <ListItemText primary={option?.text} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
