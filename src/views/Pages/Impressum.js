import * as React from 'react';
import Box from "@mui/material/Box";
import Header from "./Header";
import {Typography} from "@mui/material";
import { spacing } from '@mui/system';


function Impressum({}){

    return <Box className={"about-container"}>
        <Header title={"Impressum"}/>

        <Box className={'start-body-container static-container'}>
            <Box style={{textAlign: "left"}}>
                <Typography variant={"h5"}>Für den Inhalt verantwortlich</Typography>
                <Typography>Bahn zum Berg – Verein zur Förderung der nachhaltigen Mobilität bei der Anreise zu Outdoor-Aktivitäten</Typography>
                <Typography> Wipplingerstraße 18/9 </Typography>
                <Typography>A-1010 Wien</Typography>
                <Typography sx={{marginTop: "10px"}} >ZVR: 1112324997</Typography>
                <Typography>Zuständige Behörde: Bundespolizeidirektion Wien, A-1010 Wien, Schottenring 7-9</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Spendenkonto</Typography>

                <Typography>Bahn zum Berg</Typography>
                <Typography>IBAN: AT02 2011 1842 7816 9701</Typography>
                <Typography>BIC: GIBAATWWXXX</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Kontakt</Typography>

                <Typography><a href={"https://www.bahn-zum-berg.at/kontakt-mail.php"}>kontakt [at] bahn-zum-berg.at</a></Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Vereinsvorstand</Typography>

                <Typography> Martin Heppner (Obmann)</Typography>
                <Typography>Veronika Schöll (Kassierin)</Typography>
                <Typography>Nikolaus Vogl (Schriftführer)</Typography>
                <Typography>Dietmar Trummer (Technik)</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Ziel und Ausrichtung</Typography>
                <Typography>„Bahn zum Berg“ ist eine non-profit Organisation, die die Anreise mit öffentlichen Verkehrsmitteln zu Outdooraktivitäten fördert. Das tun wir, indem wir die Plattformen <a href={"https://www.bahn-zum-berg.at"} target={"_blank"}>www.bahn-zum-berg.at</a> und <a href={"https://www.zuugle.at"} target={"_blank"}>www.zuugle.at</a> betreiben.</Typography>

                <Typography sx={{marginTop: "10px"}}>Für mehr Details besuche bitte unsere Vereinsseite <a href={"https://www.bahnzumberg.at"} target={"_blank"}>www.bahnzumberg.at</a></Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Haftung für Inhalte</Typography>
                <Typography>Die Beschreibungen und Fotos der einzelnen Bergtouren stammen von den jeweils verlinkten Tourenportalen. Alle Angaben erfolgen ohne Gewähr und „Bahn zum Berg“ übernimmt keine Haftung für deren Richtigkeit. Die Nutzung sämtlicher Inhalte auf diesem Portal erfolgt somit auf eigene Gefahr und Verantwortung.</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Haftung für Links</Typography>
                <Typography>Diese Suchmaschine für Öffi-Touren enthält Verknüpfungen zu Websites Dritter („externe Links“). Diese Websites unterliegen der Haftung der jeweiligen Betreiber. Bei der erstmaligen Anlage der externen Links auf die fremden Inhalte haben wir geprüft, ob etwaige Rechtsverstöße bestehen. Zu dem betreffenden Zeitpunkt waren keine Rechtsverstöße ersichtlich. Wir haben aber keinerlei Einfluss auf die aktuelle und zukünftige Gestaltung und auf die Inhalte der verknüpften Seiten. Das Setzen von externen Links bedeutet nicht, dass wir uns die hinter dem Link liegenden Inhalte zu Eigen machen. Eine ständige Kontrolle der externen Links ist für uns ohne konkrete Hinweise auf Rechtsverstöße wegen der großen Anzahl nicht zumutbar. Bei Kenntnis von Rechtsverstößen werden wir jedoch derartige externe Links unverzüglich löschen.</Typography>

                <Typography variant={"h5"} sx={{marginTop: "20px"}}>Lizenzbedingungen Fahrplandaten</Typography>
                <Typography>Die unterschiedlichen Quellen und Lizenzbedingungen der eingesetzten Fahrplandaten sind <a href={"https://www.bahn-zum-berg.at/rechtshinweise-fahrplandaten/"} target={"_blank"}>hier</a> angeführt.</Typography>
                <Typography> </Typography>
            </Box>
        </Box>
    </Box>
}

export default Impressum;