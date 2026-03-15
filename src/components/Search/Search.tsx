import Box from "@mui/material/Box";
import SearchActionButton from "./SearchActionButton";
import AutocompleteSearch from "./AutocompleteSearch";
import AutocompleteCitySelection from "./AutocompleteCitySelection";

export interface SearchProps {
  pageKey: string;
  isSearchResultsPage: boolean;
  setFilterOn: (filterOn: boolean) => void;
}

export default function Search({
  pageKey,
  isSearchResultsPage: isSearchResultsPage,
  setFilterOn,
}: SearchProps) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AutocompleteCitySelection />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <AutocompleteSearch />
      </Box>
      <SearchActionButton
        isSearchResultsPage={isSearchResultsPage}
        pageKey={pageKey}
        city={undefined}
        searchPhrase={undefined}
        provider={undefined}
        setFilterOn={setFilterOn}
      />
    </>
  );
}
