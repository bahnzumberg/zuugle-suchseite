import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";

interface CheckboxItem<T> {
  value: T;
  label: string;
}

interface CheckboxListProps<T extends string | number> {
  list: CheckboxItem<T>[];
  isChecked: (value: T) => boolean;
  onChange: (params: { value: T; checked: boolean }) => void;
  gridSize?: number;
}

export default function CheckboxList<T extends string | number>({
  list,
  isChecked,
  onChange,
  gridSize = 6,
}: CheckboxListProps<T>) {
  return (
    <>
      {list.map(({ value, label }) => (
        <Grid key={value} size={gridSize}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked(value)}
                  onChange={(e) =>
                    onChange({
                      checked: e.target.checked,
                      value: value,
                    })
                  }
                />
              }
              label={label}
            />
          </Box>
        </Grid>
      ))}
    </>
  );
}
