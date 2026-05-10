import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { FilterObject } from "../../../models/Filter";
import GeneralSlider from "../../GeneralSlider";
import { getDurationAsHours } from "../../../utils/globals";
import SliderWithInputs from "./SliderWithInputs";

interface TravelTimeProps {
  tempFilter: FilterObject;
  setTempFilter: (filter: FilterObject) => void;
  getFilterValue: <K extends keyof FilterObject>(
    propertyName: K,
    defaultValue: NonNullable<FilterObject[K]>,
  ) => NonNullable<FilterObject[K]>;
}

export default function TravelTime({
  tempFilter,
  setTempFilter,
  getFilterValue,
}: TravelTimeProps) {
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
          <Typography>
            {t("main.anfahrtszeit")} ({t("details.h_hour")})
          </Typography>
          <GeneralSlider
            step={0.5}
            min={0}
            max={6}
            value={[
              getFilterValue("minTransportDuration", 0),
              getFilterValue("maxTransportDuration", 50),
            ]}
            onChange={(_, value) => {
              if (Array.isArray(value)) {
                setTempFilter({
                  ...tempFilter,
                  minTransportDuration: value[0],
                  maxTransportDuration: value[1],
                });
              }
            }}
          />
          <Box sx={{ marginTop: "15px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={"10px"}>
                <Grid size={6}>
                  <TimeField
                    label={t("filter.minimum")}
                    variant="outlined"
                    value={dayjs()
                      .startOf("day")
                      .add(getFilterValue("minTransportDuration", 0), "hours")}
                    format="HH:mm"
                    onChange={(value) =>
                      setTempFilter({
                        ...tempFilter,
                        minTransportDuration: getDurationAsHours(value),
                      })
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <TimeField
                    label={t("filter.maximum")}
                    variant="outlined"
                    value={dayjs()
                      .startOf("day")
                      .add(getFilterValue("maxTransportDuration", 50), "hours")}
                    format="HH:mm"
                    onChange={(value) =>
                      setTempFilter({
                        ...tempFilter,
                        maxTransportDuration: getDurationAsHours(value),
                      })
                    }
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid
          sx={{ paddingLeft: { xs: 0, sm: "16px" } }}
          size={{ xs: 12, sm: 6 }}
        >
          <SliderWithInputs
            title={t("filter.gehdistanz")}
            unit={t("details.km_kilometer")}
            sliderMin={0}
            sliderMax={80}
            sliderStep={2}
            minValue={getFilterValue("minDistance", 0)}
            maxValue={getFilterValue("maxDistance", 80)}
            onChangeSlider={(min, max) =>
              setTempFilter({
                ...tempFilter,
                minDistance: min,
                maxDistance: max,
              })
            }
            onChangeMin={(v) =>
              setTempFilter({ ...tempFilter, minDistance: v })
            }
            onChangeMax={(v) =>
              setTempFilter({ ...tempFilter, maxDistance: v })
            }
            capLabel={`80+ ${t("details.km_kilometer")}`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
