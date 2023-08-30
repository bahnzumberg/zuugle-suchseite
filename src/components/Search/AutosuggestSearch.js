import React, { useState, useEffect } from "react";
import Async from "react-select/async";
import Select, { components } from "react-select";
import { loadSuggestions } from "../../actions/crudActions";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "../../icons/SearchIcon";
import ClearSearchIcon from "../../icons/ClearSearchIcon";
import { styled } from "@mui/system";


const useStyles = styled("div")(({ theme }) => ({
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
    "& .MuiInputAdornment-root": {
      position: "start",
      "& svg": {
        fill: theme.palette.text.primary,
      },
    },
    "& .MuiInputAdornment-positionEnd": {
      position: "end",
      cursor: "pointer",
    },
  },
}));

const AutosuggestSearchTour = ({
  onSearchSuggestion,
  onSearchPhrase,
  city,
  language,
  placeholder,
  goto,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [input, setInput] = useState("");
  const { t } = useTranslation();
  let options = []; //Stores the given suggestions
  let searchPhrase; //Text you type into the field
  const theme = useTheme();

  const handleSelect = (selectedOption) => {
    setSelectedOption(selectedOption);
    const value = selectedOption ? selectedOption.label : "";
    onSearchSuggestion(value);
  };

  //What the component should do while I type in values
  const handleInputChange = (inputValue) => {
    if (city !== null) {
      searchPhrase = inputValue;
      loadSuggestions(inputValue, city.value, language) //Call the backend
        .then((suggestions) => {
          console.log("Suggestions from backend:", suggestions);
          const newOptions = suggestions.map((suggestion) => ({
            //Get the New suggestions and format them the correct way
            label: suggestion.suggestion,
            value: suggestion.suggestion,
          }));
          options = newOptions;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const filterOptions = (inputValue) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  // const styles = {
  //   control: (provided, state) => ({
  //     ...provided,
  //     background: "#fff",
  //     borderColor: "#fff",
  //     boxShadow: state.isFocused ? null : null,
  //     textAlign: "left",
  //     paddingLeft: "6px",
  //     "&:hover": {
  //       borderColor: "#fff",
  //     },
  //   }),
  //   option: (provided) => ({
  //     ...provided,
  //     textAlign: "left",
  //   }),
  // };
  
  useEffect(() => {
    onSearchPhrase(input);
  }, [input]);

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="custom-css-class">No Suggestions</span>
      </components.NoOptionsMessage>
    );
  };

  

  return (
    <div>
      <Async
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          NoOptionsMessage,
        }}
        options={options}
        inputValue={input}
        placeholder={placeholder ? placeholder : t("start.suche")}
        // styles={{
        //   control: combinedStyles.control,
        //   option: combinedStyles.option,
        //   input: combinedStyles.input,
        // }}
        sx={useStyles} // Apply the useStyles directly
        loadOptions={loadOptions}
        value={selectedOption}
        onChange={handleSelect}
        isClearable={false}
        onInputChange={(value, action) => {
          if (action.action === "input-change") {
            setInput(value);
            handleInputChange(value);
          }
        }}
      />
    </div>
  );
};
export default AutosuggestSearchTour;
