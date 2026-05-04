import { useMemo, useEffect, Fragment } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import {
  SearchWithType,
  useLazyGetSearchSuggestionsQuery,
} from "../../features/apiSlice";
import { getTLD } from "../../utils/globals";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import SearchSuggestions, { suggestionIconMap } from "./SearchSuggestions";

interface AutocompleteSearchProps {
  inputVariant?: "standard" | "outlined" | "filled";
  handleSearch: (search: SearchWithType | null) => void;
  searchWithType: SearchWithType;
  setSearchWithType: (searchWithType: SearchWithType) => void;
}

export default function AutocompleteSearch({
  inputVariant,
  handleSearch,
  searchWithType,
  setSearchWithType,
}: AutocompleteSearchProps) {
  const { t } = useTranslation();
  const [
    triggerGetSuggestions,
    {
      data: suggestionsResults,
      isFetching: suggestionsFetching,
      reset: resetSuggestions,
    },
  ] = useLazyGetSearchSuggestionsQuery();

  const currentSearch = useSelector(
    (state: RootState) => state.search.searchWithType,
  );
  const city = useSelector((state: RootState) => state.search.city);
  const language = useSelector((state: RootState) => state.search.language);
  const suggestions =
    searchWithType?.term.length < 3 ? [] : (suggestionsResults?.items ?? []);
  const debouncedTrigger = useMemo(() => {
    return debounce(triggerGetSuggestions, 300);
  }, [triggerGetSuggestions]);

  const Icon = useMemo(
    () => suggestionIconMap[searchWithType.type] ?? SearchIcon,
    [searchWithType.type],
  );

  useEffect(() => {
    return () => debouncedTrigger.cancel();
  }, [debouncedTrigger]);

  const handleSearchStringChange = (input: string) => {
    setSearchWithType({ term: input, type: "term" });
    resetSuggestions();
    if (input.length < 3) return;
    const tld = getTLD();
    const _city = city?.value && city?.value !== "no-city" ? city.value : "";

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
          handleSearch(null);
          return;
        }
        if (typeof newValue === "string") {
          handleSearch({ term: newValue, type: "term" });
          return;
        }
        handleSearch(newValue);
      }}
      renderOption={(props, option) => (
        <SearchSuggestions option={option} props={props} />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("start.placeholder_suche")}
          variant={inputVariant}
          slotProps={{
            ...params.slotProps,

            input: {
              ...params.slotProps.input,
              disableUnderline: true,
              startAdornment: currentSearch ? (
                <Icon sx={{ px: 1, color: "#666", marginRight: 1 }} />
              ) : null,
              endAdornment: (
                <Fragment>
                  {suggestionsFetching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.slotProps.input.endAdornment}
                </Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}
