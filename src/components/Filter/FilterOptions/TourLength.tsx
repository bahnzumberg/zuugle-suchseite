import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FilterObject } from "../../../models/Filter";

interface TourLengthProps {
  tempFilter: FilterObject;
  setTempFilter: (filter: FilterObject) => void;
  fetchedFilter?: FilterObject;
}

export default function TourLength({
  tempFilter,
  setTempFilter,
  fetchedFilter,
}: TourLengthProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant={"subtitle1"}>{t("filter.tourlaenge")}</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", pt: "4px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={tempFilter.singleDayTour ?? false}
              onChange={(e) =>
                setTempFilter({
                  ...tempFilter,
                  singleDayTour: e.target.checked,
                })
              }
              disabled={!fetchedFilter?.isSingleDayTourPossible}
            />
          }
          label={t("filter.tagestour")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={tempFilter.multipleDayTour ?? false}
              onChange={(e) =>
                setTempFilter({
                  ...tempFilter,
                  multipleDayTour: e.target.checked,
                })
              }
              disabled={!fetchedFilter?.isMultipleDayTourPossible}
            />
          }
          label={t("filter.mehrtagestour")}
        />
      </Box>
    </Box>
  );
}
