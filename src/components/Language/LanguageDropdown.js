import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from 'react-i18next';

const lngs = {
    "en": {nativeName: 'English' },
    "fr": {nativeName: 'Français'},
    "de": {nativeName: 'Deutsch'},
    "it": {nativeName: 'Italiano'},
    "sl": {nativeName: 'Slovenščina'},
}

export default function LanguageDropdown() {

  const {i18n} = useTranslation();


  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select language</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={i18n.language}
          label="language"
          onChange={handleChange}
          type="submit"
          style={{backgroundColor: "white"}}
        >
            {Object.keys(lngs).map((lng) => {
                return <MenuItem key={lng} value={lng}>{lngs[lng].nativeName}</MenuItem>
            })}
        </Select>
      </FormControl>
    </Box>
  );
}