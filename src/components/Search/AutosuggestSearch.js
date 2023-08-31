// import React, { useState, useEffect } from "react";
// import Async from "react-select/async";
// import Select, { components } from "react-select";
// import { loadSuggestions } from "../../actions/crudActions";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "@mui/material/styles";
// import InputAdornment from "@mui/material/InputAdornment";
// import SearchIcon from "../../icons/SearchIcon";
// import ClearSearchIcon from "../../icons/ClearSearchIcon";
// import { styled } from "@mui/system";

// const useStyles = styled("div")(({ theme }) => ({
//   "& label.Mui-focused": {
//     color: "#4992FF",
//   },
//   borderRadius: "20px",
//   border: "1.5px solid #DDD",
//   "& .MuiInput-underline:after": {
//     borderBottomColor: "#DDD",
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       border: "0",
//     },
//     "&:hover fieldset": {
//       borderColor: "#DDD",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#DDD",
//       borderWidth: 0,
//     },
//     "& .MuiInputAdornment-root": {
//       position: "start",
//       "& svg": {
//         fill: theme.palette.text.primary,
//       },
//     },
//     "& .MuiInputAdornment-positionEnd": {
//       position: "end",
//       cursor: "pointer",
//     },
//   },
// }));

// const AutosuggestSearchTour = ({
//   onSearchSuggestion,
//   onSearchPhrase,
//   city,
//   language,
//   placeholder,
//   goto,
// }) => {
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [input, setInput] = useState("");
//   const { t } = useTranslation();
//   const [options, setOptions] = useState([]);
//   // let options = [];
//   let searchPhrase; //Text you type into the field
//   const theme = useTheme();
//   console.log("options", options);
//   const handleSelect = (selectedOption) => {
//     setSelectedOption(selectedOption);
//     const value = selectedOption ? selectedOption.label : "";
//     onSearchSuggestion(value);
//   };

//   //What the component should do while I type in values
//   const handleInputChange = (inputValue) => {
//     console.log("hello", inputValue);
//     if (city !== null) {
//       searchPhrase = inputValue;
//       loadSuggestions(inputValue, city.value, language) //Call the backend
//         .then((suggestions) => {
//           console.log("Suggestions from backend:", suggestions);
//           setOptions(
//             suggestions.map((suggestion) => ({
//               //Get the New suggestions and format them the correct way
//               label: suggestion.suggestion,
//               value: suggestion.suggestion,
//             }))
//           );
//           // options = newOptions;
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     }
//   };
//   const filterOptions = (inputValue) => {
//     return options.filter((i) =>
//       i.label.toLowerCase().includes(inputValue.toLowerCase())
//     );
//   };

//   const loadOptions = (inputValue, callback) => {
//     setTimeout(() => {
//       callback(filterOptions(inputValue));
//     }, 1000);
//   };

//   useEffect(() => {
//     onSearchPhrase(input);
//   }, [input]);

//   const NoOptionsMessage = (props) => {
//     return (
//       <components.NoOptionsMessage {...props}>
//         <span className="custom-css-class">No Suggestions</span>
//       </components.NoOptionsMessage>
//     );
//   };
//   console.log("options", options);
//   return (
//     <div>
//       <Async
//         components={{
//           DropdownIndicator: () => null,
//           IndicatorSeparator: () => null,
//         }}
//         options={options}
//         inputValue={input}
//         placeholder={placeholder ? placeholder : t("start.suche")}
//         loadOptions={loadOptions}
//         value={selectedOption}
//         onChange={handleSelect}
//         isClearable={false}
//         onInputChange={(value, action) => {
//           if (action.action === "input-change") {
//             setInput(value);
//             handleInputChange(value);
//           }
//         }}
//       />
//     </div>
//   );
// };
// export default AutosuggestSearchTour;

// import React, { useState, useEffect } from "react";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import { useTheme } from "@mui/material/styles";
// import InputAdornment from "@mui/material/InputAdornment";
// import SearchIcon from "../../icons/SearchIcon";
// import ClearSearchIcon from "../../icons/ClearSearchIcon";
// import { styled } from "@mui/system";
// import { useTranslation } from "react-i18next";
// import { loadSuggestions } from "../../actions/crudActions";
// import { IconButton } from "@mui/material";

// const AutosuggestSearchTour = ({
//   onSearchSuggestion,
//   onSearchPhrase,
//   city,
//   language,
//   placeholder,
//   goto,
// }) => {
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [input, setInput] = useState("");
//   const [valueBeingSearch, setValueBeingSearch] = useState();
//   const { t } = useTranslation();
//   const [options, setOptions] = useState([]);
//   const theme = useTheme();

