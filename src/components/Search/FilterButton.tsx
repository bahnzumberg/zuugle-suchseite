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

  const buttonColor = activeFilter
    ? theme.palette.primary.main
    : theme.palette.secondary.main;

  if (isXsScreen) {
    return (
      <IconButton
        onClick={() => setFilterOn(true)}
        aria-label={t("filter.filter")}
        sx={{
          backgroundColor: lighten(buttonColor, 0.9),
          color: buttonColor,
          height: 40,
          width: 40,
          boxShadow: `0 1px 4px ${lighten(buttonColor, 0.7)}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: lighten(buttonColor, 0.84),
            color: darken(buttonColor, 0.08),
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
          backgroundColor: lighten(buttonColor, 0.9),
          color: buttonColor,
          borderColor: lighten(buttonColor, 0.3),
          height: 40,
          fontWeight: 700,
          transition: "all 0.2s ease-in-out",
          boxShadow: `0 1px 4px ${lighten(buttonColor, 0.7)}`,
          "&:hover": {
            backgroundColor: lighten(buttonColor, 0.84),
            borderColor: buttonColor,
            boxShadow: `0 2px 8px ${lighten(buttonColor, 0.62)}`,
            color: darken(buttonColor, 0.08),
          },
        })}
      >
        {t("filter.filter")}
      </Button>
    );
  }
}
