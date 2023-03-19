import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import Destination from "../icons/Destination";
import Close from "../icons/Close";
import CloseFilled from "../icons/CloseFilled";

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


export default function RegionInput({loadRegions, region, setRegion, onFocus, isOpen, city, onClick, disabled, onCustomSubmit, setOpenRegionSearch, resetInput}){

    return <CssTextField
        className={"city-input"}
        label={"Suche (optional)"}
        placeholder={"Berggipfel, Region, Sportart, ..."}
        variant="outlined"
        fullWidth
        disabled={disabled}
        value={region}
        disableautofocus="true"
        // disableAutoFocus={true}
        key={"region-input"}
        autoComplete={"off"}
        onChange={(event) => {
            if(!!!isOpen){
                setOpenRegionSearch(true);
            }
            setRegion(event.target.value);
            loadRegions({search: event.target.value, city: (!!city ? city.value : undefined)});
        }}
        onFocus={() => !!onFocus && onFocus(true)}
        onBlur={() => !!onFocus && onFocus(false)}
        onClick={() => !!onClick && onClick()}
        onKeyDown={e => {
            if (e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                if(!!onCustomSubmit){
                    onCustomSubmit();
                }
            }
        }}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <Destination  style={{strokeWidth: 0.5, stroke: "#101010", fill: "#101010"}}/>
                </InputAdornment>
            ),
            endAdornment: <>
                {!!region ? <InputAdornment className={"cursor-link"} position="end" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if(!!resetInput){
                        resetInput();
                    }
                }}>
                    <CloseFilled  style={{strokeWidth: 0.5}}/>
                </InputAdornment> : <></>}
            </>,
            className: "search-bar-input"}}
    />;

};