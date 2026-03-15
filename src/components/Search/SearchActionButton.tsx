import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CustomIcon } from "../../icons/CustomIcon";
import { RootState } from "../..";
import { hasContent } from "../../utils/globals";
import { useSelector } from "react-redux";

interface SearchActionButtonProps {
  isSearchResultsPage: boolean;
  pageKey: string;
  setFilterOn?: (filterOn: boolean) => void;
}

export default function SearchActionButton({
  isSearchResultsPage,
  pageKey,
  setFilterOn,
}: SearchActionButtonProps) {
  const { t } = useTranslation();

  const activeFilter = useSelector(
    (state: RootState) => hasContent(state.filter) || state.search.geolocation,
  );

  const provider = useSelector((state: RootState) => state.search.provider);
  const city = useSelector((state: RootState) => state.search.city);
  const searchPhrase = useSelector(
    (state: RootState) => state.search.searchPhrase,
  );

  if (!city && pageKey === "detail") {
    return null;
  }

  if (isSearchResultsPage && setFilterOn) {
    return (
      <Button
        onClick={() => setFilterOn(true)}
        aria-label={t("filter.filter")}
        startIcon={<FilterAltOutlinedIcon />}
        sx={{
          backgroundColor: activeFilter ? "#FF7663" : "#4992FF",
          color: "white",
          height: 40,
          paddingX: 2,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 1px 4px rgba(73, 146, 255, 0.3)",
          "&:hover": {
            backgroundColor: activeFilter ? "#FF7663" : "#4992FF",
            boxShadow: "0 2px 8px rgba(73, 146, 255, 0.4)",
          },
        }}
      >
        {t("filter.filter")}
      </Button>
    );
  }

  return (
    <Box
      sx={{
        marginLeft: "10px",
        backgroundColor: activeFilter ? "#FF8A75" : undefined,
        borderColor: activeFilter ? "#FF8A75" : undefined,
      }}
      className="filter-icon-container"
    >
      <Link
        to={{
          pathname: "/search",
          search:
            "?" +
            (searchPhrase ? `&search=${searchPhrase}` : "") +
            (provider ? `&p=${provider}` : ""),
        }}
      >
        <IconButton
          aria-label="Go"
          sx={{
            "&:hover": {
              background: "#7aa8ff",
              fill: "#7aa8ff",
            },
          }}
        >
          <CustomIcon
            name="goIcon"
            style={{
              transform: "scale(1.55)",
              strokeWidth: 0,
            }}
          />
        </IconButton>
      </Link>
    </Box>
  );
}
