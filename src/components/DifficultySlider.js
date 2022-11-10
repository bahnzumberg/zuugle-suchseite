import * as React from "react";
import {styled} from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const EntitySlider = styled(Slider)(({ theme }) => ({
    color: "transparent",
    background: "linear-gradient(90deg, #4992FF 32.82%, #FF540B 108.66%)",
    height: "5px",
    padding: "0px !important",
    "& .MuiSlider-thumb": {
        height: 24,
        width: 24,
        backgroundColor: "white",
        border: "1px solid rgba(0,0,0,0.2)",
    },
    "& .MuiSlider-track": {
        height: '5px',
        opacity: 1,
        border: "none",
    },
    "& .MuiSlider-rail": {
        height: '5px',
        opacity: 1,
        border: "none",
    }
}));

export default function DifficultySlider({value, onChange, defaultValue, sx, containerSx, disabled = false}) {

    const resultRed = 73 + (defaultValue / 100) * (255 - 73);
    const resultGreen = 146 + (defaultValue / 100) * (84 - 146);
    const resultBlue = 255 + (defaultValue / 100) * (11 - 255);

    return (
        <Box sx={containerSx}>
            <EntitySlider
                min={1}
                max={10}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </Box>
    );
}