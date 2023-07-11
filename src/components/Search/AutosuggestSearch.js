import React, { useState } from 'react';
import Async from 'react-select/async';
import { components } from "react-select";
import ChevronDown from "../../icons/ChevronDown";
import Search from "../../icons/SearchIcon";

const options = [
   { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
];

const filterOptions = (inputValue) => {
    return options.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const loadOptions = (inputValue, callback) => {
    //TODO: do the fetch request and get the suggestions
    //TODO: Clear the array and then put the suggestions into the array
    setTimeout(() => {
        callback(filterOptions(inputValue));
    }, 1000);
};

const styles = {
    valueContainer: (base) => ({
        ...base,
        paddingLeft: 40,
        textAlign: "left",
        color: 'red'
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
            borderColor: '#fff'
        }
    }),
    option: (provided,) => ({
        ...provided,
        textAlign: "left"
    })
};


const DropdownIndicator = (props) => {
    return components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
            <ChevronDown style={{ strokeWidth: 1, color: '#fff' }} />
        </components.DropdownIndicator>
    );
};

const SearchIconContainer = ({ children, ...props }) => {
    return (
        components.ValueContainer && (
            <components.ValueContainer {...props}>
                {!!children && (
                    <Search style={{ position: 'absolute', left: 6, strokeWidth: 1, stroke: "#101010", fill: "#101010" }} />
                )}
                {children}
            </components.ValueContainer>
        )
    );
};

const AutosuggestSearchTour = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setSelectedOption(null);
    };

    const handleSelect = (selectedOption) => {
        console.log(selectedOption);
        setSelectedOption(selectedOption);
    };

    return (
        <Async
            components={{
                DropdownIndicator,
                ValueContainer: SearchIconContainer
            }}
            loadOptions={loadOptions}
            defaultOptions={options}
            placeholder={isFocused ? "" : "Suche..."}
            styles={styles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleSelect}
            value={selectedOption}
        />
    );
};

export default AutosuggestSearchTour;
