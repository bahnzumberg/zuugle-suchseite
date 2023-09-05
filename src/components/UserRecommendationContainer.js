import * as React from 'react';
import Box from "@mui/material/Box";
import UserRecommendationCard from "./UserRecommendationCard";
import {Typography} from "@mui/material";
import { useTranslation} from 'react-i18next';


export default function UserRecommendationContainer({}){

    const{t, i18n}= useTranslation();
    

    return <Box style={{backgroundColor: "#FFF", padding: "20px", borderRadius: "32px", borderColor: "#ECECEC", borderWidth: "1px"}}>
            <Typography variant={"h4"} sx={{textAlign: "left", paddingTop: '20px', paddingBottom: "15px"}}>
                {t('start.nutzer_innen_ueber_zuugle')} 
            </Typography>

        <Box style={{width: "100%", overflowX: "scroll", whiteSpace: "nowrap", display: "flex", alignItems: "stretch"}}>
            <Box className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                <UserRecommendationCard
                    text={"Besonders im alpinen Tourenbereich ist Zuugle für mich eine große Erleichterung beim Finden von öffentlich erreichbaren Touren. Es gibt noch so viele unentdeckte Öffi-Touren, die durch Zuugle erschlossen werden"}
                    name={"Simon, Korneuburg"}
                    image={"/app_static/img/Simon.jpg"}
                />
            </Box>
            <Box className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                <UserRecommendationCard
                    text={"Eigentlich habe ich die Organisation immer meiner Wanderbegleitung überlassen, weil ich keinen Kopf dafür hatte. Seit Zuugle organisiere immer ich die Touren – und die nächsten Wochenenden habe ich auch schon verplant."}
                    name={"Dominica, Wien"}
                    image={"/app_static/img/Dominica.jpg"}
                />
            </Box>
            <Box className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                <UserRecommendationCard
                    text={"Zuugle ist das erste Tool das die Öffi-Anreise vom Kopf auf die Füße stellt. Diese steht hier von vornherein im Vordergrund und ist nicht nur eine Fußnote (Bushaltestelle in...) Ein wichtiger Beitrag zur unumgänglichen Verkehrswende auch im Alpenraum"}
                    name={"Nikolaus, Bad Endorf"}
                    image={"/app_static/img/Nikolaus.jpg"}
                />
            </Box>
            <Box className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                <UserRecommendationCard
                    text={"Endlich eine Suchmaschine in der ich mit wenigen Klicks auf derselben Plattform direkt meine Wanderroute mit der Öffi Anreise, dem Fußweg zum Tourstart und dem Nachhauseweg verknüpft habe."}
                    name={"Verena, Steyr"}
                    image={"/app_static/img/Verena.jpg"}
                />
            </Box>
            <Box className={"scrolling-card-box"} style={{display: "block", marginRight: "20px", verticalAlign: "top", marginBottom: "5px"}}>
                <UserRecommendationCard
                    text={"Ist diese Tour realistischer Weise morgen mit ÖFFIS zu machen? Wie heißt die Station, bei der wir aussteigen müssen? Und bei welcher Station steigen wir nach der Tour am besten wieder ein? All diese Fragen gehören der Vergangenheit an! Die Gegenwart und die Zukunft heißen: ZUUGLE!"}
                    name={"Karl, Salzburg"}
                    image={"/app_static/img/Karl.jpg"}
                />
            </Box>
        </Box>
    </Box>
}
