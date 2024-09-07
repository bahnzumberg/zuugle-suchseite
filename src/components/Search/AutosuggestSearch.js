import React, { useState } from "react";
import { loadSuggestions } from "../../actions/crudActions";
import CustomSelect from "./CustomSelect";

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
    if (city !== null) {
      setSearchPhrase(inputValue);
      loadSuggestions(inputValue, city.value, language) //Call the backend
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
    </div>
  );
};
export default AutosuggestSearchTour;
