import * as React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next"


export default function SponsoringContainer({}){

    const {t} = useTranslation();
    const werbung = t('start.werbung');

    return <Box style={{backgroundColor: "#FFF", padding: "20px", borderRadius: "32px", borderColor: "#ECECEC", borderWidth: "1px"}}>
        <Grid container columnSpacing={"30px"}>
            <Grid item md={4} sx={{alignSelf: "center"}} className={"cursor-link"} onClick={() => window.open("https://www.deuter.com/", '_blank').focus()}>
                <img src={`app_static/img/deuter.png`} className={"image"} width={"60%"} loading="lazy"/>
                    <Typography style={{marginTop: "10px", fontSize: "12px", color: "#8B8B8B", marginBottom: "10px"}}>
                        {werbung}
                    </Typography>
            </Grid>
            <Grid item md={4} sx={{alignSelf: "center"}} className={"cursor-link"} onClick={() => window.open("https://www.wipptal.at", '_blank').focus()}>
                <img src={`app_static/img/wipptal-logo.jpg`} className={"image"} width={"60%"} loading="lazy"/>
                    <Typography style={{marginTop: "10px", fontSize: "12px", color: "#8B8B8B", marginBottom: "10px"}}>{werbung}</Typography>
            </Grid>
            <Grid item md={4} sx={{alignSelf: "center"}} className={"cursor-link"} onClick={() => window.open("https://www.alpconv.org/de/startseite/", '_blank').focus()}>
                <img src={`app_static/img/Alpenkonvention_logo_gruen.png`} className={"image"} width={"60%"} loading="lazy"/>
                    <Typography style={{marginTop: "10px", fontSize: "12px", color: "#8B8B8B", marginBottom: "10px"}}>{werbung}</Typography>
            </Grid>
        </Grid>
    </Box>
}
