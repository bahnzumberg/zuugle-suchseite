import { useState, useEffect, Fragment } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import {
  useGetCitiesQuery,
  useLazyGetSearchPhrasesQuery,
} from "../../features/apiSlice";
import { getTLD } from "../../utils/globals";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import {
  CityObject,
  cityUpdated,
  searchPhraseUpdated,
} from "../../features/searchSlice";
import { useNavigate } from "react-router";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

export interface CustomSelectProps {
  setShowSearchModal: (showSearchModal: boolean) => void;
}
export default function CustomSelect() {
  const { t } = useTranslation();
  const [triggerGetSuggestions, { data: suggestions, isFetching: isLoading }] =
    useLazyGetSearchPhrasesQuery();
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

  const handleSelect = (phrase: string | null) => {
    //if search phrase corresponds to a city, set the city
    const matchedCity: CityObject | undefined = allCities.find(
      (city) =>
        city.label.toLowerCase() === phrase?.toLowerCase() ||
        city.value.toLowerCase() === phrase?.toLowerCase(),
    );
    if (isSearchPage) {
      if (matchedCity) {
        dispatch(cityUpdated(matchedCity));
      } else {
        dispatch(searchPhraseUpdated(phrase));
      }
    } else {
      const searchParams = new URLSearchParams();
      if (matchedCity) {
        searchParams.set("city", matchedCity.value);
      } else if (phrase) {
        searchParams.set("search", phrase);
      }
      if (provider) {
        searchParams.set("provider", provider);
      }
      navigate(`/search?${searchParams.toString()}`);
    }
    // setShowSearchModal(false);
  };

  useEffect(() => {
    const tld = getTLD();
    const _city = city?.value ?? "";

    triggerGetSuggestions({
      search: searchString,
      city: _city,
      language: language || "de",
      tld: tld,
    });
  }, [searchString]);

  return (
    <Autocomplete
      freeSolo
      clearOnBlur
      selectOnFocus
      filterOptions={(x) => x} // Disable built-in filtering, we handle filtering on the server
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option.suggestion;
      }}
      options={suggestions?.items ?? []}
      value={currentSearchPhrase}
      inputValue={searchString}
      onInputChange={(event, newInputValue) => {
        setSearchString(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (!newValue) {
          handleSelect("");
          return;
        }
        const phrase =
          typeof newValue === "string"
            ? newValue
            : (newValue?.suggestion ?? "");
        handleSelect(phrase);
      }}
      renderOption={(props, option) => {
        return (
          <ListItem>
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
                <LocationOnOutlined
                  style={{ fontSize: "24px", color: "#8b8b8b" }}
                />
              </div>
            </ListItemIcon>
            <ListItemText primary={option?.suggestion} />
          </ListItem>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("start.suche")}
          onKeyDown={(ev) => {
            if (ev.key === "Enter" && searchString) {
              handleSelect(searchString);
              ev.preventDefault();
            }
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: <SearchIcon sx={{ px: 1, color: "#666" }} />,
              endAdornment: (
                <Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}
