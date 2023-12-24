import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

//marked for deletion
export default function TourProperty({title, text, icon}){

    return <Box sx={{ bgcolor: 'info.main', borderRadius: '16px', padding: '20px', position: 'relative' }}>
        <Typography variant={"text"}>{title}</Typography>
        <Typography variant={"subtitle1"}>{text}</Typography>
    </Box>
}