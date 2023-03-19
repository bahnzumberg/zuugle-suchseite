import * as React from 'react';
// import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import {listAllCityLinks} from "../../utils/seoPageHelper";

//description
//The file FooterLinks.js contains a React functional component that renders a footer section with a list of links passed as a prop. The component returns a Grid container wrapped in a Box component with a border on top. The Grid item spans across the full width of the container and renders the list of links passed as a prop. The padding for the container is set to 20px on the top and bottom, and 40px on the left and right.
export default function FooterLinks({links}){
    return  <Box sx={{width: "100%", borderTop: "1px solid #dfdfdf"}}>
        <Grid container sx={{padding: "20px 40px"} }>
            <Grid item xs={12}>
                {links}
            </Grid>
        </Grid>
    </Box>;
}
