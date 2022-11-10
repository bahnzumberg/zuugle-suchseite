import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import {MyLocation} from "@mui/icons-material";

export default function SearchBarInput({label}){

    const CssTextField = styled(TextField)({
        '& label.Mui-focused': {
            color: '#ECECEC',
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


    return <CssTextField
        label={label}
        placeholder={"Berggipfel, Region, Sportart ..."}
        variant="outlined"
        fullWidth
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <MyLocation />
                </InputAdornment>
            ),
            className: "search-bar-input"}}
    />;

};