import Button from "@mui/material/Button";
import { t } from "i18next";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

export interface FilterButtonProps {
  setFilterOn: (filterOn: boolean) => void;
  activeFilter: boolean;
}

export default function FilterButton({
  setFilterOn,
  activeFilter,
}: FilterButtonProps) {
  return (
    <Button
      onClick={() => setFilterOn(true)}
      aria-label={t("filter.filter")}
      startIcon={<FilterAltOutlinedIcon />}
      sx={{
        backgroundColor: "#4992FF",
        color: "white",
        height: 40,
        paddingX: 2,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "14px",
        transition: "all 0.2s ease-in-out",
        boxShadow: "0 2px 8px rgba(73, 146, 255, 0.3)",
        "&:hover": {
          transform: "scale(1.05)",
          backgroundColor: activeFilter ? "#0D47A1" : "#387EE0",
          boxShadow: "0 4px 12px rgba(73, 146, 255, 0.4)",
        },
      }}
    >
      {t("filter.filter")}
    </Button>
  );
}
