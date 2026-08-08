import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useTranslation } from "react-i18next";
import { RootState } from "../..";
import { hasContent } from "../../utils/globals";
import { useSelector } from "react-redux";
import { theme } from "../../theme";
import { darken, lighten } from "@mui/material/styles";
import SearchBarButton from "./SearchBarButton";

interface FilterButtonProps {
  setFilterOn: (filterOn: boolean) => void;
}

// Active state: Lindgrün bg, Bahnblau text/border
const activeBg = theme.palette.lindgruen.main;
const activeFg = theme.palette.primary.main;

export default function FilterButton({ setFilterOn }: FilterButtonProps) {
  const { t } = useTranslation();

  const activeFilter = useSelector(
    (state: RootState) => hasContent(state.filter) || state.search.geolocation,
  );

  const inactiveColor = theme.palette.secondary.main;

  const sx = activeFilter
    ? {
        backgroundColor: activeBg,
        color: activeFg,
        borderColor: "transparent",
        boxShadow: `0 1px 4px rgba(37,73,128,0.25)`,
        "&:hover": {
          backgroundColor: darken(activeBg, 0.06),
          boxShadow: `0 2px 8px rgba(37,73,128,0.3)`,
        },
      }
    : {
        backgroundColor: lighten(inactiveColor, 0.9),
        color: inactiveColor,
        borderColor: lighten(inactiveColor, 0.3),
        boxShadow: `0 1px 4px ${lighten(inactiveColor, 0.7)}`,
        "&:hover": {
          backgroundColor: lighten(inactiveColor, 0.84),
          color: darken(inactiveColor, 0.08),
          borderColor: inactiveColor,
          boxShadow: `0 2px 8px ${lighten(inactiveColor, 0.62)}`,
        },
      };

  return (
    <SearchBarButton
      icon={<TuneOutlinedIcon />}
      label={t("filter.filter")}
      onClick={() => setFilterOn(true)}
      variant="outlined"
      sx={sx}
    />
  );
}
