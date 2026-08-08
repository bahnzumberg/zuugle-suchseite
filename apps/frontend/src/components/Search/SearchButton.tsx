import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { alpha, useTheme } from "@mui/material/styles";
import SearchBarButton from "./SearchBarButton";

interface SearchButtonProps {
  handleSearch: () => void;
}

export default function SearchButton({ handleSearch }: SearchButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const restingBg = theme.palette.secondary.main;
  const engagedBg = theme.palette.primary.main;

  const shadow = (offset: number, blur: number, opacity: number) =>
    `0 ${offset}px ${blur}px ${alpha(theme.palette.secondary.main, opacity)}`;
  const restingShadow = { xs: shadow(1, 4, 0.2), sm: shadow(2, 8, 0.2) };
  const engaged = {
    backgroundColor: engagedBg,
    boxShadow: shadow(4, 12, 0.26),
  };

  return (
    <SearchBarButton
      icon={<SearchIcon />}
      label={t("search.search")}
      onClick={handleSearch}
      sx={{
        backgroundColor: restingBg,
        color: theme.palette.common.white,
        boxShadow: restingShadow,
        "&:focus, &:focus-visible, &.Mui-focusVisible": {
          backgroundColor: restingBg,
          boxShadow: restingShadow,
        },
        "@media (hover: hover) and (pointer: fine)": { "&:hover": engaged },
        "&:active": engaged,
      }}
    />
  );
}
