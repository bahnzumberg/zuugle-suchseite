import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import { getDomainText, get_meta_data, getTopLevelDomain, get_currLanguage } from "../../utils/globals";
import { Helmet } from "react-helmet";
import '/src/config.js';

export default function Header({title, subTitle, page}){
    const meta = get_meta_data(page);
    const tld = getTopLevelDomain();
    const currLanguage = get_currLanguage();

    return ( 
        <>
        <Helmet>
          {meta}
          <title>Zuugle - {title}</title>
          <meta http-equiv="content-language" content="{currLanguage}" />
        </Helmet>
        <Box className={"header-container utils"} sx={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.56)), url(/app_static/img/background_start_small_${tld}.webp)`, paddingLeft: 0, height: "300px"}}>
            <Box className={"header-text"} style={{maxWidth: "1000px", marginLeft: "auto", marginRight: "auto", paddingLeft: 0}}>
                <Box sx={{display: "flex", alignItems: "center", marginBottom: "16px"}}>
                <a href="/">
                        <img 
                            src={`/app_static/img/logo-white.png`} 
                            height={"16px"} width={"29px"}
                            alt="Zuugle Logo"
                        />
                </a>
                <a href="/"><Typography style={{fontSize: "16px", color: "#FFF", lineHeight: "16px", marginLeft: "5px"}}>{getDomainText()}
                </Typography></a>
                </Box>
                <Typography variant={"h1"}>{title}</Typography>
                {!!subTitle && <Typography style={{color: "#FFF"}}>{subTitle}</Typography>}
            </Box>
        </Box>
    </>
    )
}
