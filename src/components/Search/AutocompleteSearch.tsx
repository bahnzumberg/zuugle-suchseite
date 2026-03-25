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
import { cityUpdated, searchWithTypeUpdated } from "../../features/searchSlice";
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
  const currentSearch = useSelector(
    (state: RootState) => state.search.searchWithType,
  );
  const city = useSelector((state: RootState) => state.search.city);
  const language = useSelector((state: RootState) => state.search.language);
  const provider = useSelector((state: RootState) => state.search.provider);
  const [searchWithType, setSearchWithType] = useState<SearchWithType>(
    currentSearch ?? { term: "", type: "term" },
  );
  const { data: allCities = [] } = useGetCitiesQuery();
  const isSearchPage = window.location.pathname === "/search";
  const suggestions =
    searchWithType?.term.length < 3 ? [] : (suggestionsResults?.items ?? []);
  const navigate = useNavigate();
  const debouncedTrigger = useMemo(() => {
    return debounce(triggerGetSuggestions, 300);
  }, [triggerGetSuggestions]);

  useEffect(() => {
    return () => debouncedTrigger.cancel();
  }, [debouncedTrigger]);

  const handleSelect = (search: SearchWithType) => {
    if (search.type === "city") {
      const matchedCity = allCities.find(
        (city) =>
          city.label.toLowerCase() === search.term?.toLowerCase() ||
          city.value.toLowerCase() === search.term?.toLowerCase(),
      );
      if (matchedCity) {
        dispatch(cityUpdated(matchedCity));
      }
    } else if (search.type === "range") {
      // TODO set filter
    } else {
      dispatch(searchWithTypeUpdated(search));
    }

    if (!isSearchPage) {
      const searchParams = new URLSearchParams();
      if (provider) {
        searchParams.set("provider", provider);
      }
      if (search.type === "range") {
        searchParams.set("range", search.term);
      } else if (search.type !== "term") {
        searchParams.set("search_type", search.type);
      }
      searchParams.set("search", search.term);
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const handleSearchStringChange = (input: string) => {
    setSearchWithType({ term: input, type: "term" });
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
      value={currentSearch}
      inputValue={searchWithType.term}
      onInputChange={(event, newInputValue) => {
        handleSearchStringChange(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (!newValue) {
          handleSelect({ term: "", type: "term" });
          return;
        }
        if (typeof newValue === "string") {
          handleSelect({ term: newValue, type: "term" });
          return;
        }
        handleSelect(newValue);
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
            if (ev.key === "Enter" && searchWithType) {
              handleSelect(searchWithType);
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
