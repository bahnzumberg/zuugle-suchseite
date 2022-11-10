import * as React from "react";
import {styled} from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const EntitySlider = styled(Slider)(({ theme }) => ({
    color: "red",
    height: 3,
    padding: "13px 0",
    "& .MuiSlider-thumb": {
        height: 20,
        width: 20,
        backgroundColor: "white",
        border: "none",
    },
    "& .MuiSlider-track": {
        height: '5px',
        background: "#4992FF",
        opacity: 1,
        border: "none",
    },
    "& .MuiSlider-rail": {
        background: "#4992FF",
        height: '5px',
        opacity: 1,
        border: "none",
    }
}));

export default function GeneralSlider({defaultValue, sx, containerSx, value, onChange, min, max, step = 1}) {

    return (
        <Box sx={containerSx}>
            <EntitySlider
                min={min}
                max={max}
                defaultValue={defaultValue}
                value={value}
                step={step}
                onChange={onChange}
            />
        </Box>
    );
}