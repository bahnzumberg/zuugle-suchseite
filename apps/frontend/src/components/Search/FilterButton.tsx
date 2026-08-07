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
const activeBg = "#ccd8a1";
const activeFg = "#254980";

export default function FilterButton({ setFilterOn }: FilterButtonProps) {
  const { t } = useTranslation();

  const activeFilter = useSelector(
    (state: RootState) => hasContent(state.filter) || state.search.geolocation,
  );

  const inactiveColor = theme.palette.secondary.main;

  const colors = activeFilter
    ? {
        background: activeBg,
        text: activeFg,
        border: "transparent",
        shadow: `0 1px 4px rgba(37,73,128,0.25)`,
        hoverBackground: darken(activeBg, 0.06),
        hoverText: activeFg,
        hoverBorder: "transparent",
        hoverShadow: `0 2px 8px rgba(37,73,128,0.3)`,
      }
    : {
        background: lighten(inactiveColor, 0.9),
        text: inactiveColor,
        border: lighten(inactiveColor, 0.3),
        shadow: `0 1px 4px ${lighten(inactiveColor, 0.7)}`,
        hoverBackground: lighten(inactiveColor, 0.84),
        hoverText: darken(inactiveColor, 0.08),
        hoverBorder: inactiveColor,
        hoverShadow: `0 2px 8px ${lighten(inactiveColor, 0.62)}`,
      };

  return (
    <SearchBarButton
      icon={<TuneOutlinedIcon />}
      label={t("filter.filter")}
      onClick={() => setFilterOn(true)}
      variant="outlined"
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
        boxShadow: colors.shadow,
        "&:hover": {
          backgroundColor: colors.hoverBackground,
          color: colors.hoverText,
          borderColor: colors.hoverBorder,
          boxShadow: colors.hoverShadow,
        },
      }}
    />
  );
}
