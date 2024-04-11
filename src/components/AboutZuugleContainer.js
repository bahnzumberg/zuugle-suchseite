import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTranslation} from 'react-i18next';

export default function RegionCard({}){

    const{t, i18n} = useTranslation();

    return  <Paper sx={{
        background: '#000000',
        borderRadius: '24px'
    }}>
        <Box sx={{padding: '20px'}}>
           <Grid container className={'about-zuugle-grid'}>
               <Grid item sm={6}>
                    <img src={`app_static/img/start_placeholder.webp`} style={{borderRadius: '24px'}} className={"image"} loading="lazy" alt='image_about_section'/>
               </Grid>
               <Grid item sm={6}>
                   <Box sx={{textAlign: 'left'}}>
                        <Typography variant={"link"}>{t('start.ueber_zuugle')}</Typography>
                   </Box>
                    <Typography variant={"h3"} sx={{textAlign: 'left', marginTop: '10px'}}>
                        {t('start.entdecke_bergtouren')}                            
                    </Typography>

                   <ul className={"about-bullets"}>
                       <li>
                            <Typography variant={"text"}>{t('start.oeffentliche_erreichbarkeit')}</Typography><br/>
                       </li>
                       <li>
                            <Typography variant={"text"}>{t('start.hin_und_rueckreise')} </Typography><br/>
                       </li>
                       <li>
                            <Typography  variant={"text"}>
                                {t('start.anerkannte_hochwertige_touren')}                                
                            </Typography><br/>
                       </li>
                       <li>
                            <Typography variant={"text"}>
                                {t('start.ein_und_mehrtagestouren')}                                
                            </Typography><br/>
                       </li>
                   </ul>
                   <Box sx={{textAlign: 'left', marginTop: '20px'}}>
                        <Button variant={"contained"} className={"button-more"} onClick={() => window.open(`${window.location.protocol}//${window.location.host}/about`)}> 
                            {t('start.mehr_erfahren')} 
                        </Button>
                   </Box>
               </Grid>
           </Grid>
        </Box>
    </Paper>
}
