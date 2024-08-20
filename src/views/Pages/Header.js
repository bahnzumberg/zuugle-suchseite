import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {getDomainText} from "../../utils/globals";
import '/src/config.js';

export default function Header({title, subTitle}){
    let tld = window.location.hostname.slice(-2);
    if (tld.length !== 2) { tld = 'at'; }

    return <Box className={"header-container utils"} sx={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.56)), url(/app_static/img/background_start_small_{tld}.webp)`, paddingLeft: 0, height: "300px"}}>
        <Box className={"header-text"} style={{maxWidth: "1000px", marginLeft: "auto", marginRight: "auto", paddingLeft: 0}}>
            <Box sx={{display: "flex", alignItems: "center", marginBottom: "16px"}}>
                <img 
                    src={`/app_static/img/logo-white.png`} 
                    height={"16px"} width={"29px"}
                    alt="Zuugle Logo"
                />
                <Typography style={{fontSize: "16px", color: "#FFF", lineHeight: "16px", marginLeft: "5px"}}>{getDomainText()}
                </Typography>
            </Box>
            <Typography variant={"h1"}>{title}</Typography>
            {!!subTitle && <Typography style={{color: "#FFF"}}>{subTitle}</Typography>}
        </Box>
    </Box>
}
