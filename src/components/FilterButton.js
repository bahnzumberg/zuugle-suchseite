import * as React from 'react';
import {Settings} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";

export default function FilterButton({openFilter, filterActive = 0, disabled = false}){

    const CssButton = styled(Button)({

    });


    return <CssButton
        variant="outlined"
        fullWidth
        startIcon={<Settings />}
        sx={{
            borderRadius: 100,
            borderColor: '#ECECEC',
            color: '#101010',
            textAlign: 'left',
            justifyContent: "flex-start",
            height: "40px"
        }}
        disabled={disabled}
        onClick={openFilter}
    >
        <span>Filter <span style={{color: "#4992FF" }}>({filterActive} aktiv)</span></span>
    </CssButton>

}