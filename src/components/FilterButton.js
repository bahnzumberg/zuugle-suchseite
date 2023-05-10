import * as React from 'react';
import {Settings} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import { useTranslation} from 'react-i18next';

export default function FilterButton({openFilter, filterActive = 0, disabled = false}){

    const {t} = useTranslation();
    const filterLabel = t('main.filter');
    const aktivLabel = t('main.aktiv');

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
        <span> {filterLabel} <span style={{color: "#4992FF" }}>({filterActive} {aktivLabel})</span></span>
    </CssButton>

}