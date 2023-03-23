import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import SearchContainer from "./SearchContainer";
import {useEffect, useState} from "react";
import {getDomainText, isResponsive} from "../../utils/globals";


// const LINEAR_GRADIENT = "linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.56)), ";
const LINEAR_GRADIENT = "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";
// description
//Header.js is a React component that renders the header section of a web page. It receives two props, totalTours and allCities, and conditionally renders different elements based on the value of totalTours. If totalTours is 0, it displays a maintenance message. Otherwise, it displays a heading that indicates the total number of tours available in the website and a search container for cities. The component also sets a background image using the backgroundImage state variable, which changes depending on the device's responsiveness. The component makes use of other React components from the Material-UI library such as Box and Typography, and a custom SearchContainer component. It also makes use of some utility functions from the utils/globals module.
export default function Header({totalTours, allCities}){

    const [backgroundImage, setBackgroundImage] = useState(`${LINEAR_GRADIENT} url(/app_static/img/background_start_tiny.jpeg)`);
    const _isMobile = isResponsive();

    useEffect(() => {
        if(!!_isMobile){
            setBackgroundImage(`${LINEAR_GRADIENT} url(/app_static/img/background_start_mobil.webp)`)
        } else {
            setBackgroundImage(`${LINEAR_GRADIENT} url(/app_static/img/background_start_small.webp)`)
        }
    }, [_isMobile]);
    
    if (totalTours==0) {
        return <Box className={"header-container"} style={{backgroundImage: backgroundImage}}>
            <Box className={"header-text"}>
                <Box sx={{display: "flex", alignItems: "center", marginBottom: "16px"}}>
                    <img src={`/app_static/img/logo-white.png`} height={"16px"} width={"29px"}/><Typography style={{fontSize: "16px", color: "#FFF", lineHeight: "16px", marginLeft: "5px"}}>{getDomainText()}</Typography>
                </Box>
                <Typography variant={"h1"}>Zuugle befindet sich gerade im Wartungsmodus. Bitte schau später wieder vorbei.</Typography>
            </Box>
        </Box>
    }
    else {
        return <Box className={"header-container"} style={{backgroundImage: backgroundImage}}>
            <Box className={"header-text"}>
                <Box sx={{display: "flex", alignItems: "center", marginBottom: "16px"}}>
                    <img src={`/app_static/img/logo-white.png`} height={"16px"} width={"29px"}/><Typography style={{fontSize: "16px", color: "#FFF", lineHeight: "16px", marginLeft: "5px"}}>{getDomainText()}</Typography>
                </Box>
                <Typography variant={"h1"}>{totalTours.toLocaleString()} Bergtouren im deutschsprachigen Alpenraum – erreichbar mit Bahn & Bus</Typography>
            </Box>
            {(!!allCities && allCities.length > 0) &&
                <SearchContainer goto={"/suche"}/>
            }
        </Box>
    }
}
