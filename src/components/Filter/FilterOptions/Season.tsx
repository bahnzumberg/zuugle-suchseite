import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
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
    <Box
      className={"filter-box border"}
      style={{ paddingTop: "20px", paddingBottom: "20px" }}
    >
      <Typography variant={"subtitle1"}>{t("filter.jahreszeit")}</Typography>
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
              <Typography>{t("filter.sommertour")}</Typography>
            </Grid>
            <Grid sx={{ textAlign: "right" }} size={6}>
              <Switch
                checked={tempFilter.summerSeason ?? true}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    summerSeason: e.target.checked,
                  })
                }
                disabled={!fetchedFilter?.isSummerTourPossible}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ paddingLeft: "16px" }} size={6}>
          <Grid container spacing={0}>
            <Grid sx={{ alignSelf: "center" }} size={6}>
              <Typography>{t("filter.wintertour")}</Typography>
            </Grid>
            <Grid sx={{ textAlign: "right" }} size={6}>
              <Switch
                checked={tempFilter.winterSeason ?? true}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    winterSeason: e.target.checked,
                  })
                }
                disabled={!fetchedFilter?.isWinterTourPossible}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
