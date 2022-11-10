import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router";

export default function KPIContainer({totalTours, totalConnections, totalRanges, totalCities, city, totalProvider}){
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
                <Typography variant={"h3"} sx={{marginTop: "20px"}}>Das Ziel von Zuugle ist es, alle Bergtouren, die mit Bahn und Bus erreichbar sind, sichtbar zu machen.</Typography>
                <Box sx={{textAlign: "center", marginTop: "20px"}}>
                    <Typography variant={"text"} color={"#FFFFFF"}>Weil: Es braucht kein Auto, um in die Natur zu kommen. Wir sagen dir gerne wie.</Typography>
                </Box>

                <Button variant={"contained"} onClick={goto} className={"button-tour-planen"} sx={{marginTop: "20px", color: "main.primary"}} color={"white"}>Jetzt Öffi-Tour suchen</Button>
            </Box>

            <Box sx={{height: '1px', backgroundColor: '#6AA6FF', marginTop: '50px'}}>

            </Box>

            <Box sx={{marginTop: '50px'}}>
                <Grid container>
                    <Grid item xs={5} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{Number(totalTours).toLocaleString()}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>Öffi-Bergtouren</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{totalProvider}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>durchsuchte Tourenportale</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{totalRanges}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>Wanderregionen</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{totalCities}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>verfügbare Heimatbahnhöfe</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5} sm={2} sx={{marginBottom: "16px"}}>
                        <Box>
                            <Typography variant={"h3"}>{Number(totalConnections).toLocaleString()}</Typography>
                            <Typography variant={"text"} color={"#FFFFFF"}>Anzahl Öffi-Verbindungen</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    </Paper>
}
