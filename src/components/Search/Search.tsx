import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { hasContent } from "../../utils/globals";
import { RootState } from "../..";
import FilterButton from "./FilterButton";
import AutocompleteSearch from "./AutocompleteSearch";

export interface SearchProps {
  setFilterOn: (filterOn: boolean) => void;
}

export default function Search({ setFilterOn }: SearchProps) {
  const activeFilter = useSelector(
    (state: RootState) => hasContent(state.filter) || !state.search.geolocation,
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AutocompleteSearch />
      </Box>
      <FilterButton setFilterOn={setFilterOn} activeFilter={activeFilter} />
    </>
  );
}
