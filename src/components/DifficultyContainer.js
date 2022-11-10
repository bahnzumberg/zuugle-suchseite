import * as React from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import DifficultySlider from "./DifficultySlider";
import TextWithIcon from "./TextWithIcon";
import Intensity from "../icons/Intensity";

export default function DifficultyContainer({value, disabled = false}){

    return <Box sx={{ bgcolor: 'info.main', borderRadius: '16px', padding: '20px', position: 'relative' }}>
        <Box sx={{position: "absolute", top: '20px', right: '20px'}}>
            <Typography variant={"error"}><TextWithIcon text={value} iconRight={<Intensity style={{stroke: "#FF540B", fill: "none", strokeWidth: 1.5}}/>} /></Typography>
        </Box>
        <Typography variant={"subtitle1"}>Schwierigkeit</Typography>
        <Box  sx={{marginTop: '10px'}}>
            <Typography variant={"textSmall"}>Der Schwierigkeitswert wurde nach den allgemein verfügbaren Schwierigkeitsskalen auf den diversen Tourenportalen konsolidiert und kann zwischen 1 (leicht) bis 10 (sehr schwierig) variieren.</Typography>
            {/*<br/>
            <Typography variant={"link"} sx={{fontSize: '14px'}}>Mehr erfahren...</Typography>*/}
        </Box>

        <DifficultySlider
            containerSx={{marginTop: '20px'}}
            defaultValue={value}
            disabled={disabled}
        />

    </Box>
}