import * as React from 'react';
import Select from "react-select";

export default function SortInput({onChange, value, disabled}){


    const styles = {
        valueContainer: base => ({
            ...base,
            textAlign: "left",
            paddingLeft: 20
        }),
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: state.isFocused ? '#ECECEC' : '#ECECEC',
            minHeight: '40px',
            minWidth: '140px',
            height: '40px',
            borderRadius: 100,
            boxShadow: state.isFocused ? null : null,
            '&:hover': {
                borderColor: '#ECECEC'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            textAlign: "left"
        })
    }

    const options = [
        { value: 'relevanz', label: 'Relevanz' },
        // { value: 'bewertung', label: 'Bewertung' },
        { value: 'anfahrtszeit', label: 'Anfahrtszeit' },
        { value: 'tourdistanz', label: 'Tourdistanz' },
        { value: 'tourdauer', label: 'Tourdauer' }
    ]


    let defaultValue = null;
    if(!!value){
        defaultValue = options.find(entry => entry.value === value);
    }

    return <Select
        options={options}
        placeholder={'Sortierung'}
        styles={styles}
        onChange={onChange}
        value={defaultValue}
        defaultValue={defaultValue}
        disabled={disabled}
    />
}