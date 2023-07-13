import React, {useState, useEffect} from 'react';
import Async from 'react-select/async';
import {components} from 'react-select';
import ChevronDown from '../../icons/ChevronDown';
import Search from '../../icons/SearchIcon';
import {loadSuggestions} from "../../actions/crudActions";

const AutosuggestSearchTour = ({onSearchSuggestion, onSearchPhrase, city, language, placeholder}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    let options = [];
    let searchPhrase;

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () =>{
        onSearchPhrase(searchPhrase)
        setIsFocused(false)
    }
    const handleSelect = (selectedOption) => {
        setSelectedOption(selectedOption);
        const value = selectedOption ? selectedOption.label : '';
        console.log("Value of Search Suggestion")
        onSearchSuggestion(value);
    };

    const handleInputChange = (inputValue) => {
        if (city !== null) {
            //console.log("input:", inputValue, "City:", city.value, "Language:", language);
            //if(inputValue !== '') --> 2nd method
            //    onSearchPhrase(inputValue);
            searchPhrase = inputValue;
            loadSuggestions(inputValue, city.value, language)
                .then((suggestions) => {
                    const newOptions = suggestions.item.map((suggestion) => ({
                        label: suggestion.suggestion,
                        value: suggestion.suggestion,
                    }));
                    options = newOptions;
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            console.log("Error due to not selecting a Heimatbahnhof");
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

    const styles = {
        valueContainer: (base) => ({
            ...base,
            paddingLeft: 40,
            textAlign: 'left',
            color: 'red',
        }),
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: '#fff',
            minHeight: '55px',
            height: '55px',
            boxShadow: state.isFocused ? null : null,
            minWidth: '300px',
            '&:hover': {
                borderColor: '#fff',
            },
        }),
        option: (provided) => ({
            ...provided,
            textAlign: 'left',
        }),
    };

    const SearchIconContainer = ({children, ...props}) => {
        return (
            components.ValueContainer && (
                <components.ValueContainer {...props}>
                    {!!children && (
                        <Search
                            style={{position: 'absolute', left: 6, strokeWidth: 1, stroke: '#101010', fill: '#101010'}}
                        />
                    )}
                    {children}
                </components.ValueContainer>
            )
        );
    };
    return (
        <Async
            components={{
                DropdownIndicator:() => null,
                IndicatorSeparator:() => null,
                ValueContainer: SearchIconContainer,
            }}
            loadOptions={loadOptions}
            defaultOptions={options}
            placeholder={isFocused ? '' : placeholder ? placeholder : "Öffi-Touren im Alpenraum"}
            styles={styles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleSelect}
            onInputChange={handleInputChange}
            value={selectedOption}
            isClearable={false}
        />
    );
};

export default AutosuggestSearchTour;
