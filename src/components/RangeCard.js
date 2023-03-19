import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import {checkIfImageExists} from "../utils/globals";

const DEFAULT_IMAGE = `${window.location.origin}/app_static/img/default.jpg`;

export default function RangeCard({range, onSelectTour}){
    const [image, setImage] = useState(DEFAULT_IMAGE);

    useEffect(() => {
        if(!!range){
            if(!!range.image_url){
                checkIfImageExists(range.image_url).then(exists => {
                    if(!!exists){
                        setImage(range.image_url);
                    } else {
                        setImage(DEFAULT_IMAGE)
                    }
                })
            } else {
                setImage(DEFAULT_IMAGE);
            }
        }
    }, [range])

    const getStates = () => {
        if(!!range && !!range.states && range.states.length > 0){
            if(range.states.length > 2){
                return `${range.states[0]}, ${range.states[1]}, ...`
            } else if(range.states.length == 2){
                return `${range.states[0]}, ${range.states[1]}`
            } else {
                return `${range.states[0]}`
            }
        }
        return "";
    }

    return  <Paper sx={{height: '228px',
        backgroundImage: `url('${image}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'relative',
        borderRadius: '24px'
    }} className={"cursor-link"} onClick={({target}) => onSelectTour(range)}>
        <Box sx={{padding: '20px', position: 'absolute', bottom: '0px', left: '0px'}}>
            <Typography sx={{textAlign: 'left', fontWeight: 'bold'}} color={'#FFFFFF'}>{range.range}</Typography>
            <Typography sx={{textAlign: 'left'}} color={'#FFFFFF'}>{getStates()}</Typography>
        </Box>
    </Paper>
}
