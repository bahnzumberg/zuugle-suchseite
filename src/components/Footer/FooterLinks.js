import * as React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function FooterLinks({links}){
    return  <Box sx={{width: "100%", borderTop: "1px solid #dfdfdf"}}>
        <Grid container sx={{padding: "20px 40px"} }>
            <Grid item xs={12}>
                {links}
            </Grid>
        </Grid>
    </Box>;
}
