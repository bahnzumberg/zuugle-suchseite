import * as React from 'react';
import Box from "@mui/material/Box";
import Header from "./Header";
import {Typography} from "@mui/material";

function About({}){

    return <Box className={"about-container"}>
        <Header title={"Was ist Zuugle?"}/>

        <Box className={'start-body-container'} style={{maxWidth: "1000px", marginLeft: "auto", marginRight: "auto"}}>
            <Box style={{textAlign: "left"}}>
                <Typography variant={"h5"} sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "16px"}}>Was ist <i>Zuugle</i>?</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}><i>Zuugle</i> ist eine Suchmaschine für öffentlich erreichbare Bergtouren.</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}><i>Zuugle</i> bietet die einzigartige Möglichkeit, Bergtouren zu suchen und dabei die Anreise mit Öffis direkt mit zu berücksichtigen. <i>Zuugle</i> sucht – nach vordefinierten Kriterien – verfügbare Bergtouren im Internet und filtert auf die, die öffentlich erreichbar sind. Da die meisten Touren nicht direkt bei einer Haltestelle beginnen und enden, stellt Zuugle auch diese Fußwege als Zu- und Rückstieg dar.</Typography>
                
                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}><i>Zuugle</i> startet mit einem ersten, reduzierten Umfang. Dieser wird nach und nach auf den gesamten deutschsprachigen Alpenraum in Österreich, Deutschland, Schweiz und Italien erweitert.</Typography>
                
                <Typography variant={"h5"} sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>Wie und wofür kann ich <i>Zuugle</i> nutzen?</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>Bei der Entwicklung von <i>Zuugle</i> haben wir besonderen Wert auf eine einfache Nutzung und übersichtliche Darstellung gelegt, damit du mit wenigen Klicks die für dich passenden Wanderungen findest.</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>Da <i>Zuugle</i> eine Suchmaschine ist, findest du auf der Startseite natürlich auch eine Suchleiste. Diese ist bei uns zweigeteilt: Im linken Teil kannst du den Ort angeben, von dem aus du anreisen möchtest. Im rechten, optionalen Teil der Suchleiste kannst du gezielt nach Gebirgsgruppen, Sportart oder nach bestimmten Suchwörtern (zB “Gastein” oder “Wachau”) suchen. Lasse dir nun die Ergebnisse für deine Suche anzeigen.</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>Auf der Ergebnisseite kannst du deine Suche durch verschiedene Filter weiter verfeinern, z.B. hinsichtlich Anreisedauer, Schwierigkeitsgrad, Höhenmetern und einigem mehr. Somit findest du die Tour, die zu deinen aktuellen Wünschen passt.</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>Klicke nun auf deine Wunschtour. Auf deinem Bildschirm erscheint ein Tourensteckbrief, welchen du auch als PDF herunterladen kannst. Für die <i>Zuugle</i> Fahrplanvorschläge für die nächsten 7 Tage klicke auf den Reiter “An & Abreise”. <i>Zuugle</i> wählt die optimale Hinfahrt und zeigt dir mehrer Rückfahrmöglichkeiten an.</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}>Bitte beachte, dass kurzfristige Zugausfälle oder Fahrplanänderungen eventuell nicht von unseren Fahrplan Vorschlägen berücksichtigt werden können. Deshalb prüfe deine Verbindung vor Fahrtantritt über die jeweiligen Betreiber (bahn.de, oebb.at).
Mit einem Klick auf den Button des Tourenportals öffnet sich ein neues Fenster mit der ausführlichen Tourenbeschreibung im jeweiligen Portal.</Typography>

                <Typography variant={"h5"} sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px"}}><i>Zuugle</i> User Group</Typography>

                <Typography sx={{textAlign: "left", paddingBottom: "15px", lineHeight: "22px", textDecoration: "underline"}} className={"cursor-link"}  onClick={() => window.open(`https://www.facebook.com/groups/zuugle/`)}>Link zur Facebook User Group</Typography>
            </Box>
        </Box>
    </Box>
}

export default About;