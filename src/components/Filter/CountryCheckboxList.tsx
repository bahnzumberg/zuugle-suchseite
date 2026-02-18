import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";

interface TranslatedCountries {
  value: string;
  label: string;
}

interface CountryCheckboxListProps {
  translatedCountries: TranslatedCountries[];
  isChecked: (value: string) => boolean;
  onChange: ({ value, checked }: { value: string; checked: boolean }) => void;
}

export default function CountryCheckboxList({
  translatedCountries,
  isChecked,
  onChange,
}: CountryCheckboxListProps) {
  return (
    <>
      {translatedCountries.map((country, index) => (
        <Grid key={index} size={6}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked(country.value)}
                  onChange={(e) =>
                    onChange({
                      checked: e.target.checked,
                      value: country.value,
                    })
                  }
                />
              }
              label={country.label}
            />
          </Box>
        </Grid>
      ))}
    </>
  );
}
