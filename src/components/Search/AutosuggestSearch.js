import React, {useState, useEffect} from 'react';
import Async from 'react-select/async';
import {components} from 'react-select';
import ChevronDown from '../../icons/ChevronDown';
import Search from '../../icons/SearchIcon';

const AutosuggestSearchTour = ({onSearchSuggestion}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleSelect = (selectedOption) => {
        setSelectedOption(selectedOption);
        const value = selectedOption ? selectedOption.label : '';
        onSearchSuggestion(value);
    };

    const handleInputChange = (inputValue) => {
        //TODO: Set the search ohrase with the value of input value without breaking the autosuggest field
        //onSearchSuggestion(inputValue);
    };

    const options = [
        {label: 'Option 1', value: 'd'},
        {label: 'Alpen', value: 'alpen'},
    ];

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

    const DropdownIndicator = (props) => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <ChevronDown style={{strokeWidth: 1, color: '#fff'}}/>
                </components.DropdownIndicator>
            )
        );
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
                DropdownIndicator,
                ValueContainer: SearchIconContainer,
            }}
            loadOptions={loadOptions}
            defaultOptions={options}
            placeholder={isFocused ? '' : 'Beliebte Suchen'}
            styles={styles}
            onFocus={handleFocus}
            onChange={handleSelect}
            onInputChange={handleInputChange}
            value={selectedOption}
            isClearable={true}
        />
    );
};

export default AutosuggestSearchTour;
