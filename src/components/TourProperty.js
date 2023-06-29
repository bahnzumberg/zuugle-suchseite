import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

//description
//TourProperty, which takes three props as input: title, text, and icon. It is used to display a particular property or feature of a tour on a web page.
// The component returns a Box component from Material-UI with a specified styling, including a background color, border radius, and padding. The title and text props are then displayed within the Box component using Material-UI's Typography component with variant props of "text" and "subtitle1", respectively.
// the icon prop is not currently being used in the component.
export default function TourProperty({title, text, icon}){

    return <Box sx={{ bgcolor: 'info.main', borderRadius: '16px', padding: '20px', position: 'relative' }}>
        <Typography variant={"text"}>{title}</Typography>
        <Typography variant={"subtitle1"}>{text}</Typography>
    </Box>
}