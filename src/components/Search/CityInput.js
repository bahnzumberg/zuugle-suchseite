import * as React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
// import ChevronDown from "../../icons/ChevronDown";
// import ChevronUp from "../../icons/ChevronUp";
import SearchIcon from "../../icons/SearchIcon";
import ClearSearchIcon from "../../icons/ClearSearchIcon";
// import { useTranslation } from "react-i18next";

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

//description
//a React functional component, receives several props:
// loadCities: a function to load a list of cities based on the input value
// city: a string representing the current value of the input
// setCity: a function to update the value of the input
// onFocus: a function to be called when the input is focused
// isOpen: a boolean to determine if the input is currently open (expanded)
// showRightIcon: a boolean to determine if the chevron icon should be displayed on the right side of the input
// onClick: a function to be called when the input is clicked
// disabled: a boolean to determine if the input is disabled or not
// The component renders a Material-UI TextField component that has customized styles. It also includes two icons (Home and ChevronDown/ChevronUp) as input adornments on the left and right sides respectively. The onChange handler is used to update the city state and call loadCities to load a list of cities based on the input value. The onFocus and onBlur handlers are used to call the onFocus function if it is provided. Finally, the onClick handler is used to call the onClick function if it is provided.

export default function CityInput({
  loadCities,
  city,
  setCity,
  onFocus,
  isOpen,
  showRightIcon = true,
  onClick,
  disabled,
}) {
  //   const { t } = useTranslation();

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
      return "Bozen, ...";
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
      // disableautofocus="true"
      // disableAutoFocus={true}
      autoComplete={"off"}
      key={"city-input"}
      onChange={(event) => {
        setCity(event.target.value);
        loadCities({ search: event.target.value });
      }}
      onFocus={() => !!onFocus && onFocus(true)}
      onBlur={() => !!onFocus && onFocus(false)}
      onClick={() => !!onClick && onClick()}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
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
        // endAdornment:
        //   !!showRightIcon &&
        //   (isOpen ? (
        //     <InputAdornment
        //       position="end"
        //       onClick={() => !!onFocus && onFocus(false)}
        //       sx={{ cursor: "pointer" }}
        //     >
        //       <ChevronUp />
        //     </InputAdornment>
        //   ) : (
        //     <InputAdornment
        //       position="end"
        //       onClick={() => !!onFocus && onFocus(true)}
        //       sx={{ cursor: "pointer" }}
        //     >
        //       <ChevronDown />
        //     </InputAdornment>
        //   )),
        className: "search-bar-input",
      }}
    />
  );
}
