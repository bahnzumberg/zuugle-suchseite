import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import Home from "../icons/Home";
import ChevronDown from "../icons/ChevronDown";
import ChevronUp from "../icons/ChevronUp";

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#4992FF',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#ECECEC',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ECECEC',
        },
        '&:hover fieldset': {
            borderColor: '#ECECEC',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ECECEC',
            borderWidth: 1
        },
    },
});


export default function CityInput({loadCities, city, setCity, onFocus, isOpen, showRightIcon = true, onClick, disabled}){

    const placeholder = () => {
        let host = window.location.host;
        if(host.indexOf("zuugle.at") >= 0){
            return "Wien, Graz, ...";
        } else if(host.indexOf("zuugle.de") >= 0){
            return "München, Rosenheim, ...";
        } else if(host.indexOf("zuugle.ch") >= 0){
            return "Zürich, ...";
        } else if(host.indexOf("zuugle.it") >= 0){
            return "Bozen, ...";
        } else {
            return "Wien, Graz, ...";
        }
    }

    return <CssTextField
        className={"city-input"}
        label={"Heimatbahnhof"}
        placeholder={placeholder()}
        variant="outlined"
        fullWidth
        disabled={disabled}
        value={city}
        disableautofocus="true"
        // disableAutoFocus={true}
        autoComplete={"off"}
        key={"city-input"}
        onChange={(event) => {
            setCity(event.target.value);
            loadCities({search: event.target.value});
        }}
        onFocus={() => !!onFocus && onFocus(true)}
        onBlur={() => !!onFocus && onFocus(false)}
        onClick={() => !!onClick && onClick()}
        InputProps={{
            startAdornment:  (
                <InputAdornment position="start">
                    <Home style={{strokeWidth: 0.5, stroke: "#101010"}}/>
                </InputAdornment>
            ),
            endAdornment: (
                !!showRightIcon && (
                    isOpen ?
                        <InputAdornment position="end" onClick={() => !!onFocus && onFocus(false)} sx={{cursor: "pointer"}}>
                            <ChevronUp />
                        </InputAdornment> :
                        <InputAdornment position="end" onClick={() => !!onFocus && onFocus(true)} sx={{cursor: "pointer"}}>
                            <ChevronDown />
                        </InputAdornment>
                )

            ),
            className: "search-bar-input"}}
    />;

};