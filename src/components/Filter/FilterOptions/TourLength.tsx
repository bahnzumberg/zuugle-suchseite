import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
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
    <Box className={"filter-box border"}>
      <Typography variant={"subtitle1"}>{t("filter.tourlaenge")}</Typography>
      <Grid container>
        <Grid
          sx={{
            borderRight: "1px solid #EAEAEA",
            paddingRight: "16px",
          }}
          size={6}
        >
          <Grid container spacing={0}>
            <Grid sx={{ alignSelf: "center" }} size={6}>
              <Typography>{t("filter.tagestour")}</Typography>
            </Grid>
            <Grid sx={{ textAlign: "right" }} size={6}>
              <Switch
                checked={tempFilter.singleDayTour ?? true}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    singleDayTour: e.target.checked,
                  })
                }
                disabled={!fetchedFilter?.isSingleDayTourPossible}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ paddingLeft: "16px" }} size={6}>
          <Grid container spacing={0}>
            <Grid sx={{ alignSelf: "center" }} size={6}>
              <Typography>{t("filter.mehrtagestour")}</Typography>
            </Grid>
            <Grid sx={{ textAlign: "right" }} size={6}>
              <Switch
                checked={tempFilter.multipleDayTour ?? true}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    multipleDayTour: e.target.checked,
                  })
                }
                disabled={!fetchedFilter?.isMultipleDayTourPossible}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
