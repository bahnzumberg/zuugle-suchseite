import React, { useState } from "react";
import { loadSuggestions } from "../../actions/crudActions";
import CustomSelect from "./CustomSelect";
import { isArray } from "lodash";


const AutosuggestSearchTour = ({
  onSearchSuggestion,
  onSearchPhrase,
  city,
  language,
  placeholder,
  goto,
}) => {

  const [options, setOptions] = useState([]);
  const urlSearchParams = new URLSearchParams(window.location.search);
  let searchParam = urlSearchParams.get("search");
  const [searchPhrase, setSearchPhrase] = useState(searchParam ?? "");

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
          const newOptions = suggestions?.map((suggestion) => ({
            //Get the New suggestions and format them the correct way
            label: suggestion.suggestion,
            value: suggestion.suggestion,
          }));
          // console.log("Suggestions from backend:", newOptions);
          newOptions && isArray(newOptions) && setOptions([...newOptions]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  

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
