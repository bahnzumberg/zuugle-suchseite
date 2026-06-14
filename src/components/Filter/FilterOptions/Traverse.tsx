import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FilterObject } from "../../../models/Filter";

interface TraverseProps {
  tempFilter: FilterObject;
  setTempFilter: (filter: FilterObject) => void;
  fetchedFilter?: FilterObject;
}

export default function Traverse({
  tempFilter,
  setTempFilter,
  fetchedFilter,
}: TraverseProps) {
  const { t } = useTranslation();

  return (
    <Box className={"filter-box border"}>
      <Grid container sx={{ paddingTop: "16px", alignItems: "center" }}>
        <Grid size={10}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempFilter.traverse ?? false}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    traverse: e.target.checked,
                  })
                }
                disabled={!fetchedFilter?.isTraversePossible}
              />
            }
            label={
              <Box>
                <Typography variant={"subtitle1"} component="span">
                  {t("filter.nur_ueberschreitungen")}
                </Typography>
                <Typography
                  variant={"subtitle2"}
                  sx={{ fontSize: "16px", fontWeight: 400 }}
                >
                  {t("filter.tourstart_ende_andere_stops")}
                </Typography>
              </Box>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
