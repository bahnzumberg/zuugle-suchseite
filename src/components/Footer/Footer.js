import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import {listAllCityLinks} from "../../utils/seoPageHelper";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();


export default function Footer({}){
    return  <Box sx={{width: "100%", borderTop: "1px solid #dfdfdf"}}>
        <Grid container sx={{padding: "20px 40px"} }>
            <Grid item xs={12} md={10}>
                <Grid container spacing={2}>
                    <Grid item xs="auto" md={2} style={{maxWidth: "30px"}} className={"footer-logo"}>
                        <img src={`/app_static/img/logo140.png`} height={"20px"} width={"36px"}/>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Typography id="yearSpan" sx={{marginLeft: "10px", color: "#4992FF"}}>© {`${currentYear}`} Zuugle</Typography>
                    </Grid>
                    <Grid item xs  md={3}>
                        <Typography sx={{marginLeft: "10px", textDecoration: "underline"}} className={"cursor-link"} onClick={() => window.open(`https://www.bahnzumberg.at`)}>Bahn zum Berg</Typography>
                    </Grid>
                    <Grid item xs  >
                        <Typography sx={{marginLeft: "10px", textDecoration: "underline"}} className={"cursor-link"} onClick={() => window.open(`${window.location.protocol}//${window.location.host}/privacy`)}>Datenschutz</Typography>
                    </Grid>
                    <Grid item xs  >
                        <Typography sx={{marginLeft: "10px", textDecoration: "underline"}} className={"cursor-link"}  onClick={() => window.open(`${window.location.protocol}//${window.location.host}/imprint`)}>Impressum</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={2}>
                <Box sx={{textAlign: "right"}} className={"social-icons"}>
                    <img className={"cursor-link"} src={`/app_static/img/logo-facebook.png`} width={"20px"} height={"20px"} onClick={() => window.open("https://www.facebook.com/bahnzumberg/")}  loading="lazy"/> &nbsp; <img className={"cursor-link"} src={`/app_static/img/logo-instagram.png`} width={"20px"} height={"20px"} style={{marginLeft: "5px"}} onClick={() => window.open("https://www.instagram.com/bahnzumberg/")}  loading="lazy"/>
                </Box>
            </Grid>
        </Grid>
    </Box>;
}
