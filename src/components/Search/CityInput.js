import * as React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TransportTrain from "../../icons/TransportTrain";
import ClearSearchIcon from "../../icons/ClearSearchIcon";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#4992FF",
  },
  borderRadius: "20px",
  border: "1.5px solid #DDD",
  "& .MuiInput-underline:after": {
    borderBottomColor: "#DDD",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "0",
    },
    "&:hover fieldset": {
      borderColor: "#DDD",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#DDD",
      borderWidth: 0,
    },
  },
});

export default function CityInput({
  loadCities,
  city,
  setCity,
  onFocus,
  isOpen,
  showRightIcon = true,
  disabled,
}) {

  const placeholder = () => {
    let host = window.location.host;
    if (host.indexOf("zuugle.at") >= 0) {
      return "Wien, Graz, ...";
    } else if (host.indexOf("zuugle.de") >= 0) {
      return "München, Rosenheim, ...";
    } else if (host.indexOf("zuugle.ch") >= 0) {
      return "Zürich, ...";
    } else if (host.indexOf("zuugle.si") >= 0) {
      return "Ljubljana, Maribor,...";
    } else if (host.indexOf("zuugle.it") >= 0) {
      return "Milano, Bozen, ...";
    } else if (host.indexOf("zuugle.fr") >= 0) {
      return "Lyon, Marseille, ...";
    } else if (host.indexOf("zuugle.li") >= 0) {
      return "Vaduz";
    } else {
      return "Wien, Graz, ...";
    }
  };

  const handleSearchClearClick = (e) => {
    if (e) {
      setCity("");
      loadCities({ search: "" });
    }
  };
  return (
    <CssTextField
      className={"city-input"}
      placeholder={placeholder()}
      variant="outlined"
      fullWidth
      disabled={disabled}
      value={city}
      autoComplete={"off"}
      key={"city-input"}
      onChange={(event) => {
        setCity(event.target.value);
        loadCities({ search: event.target.value });
      }}
      onFocus={() => !!onFocus && onFocus(true)}
      onBlur={() => !!onFocus && onFocus(false)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <TransportTrain />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSearchClearClick(true)}
          >
            {city && <ClearSearchIcon />}
          </InputAdornment>
        )
        ,
    
        className: "search-bar-input",
      }}
    />
  );
}
