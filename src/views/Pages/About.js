import * as React from 'react';
import Box from "@mui/material/Box";
import Header from "./Header";
import {Typography} from "@mui/material";
import { getAboutLabels } from '../../translations/translation.labels';

function About({}){

    const AboutLabels = getAboutLabels();

    return <Box className={"about-container"}>
        <Header title={AboutLabels.was_ist_zuugle}/>

        <Box className={'start-body-container'} style={{maxWidth: "1000px", marginLeft: "auto", marginRight: "auto"}}>
            <Box style={{textAlign: "left"}}>
                <Typography variant={"h5"} sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "16px"}}> 
                    {AboutLabels.was_ist_zuugle}
                </Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>
                <>    
                    {AboutLabels.zuugle_erklaerung_1} 
                </>
                </Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>
                    {AboutLabels.zuugle_erklaerung_2} 
                 </Typography>
            
                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>
                {AboutLabels.entwicklung_von_zuugle_1}
                </Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}> 
                    {AboutLabels.entwicklung_von_zuugle_2} 
                </Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>{AboutLabels.entwicklung_von_zuugle_3}</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>{AboutLabels.entwicklung_von_zuugle_4}</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>{AboutLabels.entwicklung_von_zuugle_5}</Typography>
            </Box>
        </Box>
    </Box>
}

export default About;

{/* 
<Typography variant={"h5"} sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}><i>Zuugle</i> {AboutLabels.user_group}</Typography>

<Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px", textDecoration: "underline"}} className={"cursor-link"}  onClick={() => window.open(`https://www.facebook.com/groups/zuugle/`)}>{AboutLabels.link_zur_fb} </Typography> */}