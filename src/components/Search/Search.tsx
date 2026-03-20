import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SearchActionButton from "./SearchActionButton";
import AutocompleteSearch from "./AutocompleteSearch";
import AutocompleteCitySelection from "./AutocompleteCitySelection";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "../../theme";

export interface SearchProps {
  pageKey: string;
  isSearchResultsPage: boolean;
  setFilterOn?: (filterOn: boolean) => void;
}

export default function Search({
  pageKey,
  isSearchResultsPage: isSearchResultsPage,
  setFilterOn,
}: SearchProps) {
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        zIndex: 20,
        backgroundColor: "#FFF",
        borderRadius: "15px",
        padding: { xs: "10px 12px", sm: "12px 24px" },
        border: "2px solid #ddd",
        boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
        boxSizing: "border-box",
        width: { xs: "calc(100% - 24px)", sm: "600px" },
        maxWidth: "600px",
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 1, sm: 0 },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <AutocompleteSearch inputVariant={isXs ? "outlined" : "standard"} />
      </Box>{" "}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          mx: 1,
          width: 2,
          height: 28,
          alignSelf: "center",
          border: 0,
          borderRadius: 999,
          bgcolor: "divider",
          display: { xs: "none", sm: "block" },
        }}
      />
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <AutocompleteCitySelection
          inputVariant={isXs ? "outlined" : "standard"}
        />
      </Box>
      <Box sx={{ alignSelf: { xs: "center", sm: "auto" } }}>
        <SearchActionButton
          isSearchResultsPage={isSearchResultsPage}
          pageKey={pageKey}
          setFilterOn={setFilterOn}
        />
      </Box>
    </Box>
  );
}
