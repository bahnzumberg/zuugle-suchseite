import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import { useTranslation } from 'react-i18next';


export default function KPIContainer({totalTours, totalConnections, totalRanges, totalCities, city, totalProvider}){

    const {t, i18n} = useTranslation();

    const navigate = useNavigate();
    const goto = () => {
        navigate(`/suche?${!!city ? '&city='+city : ''}`)
    }

    return  <Paper sx={{
        bgcolor: 'primary.main',
        borderRadius: '24px'
    }}>
        <Box className={"kpi-container"} sx={{textAlign: "center"}}>
            <Box sx={{maxWidth: '800px', marginLeft: "auto", marginRight: "auto"}}>
                <Typography variant={"subtitle1"} color={"#FFFFFF"}>Zuugle</Typography>
                    <Typography variant={"h3"} sx={{marginTop: "20px"}}>
                        {t('start.ziel_von_zuugle')} 
                    </Typography>
                <Box sx={{textAlign: "center", marginTop: "20px"}}>
                        <Typography variant={"text"} color={"#FFFFFF"}> {t('start.weil_es_braucht_kein_auto')} </Typography>
                </Box>
                    <Button variant={"contained"} onClick={goto} className={"button-tour-planen"} sx={{marginTop: "20px", color: "main.primary"}} color={"white"}>
                        {t('start.jetzt_oeffitour_suchen')}
                    </Button>
            </Box>

            <Box sx={{height: '1px', backgroundColor: '#6AA6FF', marginTop: '50px'}}>

            </Box>

            <Box sx={{marginTop: '50px'}}>
                <Grid container>
                    <Grid item xs={6} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{Number(totalTours).toLocaleString()}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>
                            {t('start.öffi_bergtouren')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{totalProvider}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>
                                {t('start.durchsuchte_portale')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{totalRanges}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>
                            {t('start.wanderregionen')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{totalCities}</Typography>
                                <Typography variant={"text"} color={"#FFFFFF"}>
                                {t('start.verfügbare_heimatbahnhöfe')}
                                </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{Number(totalConnections).toLocaleString()}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>
                            {t('start.anzahl_öffi_verbindungen')}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    </Paper>
}
