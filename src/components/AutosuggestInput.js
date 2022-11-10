import * as React from 'react';
import {components} from "react-select";
import Async from 'react-select/async';
import Home from "../icons/Home";
import ChevronDown from "../icons/ChevronDown";

export default function AutosuggestInput({loadFunction}){

    const DropdownIndicator = (props) => {
        return components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
                <ChevronDown style={{ strokeWidth: 1 }}/>
            </components.DropdownIndicator>
        );
    };

    const PlaceholderComponent = (
        <div>
            <div style={{fontSize: 12, textAlign: "left"}}>Heimatbahnhof</div>
            <div style={{fontSize: 16, textAlign: "left"}}>Wien</div>
        </div>
    );

    const ValueContainer = ({ children, ...props }) => {
        return (
            components.ValueContainer && (
                <components.ValueContainer {...props}>
                    {!!children && (
                        <Home style={{ position: 'absolute', left: 6, strokeWidth: 1, stroke: "#101010", fill: "#101010" }} />
                    )}
                    {children}
                </components.ValueContainer>
            )
        );
    };

    const styles = {
        valueContainer: base => ({
            ...base,
            paddingLeft: 40,
            textAlign: "left"
        }),
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: state.isFocused ? '#ECECEC' : '#ECECEC',
            minHeight: '55px',
            height: '55px',
            boxShadow: state.isFocused ? null : null,
            minWidth: '300px',
            '&:hover': {
                borderColor: '#ECECEC'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            textAlign: "left"
        })
    }

    const mapResultToOptions = (values) => {
        return values;
    }

    return <Async
        components={{ DropdownIndicator, ValueContainer }}
        placeholder={PlaceholderComponent}
        styles={styles}
        defaultOptions={[{label: "as", value: "as"}]}
        loadOptions={(value) => {
            return new Promise(async resolve => {
                if(!!loadFunction){
                    const result = await loadFunction({search: value});
                    if(!!result && !!result.data){
                        resolve(mapResultToOptions(result.data.cities));

                    }
                }
                resolve([]);
            })
        }}
    />
}