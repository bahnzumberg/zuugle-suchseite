import * as React from 'react';
import Box from "@mui/material/Box";
import Header from "./Header";
import {Typography} from "@mui/material";
import { getPrivacyLabels } from '../../translations/translation.labels';


function Privacy({}){

    
    //translation related
    const PrivacyLabels = getPrivacyLabels();
    const matomo_link  = <a href={"https://matomo.org/"} target={"_blank"}>Matomo</a>

    return <Box className={"about-container"}>
        <Header title={PrivacyLabels.datenschutzerklaerung} subTitle={"aktualisiert: April 2022"}/>

        <Box className={'start-body-container static-container'}>
            <Box style={{textAlign: "left"}}>
                <Typography>{PrivacyLabels.datenschutz_ist_uns_wichtig}</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>{PrivacyLabels.welche_personenbezogenen_daten }</Typography>
                <Typography>{PrivacyLabels.keine_personenbezogenen_daten }</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>{PrivacyLabels.analysedienst }</Typography>
                <Typography variant={"h5"} sx={{marginTop: "10px", fontSize: "13px"}}>{PrivacyLabels.welcher_dienst }</Typography>
                <Typography>{PrivacyLabels.matomo_1} {matomo_link} {PrivacyLabels.matomo_2} </Typography>
                <Typography variant={"h5"} sx={{marginTop: "10px", fontSize: "13px"}}>{PrivacyLabels.welche_daten }</Typography>
                <Typography>{PrivacyLabels.abgespeichert_werden }</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Cookies</Typography>
                <Typography> {PrivacyLabels.cookies_erklaerung1 }</Typography>
                <Typography> {PrivacyLabels.cookies_erklaerung2 }</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}> {PrivacyLabels.mit_wem_daten_teilen } </Typography>
                <Typography>{PrivacyLabels.mit_niemandem }</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}> {PrivacyLabels.wie_lange_daten_speichern }</Typography>
                <Typography>{PrivacyLabels.cookie_verfall_drei_monate }</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>{PrivacyLabels.welche_rechte }</Typography>
                <Typography>{PrivacyLabels.nichts_von_dir_abspeichern }</Typography>

            </Box>
        </Box>
    </Box>
}

export default Privacy;