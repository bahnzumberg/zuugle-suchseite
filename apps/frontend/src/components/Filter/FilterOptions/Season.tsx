import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FilterObject } from "../../../models/Filter";

interface SeasonProps {
  tempFilter: FilterObject;
  setTempFilter: (filter: FilterObject) => void;
  fetchedFilter?: FilterObject;
}

export default function Season({
  tempFilter,
  setTempFilter,
  fetchedFilter,
}: SeasonProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant={"subtitle1"}>{t("filter.jahreszeit")}</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", pt: "4px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={tempFilter.summerSeason ?? false}
              onChange={(e) =>
                setTempFilter({
                  ...tempFilter,
                  summerSeason: e.target.checked,
                })
              }
              disabled={!fetchedFilter?.isSummerTourPossible}
            />
          }
          label={t("filter.sommertour")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={tempFilter.winterSeason ?? false}
              onChange={(e) =>
                setTempFilter({
                  ...tempFilter,
                  winterSeason: e.target.checked,
                })
              }
              disabled={!fetchedFilter?.isWinterTourPossible}
            />
          }
          label={t("filter.wintertour")}
        />
      </Box>
    </Box>
  );
}