//   const handleSelect = (selectedOption) => {
//     console.log("selected Option", selectedOption);
//     setSelectedOption(selectedOption);
//     const value = selectedOption ? selectedOption.label : "";
//     onSearchSuggestion(value);
//   };

//   console.log("input", input);
//   const handleInputChange = (inputValue) => {
//     if (city !== null) {
//       loadSuggestions(inputValue, city.value, language)
//         .then((suggestions) => {
//           console.log("suggestions from backed:", suggestions);
//           setOptions(
//             suggestions.map((suggestion) => ({
//               label: suggestion.suggestion,
//               value: suggestion.suggestion,
//             }))
//           );
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     }
//   };

//   useEffect(() => {
//     onSearchPhrase(input);
//   }, [input]);

//   return (
//     <div>
//       <Autocomplete
//         options={options}
//         getOptionLabel={(option) => option.label}
//         value={selectedOption}
//         onChange={(event, newValue) => {
//           setValueBeingSearch(newValue);
//           handleSelect(newValue);
//         }}
//         onInputChange={(event, newInputValue) => {
//           setInput(newInputValue);
//           handleInputChange(newInputValue);
//         }}
//         sx={{ borderRadius: 50 }}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             InputProps={{
//               ...params.InputProps,
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   {input && (
//                     <IconButton
//                       onClick={() => {
//                         setInput("");
//                         setSelectedOption(null);
//                       }}
//                     >
//                       <ClearSearchIcon />
//                     </IconButton>
//                   )}
//                 </InputAdornment>
//               ),
//             }}
//             inputProps={{
//               ...params.inputProps,
//               style: { borderRadius: "50px" },
//             }}
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default AutosuggestSearchTour;

import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "../../icons/SearchIcon";
import { Box, InputBase, Typography, IconButton } from "@mui/material";
import { loadSuggestions } from "../../actions/crudActions";

const AutosuggestSearchTour = ({
  onSearchSuggestion,
  onSearchPhrase,
  city,
  language,
  placeholder,
  goto,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showClearButton, setShowClearButton] = useState(false);
  const [options, setOptions] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setShowClearButton(value !== "");

    const filteredResults = options.filter((item) =>
      item?.value?.toLowerCase()?.includes(value?.toLowerCase())
    );

    setSearchResults(filteredResults);
    setNoResults(filteredResults.length === 0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setNoResults(false);
    setSearchResults([]);
    setShowClearButton(false);
  };

  const handleInputChange = (inputValue) => {
    if (city !== null) {
      loadSuggestions(inputValue, city.value, language)
        .then((suggestions) => {
          console.log("suggestions from backend:", suggestions);
          setOptions(
            suggestions.map((suggestion) => ({
              label: suggestion.suggestion,
              value: suggestion.suggestion,
            }))
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleSelect = (selectedOption) => {
    console.log("selected Option", selectedOption);
    const value = selectedOption ? selectedOption.label : "";
    onSearchSuggestion(value);
  };

  useEffect(() => {
    handleInputChange(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <InputBase
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        fullWidth
        sx={{
          borderRadius: "12px",
          height: "56px",
          px: 2,
          border: "1px solid #DDDDDD",
        }}
        endAdornment={
          // Use endAdornment for the clear button
          <>
            {showClearButton && (
              <IconButton onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            )}
          </>
        }
        startAdornment={
          // Use startAdornment for the search icon
          <>
            <SearchIcon
              style={{
                color: "#000000",
                marginRight: "10px",
              }}
            />
          </>
        }
      />
      <Box
        sx={{
          mt: 1,
          height: "400px",
          borderRadius: "12px",
          overflowY: "auto",
        }}
      >
        {searchResults.map((result, index) => (
          <Box
            key={index}
            onClick={() => handleSelect(result)}
            sx={{
              cursor: "pointer",
              mb: "5px",
              height: "52px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              pl: "28px",
              "&:hover": {
                backgroundColor: "#EBEBEB",
              },
            }}
          >
            <Typography sx={{ color: "#101010", fontSize: "16px" }}>
              {result.value}
            </Typography>
          </Box>
        ))}
        {noResults && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "52px",
              borderRadius: "12px",
              backgroundColor: "#F8F8F8",
              fontSize: "14px",
              color: "#888888",
            }}
          >
            No results found.
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AutosuggestSearchTour;
