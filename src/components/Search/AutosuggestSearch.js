import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { loadSuggestions } from "../../actions/crudActions";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
// import Async from "react-select/async";
// import InputAdornment from "@mui/material/InputAdornment";
// import SearchIcon from "../../icons/SearchIcon";
// import ClearSearchIcon from "../../icons/ClearSearchIcon";
import { styled } from "@mui/system";
import CustomSelect from "./CustomSelect";

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
  // const [selectedOption, setSelectedOption] = useState(null);
  const [input, setInput] = useState("");
  // const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const urlSearchParams = new URLSearchParams(window.location.search);
  let searchParam = urlSearchParams.get("search");
  const [searchPhrase, setSearchPhrase] = useState(searchParam ?? "");
  // const theme = useTheme();

  const handleSelect = (phrase) => {
    const value = phrase ? phrase : searchPhrase ? searchPhrase : "";
    // setSelectedOption(value);
    onSearchSuggestion(value);
  };

  //What the component should do while I type in values
  const handleInputChange = (inputValue) => {
    if (city !== null) {
      setSearchPhrase(inputValue);
      loadSuggestions(inputValue, city.value, language) //Call the backend
        .then((suggestions) => {
          const newOptions = suggestions.map((suggestion) => ({
            //Get the New suggestions and format them the correct way
            label: suggestion.suggestion,
            value: suggestion.suggestion,
          }));
          // console.log("Suggestions from backend:", newOptions);
          setOptions([...newOptions]);
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

  const customStyles = {
    // Style the container that holds the entire AsyncSelect component
    container: (provided, state) => ({
      ...provided,
      width: "75%",
      innerHeight: "80px",
      borderRadius: "25px",
    }),

    // Style the control (input field and dropdown indicator)
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#00A8E8" : "#CED4DA", // Example: change border color
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(0,168,232,.25)" : "none", // Example: add focus style
    }),

    // Style the option in the dropdown menu
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#00A8E8" : "white", // Example: change selected option background color
      color: state.isSelected ? "white" : "black", // Example: change selected option text color
    }),

    // Style the input field
    input: (provided, state) => ({
      ...provided,
      color: "black", // Example: change text color
    }),

    // Style the loading indicator while fetching data asynchronously
    loadingIndicator: (provided) => ({
      ...provided,
      color: "green", // Example: change loading indicator color
    }),

    // Style the clear indicator (X button)
    clearIndicator: (provided) => ({
      ...provided,
      color: "red", // Example: change clear indicator color
    }),
  };

  useEffect(() => {
    console.log("Input : ", input)
    onSearchPhrase(input);
    searchParam = urlSearchParams.get("search")
  }, [input]);



  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="custom-css-class">No Suggestions</span>
      </components.NoOptionsMessage>
    );
  };

  // console.log(options);

  return (
    <div>
      <CustomSelect
        options={options}
        handleSelect={handleSelect}
        handleInputChange={handleInputChange}
        searchPhrase={searchPhrase}
      />
      {/* <Async
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          // NoOptionsMessage,
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
        styles={customStyles}
        loadOptions={loadOptions}
        value={
          selectedOption ? selectedOption : searchPhrase ? searchPhrase : ""
        }
        onChange={handleSelect}
        isClearable={true}
        onInputChange={(value, action) => {
          if (action.action === "input-change") {
            setInput(value);
            handleInputChange(value);
          }
        }}
      /> */}
    </div>
  );
};
export default AutosuggestSearchTour;
