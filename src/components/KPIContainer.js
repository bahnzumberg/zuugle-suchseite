import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import { useTranslation } from 'react-i18next';

//description
//The KPIContainer.js file is a JavaScript module that exports a functional React component, which displays key performance indicators (KPIs) related to a web application called "Zuugle." The component imports several dependencies from the Material-UI library, including Typography, Paper, Box, Grid, and Button. It also imports useNavigate from the react-router library, which is used to handle navigation to a different route when the "Jetzt Öffi-Tour suchen" button is clicked.
// The KPIContainer component takes in several props, including totalTours, totalConnections, totalRanges, totalCities, city, and totalProvider, which are used to display various statistics related to the web application. The goto function is called when the user clicks the "Jetzt Öffi-Tour suchen" button, and it uses the navigate function from react-router to navigate to a new route with the sort and city query parameters.
// The component returns a Paper component with a blue background and rounded corners, containing a series of Box components with various KPIs related to the Zuugle application. The KPIs include the total number of Öffi-Bergtouren (public transportation-enabled mountain tours), the number of Tourenportale (tour portals) searched, the number of Wanderregionen (hiking regions), the number of verfügbare Heimatbahnhöfe (available home train stations), and the total number of Öffi-Verbindungen (public transportation connections). The component also includes a brief description of the Zuugle application and a button to search for Öffi tours.
export default function KPIContainer({totalTours, totalConnections, totalRanges, totalCities, city, totalProvider}){

    const {t, i18n} = useTranslation();

    const navigate = useNavigate();
    const goto = () => {
        navigate(`/suche?sort=relevanz&${!!city ? '&city='+city : ''}`)
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
