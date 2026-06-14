import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useTranslation } from "react-i18next";
import { RootState } from "../..";
import { hasContent } from "../../utils/globals";
import { useSelector } from "react-redux";
import { theme } from "../../theme";
import { darken, lighten, useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";

interface FilterButtonProps {
  setFilterOn: (filterOn: boolean) => void;
}

export default function FilterButton({ setFilterOn }: FilterButtonProps) {
  const { t } = useTranslation();

  const activeFilter = useSelector(
    (state: RootState) => hasContent(state.filter) || state.search.geolocation,
  );

  const muiTheme = useTheme();
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.only("xs"));

  const inactiveColor = theme.palette.secondary.main;

  // Active state: Lindgrün bg, Bahnblau text/border
  const activeBg = "#ccd8a1";
  const activeFg = "#254980";

  if (isXsScreen) {
    return (
      <IconButton
        onClick={() => setFilterOn(true)}
        aria-label={t("filter.filter")}
        sx={{
          backgroundColor: activeFilter
            ? activeBg
            : lighten(inactiveColor, 0.9),
          color: activeFilter ? activeFg : inactiveColor,
          height: 40,
          width: 40,
          boxShadow: activeFilter
            ? `0 1px 4px rgba(37,73,128,0.25)`
            : `0 1px 4px ${lighten(inactiveColor, 0.7)}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: activeFilter
              ? darken(activeBg, 0.06)
              : lighten(inactiveColor, 0.84),
            color: activeFilter ? activeFg : darken(inactiveColor, 0.08),
          },
        }}
      >
        <TuneOutlinedIcon />
      </IconButton>
    );
  } else {
    return (
      <Button
        onClick={() => setFilterOn(true)}
        aria-label={t("filter.filter")}
        startIcon={<TuneOutlinedIcon />}
        variant="outlined"
        sx={() => ({
          minWidth: { xs: "49%", sm: 100 },
          backgroundColor: activeFilter
            ? activeBg
            : lighten(inactiveColor, 0.9),
          color: activeFilter ? activeFg : inactiveColor,
          borderColor: activeFilter
            ? "transparent"
            : lighten(inactiveColor, 0.3),
          height: 40,
          fontWeight: 700,
          transition: "all 0.2s ease-in-out",
          boxShadow: activeFilter
            ? `0 1px 4px rgba(37,73,128,0.25)`
            : `0 1px 4px ${lighten(inactiveColor, 0.7)}`,
          "&:hover": {
            backgroundColor: activeFilter
              ? darken(activeBg, 0.06)
              : lighten(inactiveColor, 0.84),
            borderColor: activeFilter ? "transparent" : inactiveColor,
            boxShadow: activeFilter
              ? `0 2px 8px rgba(37,73,128,0.3)`
              : `0 2px 8px ${lighten(inactiveColor, 0.62)}`,
            color: activeFilter ? activeFg : darken(inactiveColor, 0.08),
          },
        })}
      >
        {t("filter.filter")}
      </Button>
    );
  }
}
