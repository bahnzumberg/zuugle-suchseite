import { useState, useMemo, useEffect, Fragment } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import {
  SearchWithType,
  useGetCitiesQuery,
  useLazyGetSearchSuggestionsQuery,
} from "../../features/apiSlice";
import { getTLD } from "../../utils/globals";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { cityUpdated, searchPhraseUpdated } from "../../features/searchSlice";
import { useNavigate } from "react-router";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import SearchSuggestions from "./SearchSuggestions";

export default function AutocompleteSearch({
  inputVariant,
}: {
  inputVariant?: "standard" | "outlined" | "filled";
}) {
  const { t } = useTranslation();
  const [
    triggerGetSuggestions,
    {
      data: suggestionsResults,
      isFetching: suggestionsFetching,
      reset: resetSuggestions,
    },
  ] = useLazyGetSearchSuggestionsQuery();
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
  const suggestions =
    searchString.length < 3 ? [] : (suggestionsResults?.items ?? []);
  const navigate = useNavigate();
  const debouncedTrigger = useMemo(() => {
    return debounce(triggerGetSuggestions, 300);
  }, [triggerGetSuggestions]);

  useEffect(() => {
    return () => debouncedTrigger.cancel();
  }, [debouncedTrigger]);

  const handleSelect = (search: SearchWithType) => {
    //if search phrase corresponds to a city, set the city
    const matchedCity = allCities.find(
      (city) =>
        city.label.toLowerCase() === search.term?.toLowerCase() ||
        city.value.toLowerCase() === search.term?.toLowerCase(),
    );

    if (isSearchPage) {
      if (matchedCity) {
        dispatch(cityUpdated(matchedCity));
      } else {
        dispatch(searchPhraseUpdated(search.term));
      }
    } else {
      const searchParams = new URLSearchParams();
      if (matchedCity) {
        searchParams.set("city", matchedCity.value);
      } else if (search.term) {
        searchParams.set("search", search.term);
      }
      if (provider) {
        searchParams.set("provider", provider);
      }
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const handleSearchStringChange = (input: string) => {
    setSearchString(input);
    resetSuggestions();
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

  return (
    <Autocomplete
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
        listbox: { sx: { borderRadius: 3 } },
      }}
      freeSolo
      blurOnSelect
      clearOnBlur
      selectOnFocus
      filterOptions={(x) => x} // Disable built-in filtering, we handle filtering on the server
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option.term;
      }}
      options={suggestions}
      value={currentSearchPhrase}
      inputValue={searchString}
      onInputChange={(event, newInputValue) => {
        handleSearchStringChange(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (!newValue) {
          handleSelect({ term: "", type: "term" });
          return;
        }
        const phrase =
          typeof newValue === "string" ? newValue : (newValue?.term ?? "");
        handleSelect({ term: phrase, type: "term" });
      }}
      renderOption={(props, option) => (
        <SearchSuggestions option={option} props={props} />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("start.suche")}
          variant={inputVariant}
          sx={{
            "& .MuiInputBase-input::placeholder": {
              fontWeight: "bold", // Makes placeholder text bold
              fontSize: "16px", // Optional: adjust font size
              opacity: "1",
            },
          }}
          onKeyDown={(ev) => {
            if (ev.key === "Enter" && searchString) {
              handleSelect({ term: searchString, type: "term" });
              ev.preventDefault();
            }
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              disableUnderline: true,
              startAdornment: <SearchIcon sx={{ px: 1, color: "#666" }} />,
              endAdornment: (
                <Fragment>
                  {suggestionsFetching ? (
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
