import React, { useState } from "react";
import { loadSuggestions } from "../../actions/crudActions";
import CustomSelect from "./CustomSelect";
import { getTLD } from "../../utils/globals";

const AutosuggestSearchTour = ({ onSearchSuggestion, city, language }) => {
  const [options, setOptions] = useState([]);
  const urlSearchParams = new URLSearchParams(window.location.search);
  let searchParam = urlSearchParams.get("search");
  const [searchPhrase, setSearchPhrase] = useState(searchParam ?? "");

  const handleSelect = (phrase) => {
    const value = phrase ? phrase : searchPhrase ? searchPhrase : "";
    onSearchSuggestion(value);
  };

  //What the component should do while I type in values
  const handleInputChange = (inputValue) => {
    let _city = "";
    const tld = getTLD();

    if (city !== null) {
      _city = "";
    }
    else {
      _city = city.value;
    }
    
    setSearchPhrase(inputValue);
    loadSuggestions(inputValue, _city, language, tld) //Call the backend
      .then((suggestions) => {
        const newOptions = suggestions?.map((suggestion) => ({
          //Get the New suggestions and format them the correct way
          label: suggestion.suggestion,
          value: suggestion.suggestion,
        }));
        if (Array.isArray(newOptions)) {
          setOptions([...newOptions]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <CustomSelect
        options={options}
        handleSelect={handleSelect}
        handleInputChange={handleInputChange}
        searchPhrase={searchPhrase}
      />
    </div>
  );
};
export default AutosuggestSearchTour;
