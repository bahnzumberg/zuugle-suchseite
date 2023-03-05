import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

//description
//UserRecommendationCard.js is a React component that renders a card containing user recommendations for the application Zuugle. The component imports various components from the Material-UI library such as Typography, Grid, Card, and CardContent. The component takes three props, text, name, and image, and uses them to display a user's recommendation for the application.
// The Card component renders a card with a border, border-radius, and height. The CardContent component renders the content of the card. Within CardContent, the Grid component is used to create a grid with two columns. The first column displays the user's image, and the second column displays the user's name. Finally, the Typography component is used to display the user's recommendation text.
// The UserRecommendationCard function returns the JSX code necessary to render the card with the user's recommendation.
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
