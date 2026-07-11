import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { FilterObject } from "../../../models/Filter";
import SliderWithInputs from "./SliderWithInputs";

interface AscentProps {
  tempFilter: FilterObject;
  setTempFilter: (filter: FilterObject) => void;
  getFilterValue: <K extends keyof FilterObject>(
    propertyName: K,
    defaultValue: NonNullable<FilterObject[K]>,
  ) => NonNullable<FilterObject[K]>;
}

export default function Ascent({
  tempFilter,
  setTempFilter,
  getFilterValue,
}: AscentProps) {
  const { t } = useTranslation();

  return (
    <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
      <Grid container>
        <Grid
          sx={{
            borderRight: { xs: "none", sm: "1px solid #EAEAEA" },
            paddingRight: { xs: 0, sm: "16px" },
          }}
          size={{ xs: 12, sm: 6 }}
        >
          <SliderWithInputs
            title={t("filter.anstieg")}
            unit={t("details.hm_hoehenmeter")}
            sliderMin={0}
            sliderMax={3000}
            sliderStep={100}
            minValue={getFilterValue("minAscent", 0)}
            maxValue={getFilterValue("maxAscent", 3000)}
            onChangeSlider={(min, max) =>
              setTempFilter({ ...tempFilter, minAscent: min, maxAscent: max })
            }
            onChangeMin={(v) => setTempFilter({ ...tempFilter, minAscent: v })}
            onChangeMax={(v) => setTempFilter({ ...tempFilter, maxAscent: v })}
            capLabel={`3000+ ${t("filter.hoehenmeter")}`}
          />
        </Grid>
        <Grid
          sx={{ paddingLeft: { xs: 0, sm: "16px" } }}
          size={{ xs: 12, sm: 6 }}
        >
          <SliderWithInputs
            title={t("main.abstieg")}
            unit={t("details.hm_hoehenmeter")}
            sliderMin={0}
            sliderMax={3000}
            sliderStep={100}
            minValue={getFilterValue("minDescent", 0)}
            maxValue={getFilterValue("maxDescent", 3000)}
            onChangeSlider={(min, max) =>
              setTempFilter({ ...tempFilter, minDescent: min, maxDescent: max })
            }
            onChangeMin={(v) => setTempFilter({ ...tempFilter, minDescent: v })}
            onChangeMax={(v) => setTempFilter({ ...tempFilter, maxDescent: v })}
            capLabel={`3000+ ${t("filter.hoehenmeter")}`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
