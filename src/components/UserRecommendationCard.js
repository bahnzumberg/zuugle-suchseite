import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function UserRecommendationCard({text, name, image}){

    return  <Card className="tour-card" sx={{border: "1px solid #ECECEC", borderRadius: "24px", boxShadow: "none", height: "100%"}}>
        <CardContent sx={{paddingBottom: "12px !important"}}>
            <Grid container>
                <Grid item xs={2}>
                    <img src={image} style={{borderRadius: "50%"}} width={"50px"} height={"50px"}/>
                </Grid>
                <Grid item xs={10} sx={{textAlign: "left", paddingLeft: "10px", alignSelf: "center"}}>
                    <Typography variant={"text"} color={"#101010"}>{name}</Typography><br/>
                </Grid>
            </Grid>
            <Typography  sx={{color: "#101010", fontSize: "16px", textAlign: "left", whiteSpace: "break-spaces", marginTop: "20px"}}>“{text}”</Typography>

        </CardContent>
    </Card>
}
