import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import {Typography} from "@mui/material";

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#4992FF',
    },
    "& .MuiFilledInput-underline:after": {
        borderBottom: "none",
        borderBottomWidth: "0px"
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
    '& .MuiFilledInput-root': {
        background: "transparent",
        border: "1px solid #EAEAEA",
        borderRadius: "12px",
        '&:before': {
            border: 'none',
        },
        '&:hover:before': {
            border: 'none',
        },
        '&$focused': {
            backgroundColor: "transparent",
        },
    },
});


export default function NumberInput({value, onChange, label, variant, endAdormentLabel = "hm"}){

    let inputProps = {};
    if(!!endAdormentLabel){
        inputProps.endAdornment =  <InputAdornment position="end">
            <Typography sx={{color: "#8B8B8B", fontSize: "16px"}}>{endAdormentLabel}</Typography>
        </InputAdornment>
    }

    return <CssTextField
        label={label}
        variant={variant}
        fullWidth
        disableAutoFocus={true}
        type={"number"}
        value={value}
        onChange={onChange}
        InputLabelProps={{
            style: { color: '#8B8B8B', fontSize: "12px" },
        }}
        InputProps={inputProps}
    />;

};