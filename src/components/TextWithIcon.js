import * as React from 'react';
import Box from "@mui/material/Box";
import {Fragment} from "react";

export default function TextWithIcon({text, iconLeft, iconRight}){

    return <Box sx={{display: "flex", alignItems: "center"}}>
        {!!iconLeft ? iconLeft : <Fragment />} {text} {!!iconRight ? iconRight : <Fragment />}
    </Box>
}