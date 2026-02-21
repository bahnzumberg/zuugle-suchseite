import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FilterObject } from "../../../models/Filter";
import GeneralSlider from "../../GeneralSlider";

interface AscentProps {
  tempFilter: FilterObject;
  setTempFilter: (filter: FilterObject) => void;
  fetchedFilter?: FilterObject;
  getFilterValue: <K extends keyof FilterObject>(
    propertyName: K,
    defaultValue: NonNullable<FilterObject[K]>,
  ) => NonNullable<FilterObject[K]>;
}

export default function Ascent({
  tempFilter,
  setTempFilter,
  fetchedFilter,
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
          <Typography>
            {t("filter.anstieg")} ({t("details.hm_hoehenmeter")})
          </Typography>
          <GeneralSlider
            step={100}
            min={fetchedFilter?.minAscent ?? 0}
            max={fetchedFilter?.maxAscent ?? 3000}
            value={[
              getFilterValue("minAscent", 0),
              getFilterValue("maxAscent", 3000),
            ]}
            onChange={(_, value) => {
              if (Array.isArray(value)) {
                setTempFilter({
                  ...tempFilter,
                  minAscent: value[0],
                  maxAscent: value[1],
                });
              }
            }}
          />

          <Box sx={{ marginTop: "15px" }}>
            <Grid container spacing={"10px"}>
              <Grid size={6}>
                <TextField
                  type="number"
                  label={t("filter.minimum")}
                  variant="outlined"
                  value={getFilterValue("minAscent", 0)}
                  onChange={(e) => {
                    setTempFilter({
                      ...tempFilter,
                      minAscent: +e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  type="number"
                  label={t("filter.maximum")}
                  variant="outlined"
                  value={getFilterValue("maxAscent", 3000)}
                  onChange={(e) => {
                    setTempFilter({
                      ...tempFilter,
                      maxAscent: +e.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          {getFilterValue("maxAscent", 3000) >= 3000 && (
            <div
              style={{
                fontSize: "12px",
                width: "100%",
                textAlign: "right",
                paddingTop: "5px",
                color: "#8B8B8B",
              }}
            >
              3000+ {t("filter.hoehenmeter")}
            </div>
          )}
        </Grid>
        <Grid
          sx={{ paddingLeft: { xs: 0, sm: "16px" } }}
          size={{ xs: 12, sm: 6 }}
        >
          <Typography>
            {t("main.abstieg")} ({t("details.hm_hoehenmeter")})
          </Typography>
          <GeneralSlider
            step={100}
            min={fetchedFilter?.minDescent ?? 0}
            max={fetchedFilter?.maxDescent ?? 3000}
            value={[
              getFilterValue("minDescent", 0),
              getFilterValue("maxDescent", 3000),
            ]}
            onChange={(_, value) => {
              if (Array.isArray(value)) {
                setTempFilter({
                  ...tempFilter,
                  minDescent: value[0],
                  maxDescent: value[1],
                });
              }
            }}
          />
          <Box sx={{ marginTop: "15px" }}>
            <Grid container spacing={"10px"}>
              <Grid size={6}>
                <TextField
                  type="number"
                  label={t("filter.minimum")}
                  variant="outlined"
                  value={getFilterValue("minDescent", 0)}
                  onChange={(e) => {
                    setTempFilter({
                      ...tempFilter,
                      minDescent: +e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  type="number"
                  label={t("filter.maximum")}
                  variant="outlined"
                  value={getFilterValue("maxDescent", 3000)}
                  onChange={(e) => {
                    setTempFilter({
                      ...tempFilter,
                      maxDescent: +e.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          {getFilterValue("maxDescent", 3000) >= 3000 && (
            <div
              style={{
                fontSize: "12px",
                width: "100%",
                textAlign: "right",
                paddingTop: "5px",
                color: "#8B8B8B",
              }}
            >
              3000+ {t("filter.hoehenmeter")}{" "}
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
