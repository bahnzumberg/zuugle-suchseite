import { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import {
  useGetCitiesQuery,
  useLazyGetSearchSuggestionsQuery,
} from "../../features/apiSlice";
import type { SuggestionType } from "../../features/apiSlice";
import { getTLD } from "../../utils/globals";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { cityUpdated, searchPhraseUpdated } from "../../features/searchSlice";
import { useNavigate } from "react-router";
import Close from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CabinOutlined from "@mui/icons-material/CabinOutlined";
import FilterHdrOutlined from "@mui/icons-material/FilterHdrOutlined";
import LandscapeOutlined from "@mui/icons-material/LandscapeOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

export interface CustomSelectProps {
  setShowSearchModal: (showSearchModal: boolean) => void;
}

const suggestionIconMap: Record<SuggestionType, React.ElementType> = {
  hut: CabinOutlined,
  peak: FilterHdrOutlined,
  range: LandscapeOutlined,
  term: SearchOutlined,
};

export default function CustomSelect({
  setShowSearchModal,
}: CustomSelectProps) {
  const { t } = useTranslation();
  const [triggerGetSuggestions, suggestionsResult] =
    useLazyGetSearchSuggestionsQuery();
  const dispatch = useAppDispatch();
  const currentSearchPhrase = useSelector(
    (state: RootState) => state.search.searchPhrase,
  );
  const city = useSelector((state: RootState) => state.search.city);
  const language = useSelector((state: RootState) => state.search.language);
  const provider = useSelector((state: RootState) => state.search.provider);
  const [searchString, setSearchString] = useState(currentSearchPhrase || "");
  const { data: allCities = [] } = useGetCitiesQuery();
  const isSearchPage = window.location.pathname === "/search";
  const navigate = useNavigate();

  const handleSelect = (phrase: string) => {
    //if search phrase corresponds to a city, set the city
    const matchedCity = allCities.find(
      (city) =>
        city.label.toLowerCase() === phrase.toLowerCase() ||
        city.value.toLowerCase() === phrase.toLowerCase(),
    );

    if (isSearchPage) {
      if (matchedCity) {
        dispatch(cityUpdated(matchedCity));
      } else {
        if (phrase.length > 3) {
          dispatch(searchPhraseUpdated(phrase));
        }
      }
    } else {
      const searchParams = new URLSearchParams();
      if (matchedCity) {
        searchParams.set("city", matchedCity.value);
      } else {
        searchParams.set("search", phrase);
      }
      if (provider) {
        searchParams.set("provider", provider);
      }
      navigate(`/search?${searchParams.toString()}`);
    }
    setShowSearchModal(false);
  };

  const debouncedTrigger = useMemo(
    () => debounce(triggerGetSuggestions, 300),
    [triggerGetSuggestions],
  );

  const handleSearchStringChange = (input: string) => {
    setSearchString(input);

    if (input.length < 3) return;

    const tld = getTLD();
    const _city = city?.value ?? "";
    debouncedTrigger(
      {
        search: input,
        city: _city,
        language: language || "de",
        tld: tld,
      },
      true,
    );
  };

  const suggestions =
    searchString.length >= 3 ? (suggestionsResult.data?.items ?? []) : [];

  return (
    <>
      <Grid container alignItems="center" width={"100%"}>
        {/* Input Field Area */}
        <Grid
          container
          alignItems="center"
          sx={{
            flexGrow: 1,
            borderRadius: "17px",
            border: "1px solid #ccc",
            p: "10px",
          }}
        >
          {/* Search Icon */}
          <SearchIcon sx={{ px: 1 }} />

          {/* Input Field */}
          <InputBase
            sx={{ flexGrow: 1 }}
            value={searchString}
            autoFocus
            onChange={(event) => handleSearchStringChange(event.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleSelect(searchString);
                ev.preventDefault();
              }
            }}
          />

          {/* Clear Button */}
          <IconButton
            onClick={() => setSearchString("")}
            aria-label={t("search.abbrechen")}
          >
            <Close sx={{ fontSize: 16, color: "#8b8b8b" }} />
          </IconButton>
        </Grid>

        {/* Arrow Button */}
        <Grid sx={{ pl: 1 }}>
          <IconButton
            sx={{
              borderRadius: "50%",
              border: "1px solid #d9d9d9",
              height: "40px",
              width: "40px",
            }}
            onClick={(ev) => {
              handleSelect(searchString);
              ev.preventDefault();
            }}
            title={t("search.search")}
            aria-label={t("search.search")}
          >
            <ArrowForward sx={{ fontSize: 24, color: "#4992ff" }} />
          </IconButton>
        </Grid>
      </Grid>
      <List>
        {suggestions.map((option, index) => {
          const Icon = suggestionIconMap[option.type] ?? SearchOutlined;
          return (
            <ListItem disablePadding key={index}>
              <ListItemButton
                onClick={(ev) => {
                  handleSelect(option?.text);
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
                    <Icon style={{ fontSize: "24px", color: "#8b8b8b" }} />
                  </div>
                </ListItemIcon>
                <ListItemText primary={option?.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
