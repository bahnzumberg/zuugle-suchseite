import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function RegionCard({}){

    return  <Paper sx={{
        background: '#000000',
        borderRadius: '24px'
    }}>
        <Box sx={{padding: '20px'}}>
           <Grid container className={'about-zuugle-grid'}>
               <Grid item sm={6}>
                    <img src={`app_static/img/start_placeholder.webp`} style={{borderRadius: '24px'}} className={"image"} loading="lazy"/>
               </Grid>
               <Grid item sm={6}>
                   <Box sx={{textAlign: 'left'}}>
                       <Typography variant={"link"}>Über Zuugle</Typography>
                   </Box>

                    <Typography variant={"h3"} sx={{textAlign: 'left', marginTop: '10px'}}>Entdecke vielseitige Bergtouren im deutschsprachigen Alpenraum per Zug & Bus</Typography>

                   <ul className={"about-bullets"}>
                       <li>
                           <Typography variant={"text"}>Öffentliche Erreichbarkeit garantiert</Typography><br/>
                       </li>
                       <li>
                           <Typography variant={"text"}>Hin- & Rückreise </Typography><br/>
                       </li>
                       <li>
                           <Typography variant={"text"}>Anerkannte qualitativ hochwertige Touren</Typography><br/>
                       </li>
                       <li>
                           <Typography variant={"text"}>Eintages & Mehrtagestouren</Typography><br/>
                       </li>
                   </ul>
                   <Box sx={{textAlign: 'left', marginTop: '20px'}}>
                       <Button variant={"contained"} className={"button-more"} onClick={() => window.open(`${window.location.protocol}//${window.location.host}/about`)}>Mehr erfahren</Button>
                   </Box>
               </Grid>
           </Grid>
        </Box>
    </Paper>
}
