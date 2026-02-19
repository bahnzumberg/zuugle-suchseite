import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "react-i18next";

interface FilterFooterProps {
  resetFilter: () => void;
  submitFilter: () => void;
  activeFilterCount: number;
}

export default function FilterFooter({
  resetFilter,
  submitFilter,
  activeFilterCount,
}: FilterFooterProps) {
  const { t } = useTranslation();

  return (
    <DialogActions sx={{ py: 2 }}>
      <Button
        variant={"text"}
        sx={{ marginRight: 1, color: "#8B8B8B" }}
        onClick={resetFilter}
      >
        {" "}
        {t("filter.filter_loeschen")}
      </Button>
      <Button variant={"contained"} onClick={submitFilter}>
        {activeFilterCount || ""} {t("filter.filter_anwenden")}
      </Button>
    </DialogActions>
  );
}
