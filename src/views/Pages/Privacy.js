import * as React from 'react';
import Box from "@mui/material/Box";
import Header from "./Header";
import {Typography} from "@mui/material";

function Privacy({}){

    return <Box className={"about-container"}>
        <Header title={"Datenschutzerklärung"} subTitle={"aktualisiert: April 2022"}/>

        <Box className={'start-body-container static-container'}>
            <Box style={{textAlign: "left"}}>
                <Typography>Datenschutz ist uns wichtig. Daher haben wir auf viele Möglichkeiten verzichtet, die technisch zwar möglich sind, jedoch in die Privatsphäre unserer Besucher eindringen würden.</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Welche personenbezogenen Daten wir sammeln und warum wir sie sammeln</Typography>
                <Typography>Wir sammeln keine personenbezogenen Daten.</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Analysedienst</Typography>
                <Typography variant={"h5"} sx={{marginTop: "10px", fontSize: "13px"}}>Welcher Dienst wird eingesetzt</Typography>
                <Typography>Wir setzen die Open Source Software <a href={"https://matomo.org/"} target={"_blank"}>Matomo</a> in der selbst-gehosteten Variante ein. Die Daten befinden sich daher auf einem Server in Deutschland in der EU.</Typography>
                <Typography variant={"h5"} sx={{marginTop: "10px", fontSize: "13px"}}>Welche Daten werden gesammelt</Typography>
                <Typography>Abgespeichert werden der Name der aufgerufenen Webseite, die Uhrzeit und die ersten zwei Stellen der IP-Adresse. Ein Rückschluss auf eine Person ist durch diese Daten nicht möglich.</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Cookies</Typography>
                <Typography>Auf Zuugle wird ein Cookies gesetzt, damit der Besucher den Ausgangsorts nicht jedes Mal neu eingeben muss.</Typography>
                <Typography>Durch die Nutzung der Seite wird die Zustimmung zur Verwendung von Cookies gegeben, da die Funktion aus technischen Gründen nur mittels Einsatz eines Cookies zur Verfügung gestellt werden kann.</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Mit wem wir deine Daten teilen</Typography>
                <Typography>Mit niemandem.</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Wie lange wir deine Daten speichern</Typography>
                <Typography>Nach 3 Monaten verfällt das Cookie auf deinem Computer.</Typography>


                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Welche Rechte du an deinen Daten hast</Typography>
                <Typography>Da wir von dir nichts abspeichern, können wir für dich auch nichts exportieren oder löschen.</Typography>

            </Box>
        </Box>
    </Box>
}

export default Privacy;