import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getDifficultyTranslationMap } from "../utils";
import CheckboxList from "../CheckboxList";

interface DifficultyFilterProps {
  onToggleAll: () => void;
  isChecked: (value: number) => boolean;
  onChange: ({ value, checked }: { value: number; checked: boolean }) => void;
  values: number[];
}

export default function DifficultyFilter({
  onToggleAll,
  isChecked,
  onChange,
  values,
}: DifficultyFilterProps) {
  const { t } = useTranslation();
  const translationMap = getDifficultyTranslationMap(t);
  const options = values.map((entry) => ({
    value: entry,
    label: translationMap[entry] ?? "",
  }));

  return (
    <Box className={"filter-box border"} sx={{ paddingTop: "20px" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant={"subtitle1"}>
          {t("filter.schwierigkeit")}
        </Typography>
        <Tooltip title={t("filter.schwierigkeitswert")}>
          <InfoOutlinedIcon fontSize="small" color="action" />
        </Tooltip>
      </Stack>
      <Typography
        className={"cursor-link"}
        sx={{ fontSize: "14px" }}
        onClick={onToggleAll}
      >
        {t("filter.alle_an_abwaehlen")}
      </Typography>
      <Grid container sx={{ paddingTop: "16px" }}>
        <CheckboxList
          list={options}
          isChecked={isChecked}
          onChange={({ checked, value }) => onChange({ value, checked })}
        />
      </Grid>
    </Box>
  );
}
