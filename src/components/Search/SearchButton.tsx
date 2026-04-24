import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface SearchButtonProps {
  handleSearch: () => void;
  disabled?: boolean;
}

export default function SearchButton({
  handleSearch,
  disabled,
}: SearchButtonProps) {
  const { t } = useTranslation();
  const muiTheme = useTheme();
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.only("xs"));

  const sharedSx = (theme: typeof muiTheme) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    transition: "all 0.2s ease-in-out",
    "&.Mui-disabled": {
      backgroundColor: alpha(theme.palette.primary.main, 0.38),
      color: alpha(theme.palette.common.white, 0.8),
      boxShadow: "none",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.26)}`,
      },
    },
    "&:active": {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.26)}`,
    },
  });

  const button = isXsScreen ? (
    <IconButton
      onClick={handleSearch}
      disabled={disabled}
      aria-label={t("search.search")}
      sx={(theme) => ({
        ...sharedSx(theme),
        height: 40,
        width: 40,
        boxShadow: `0 1px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
        "&:focus, &:focus-visible, &.Mui-focusVisible": {
          backgroundColor: theme.palette.primary.main,
          boxShadow: `0 1px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      })}
    >
      <SearchIcon />
    </IconButton>
  ) : (
    <Button
      onClick={handleSearch}
      disabled={disabled}
      aria-label={t("search.search")}
      color="primary"
      startIcon={<SearchIcon />}
      sx={(theme) => ({
        ...sharedSx(theme),
        minWidth: 100,
        height: 40,
        fontWeight: 700,
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
      })}
    >
      {t("search.search")}
    </Button>
  );

  if (disabled) {
    return (
      <Tooltip
        title={t("search.stadt_waehlen_tooltip")}
        arrow
        enterTouchDelay={0}
        leaveTouchDelay={4000}
      >
        <Box
          component="span"
          sx={{ cursor: "not-allowed", display: "inline-flex" }}
        >
          {button}
        </Box>
      </Tooltip>
    );
  }

  return button;
}
