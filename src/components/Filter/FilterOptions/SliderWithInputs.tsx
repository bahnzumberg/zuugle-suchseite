import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import GeneralSlider from "../../GeneralSlider";

interface SliderWithInputsProps {
  title: string;
  unit: string;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  minValue: number;
  maxValue: number;
  onChangeSlider: (min: number, max: number) => void;
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
  capLabel?: string;
}

export default function SliderWithInputs({
  title,
  unit,
  sliderMin,
  sliderMax,
  sliderStep,
  minValue,
  maxValue,
  onChangeSlider,
  onChangeMin,
  onChangeMax,
  capLabel,
}: SliderWithInputsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography>
        {title} ({unit})
      </Typography>
      <GeneralSlider
        step={sliderStep}
        min={sliderMin}
        max={sliderMax}
        value={[minValue, maxValue]}
        ariaLabel={title}
        onChange={(_, value) => {
          if (Array.isArray(value)) {
            onChangeSlider(value[0], value[1]);
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
              value={minValue}
              onChange={(e) => onChangeMin(+e.target.value)}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              type="number"
              label={t("filter.maximum")}
              variant="outlined"
              value={maxValue}
              onChange={(e) => onChangeMax(+e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      {capLabel && maxValue >= sliderMax && (
        <div
          style={{
            fontSize: "12px",
            width: "100%",
            textAlign: "right",
            paddingTop: "5px",
            color: "#8B8B8B",
          }}
        >
          {capLabel}
        </div>
      )}
    </>
  );
}
