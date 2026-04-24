import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import FilterButton from "./FilterButton";
import AutocompleteSearch from "./AutocompleteSearch";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import { SearchWithType, useGetCitiesQuery } from "../../features/apiSlice";
import {
  boundsUpdated,
  cityUpdated,
  geolocationUpdated,
  searchWithTypeUpdated,
} from "../../features/searchSlice";
import { filterUpdated } from "../../features/filterSlice";
import { useAppDispatch } from "../../hooks";
import { useEffect, useState } from "react";
import SearchButton from "./SearchButton";

export interface SearchProps {
  setFilterOn?: (filterOn: boolean) => void;
}

export const emptySearch: SearchWithType = { term: "", type: "term" };

export default function Search({ setFilterOn }: SearchProps) {
  const navigate = useNavigate();
  const filter = useSelector((state: RootState) => state.filter);
  const provider = useSelector((state: RootState) => state.search.provider);
  const city = useSelector((state: RootState) => state.search.city);
  const { data: allCities = [] } = useGetCitiesQuery();
  const isSearchPage = window.location.pathname === "/search";
  const currentSearch = useSelector(
    (state: RootState) => state.search.searchWithType,
  );
  const dispatch = useAppDispatch();

  const [draftSearch, setDraftSearch] = useState<SearchWithType>(
    currentSearch ?? emptySearch,
  );

  useEffect(() => {
    setDraftSearch(currentSearch ?? emptySearch);
  }, [currentSearch]);

  const handleSearch = (search: SearchWithType | null) => {
    let cityUpdate: string | null = null;
    if (search === null || search === emptySearch) {
      if (isSearchPage) {
        dispatch(searchWithTypeUpdated(null));
      } else {
        navigate("/search");
      }
      return;
    }
    // very special case: initial setting of city through search bar
    if (search.type === "city" || (search.type === "term" && city === null)) {
      const matchedCity = allCities.find(
        (city) =>
          city.label.toLowerCase() === search.term?.toLowerCase() ||
          city.value.toLowerCase() === search.term?.toLowerCase(),
      );
      if (matchedCity) {
        cityUpdate = matchedCity.value;
        if (isSearchPage) {
          dispatch(cityUpdated(matchedCity));
          dispatch(searchWithTypeUpdated(null));
          setDraftSearch(emptySearch);
          return;
        }
      }
    }
    if (isSearchPage) {
      if (search.type === "range") {
        dispatch(filterUpdated({ ...filter, ranges: [search.term] }));
        dispatch(searchWithTypeUpdated(null));
        setDraftSearch(emptySearch);
      } else {
        dispatch(searchWithTypeUpdated(search));
        // if search-type is hut or peak, clear geolocation search if it's active
        if (search.type === "hut" || search.type === "peak") {
          dispatch(geolocationUpdated(null));
          dispatch(boundsUpdated(null));
        }
      }
    } else {
      const searchParams = new URLSearchParams();
      if (provider) {
        searchParams.set("p", provider);
      }
      if (search.type === "range") {
        searchParams.set("range", search.term);
      } else if (cityUpdate) {
        searchParams.set("city", cityUpdate);
      } else {
        searchParams.set("search_type", search.type);
        searchParams.set("search", search.term);
      }
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <Box
      sx={{
        zIndex: 20,
        backgroundColor: "#FFF",
        borderRadius: "15px",
        padding: { xs: "10px 12px 10px 6px", sm: "12px 24px 12px 12px" },
        border: "2px solid #ddd",
        boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
        transition: "border-color 0.2s ease",
        boxSizing: "border-box",
        width: { xs: "calc(100% - 24px)" },
        maxWidth: "650px",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        "&:focus-within": {
          borderColor: "primary.light",
          boxShadow: (theme) =>
            `0 0 2px 3px ${alpha(theme.palette.primary.light, 0.2)},
             0 3px 20px 0 rgba(100, 100, 111, 0.3)`,
        },
      }}
    >
      <Box sx={{ flexGrow: 1, width: "100%", marginX: "15px" }}>
        <AutocompleteSearch
          inputVariant={"standard"}
          handleSearch={handleSearch}
          searchWithType={draftSearch}
          setSearchWithType={setDraftSearch}
          disabled={!isSearchPage && !city}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: "auto",
          justifyContent: "flex-end",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <SearchButton
          handleSearch={() => handleSearch(draftSearch)}
          disabled={!isSearchPage && !city}
        />
        {setFilterOn && <FilterButton setFilterOn={setFilterOn} />}
      </Box>
    </Box>
  );
}
