import * as React from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import { Typography } from "@mui/material";
import { getImpressumLabels } from "../../translations/translation.labels";

function Impressum({}) {
	//Translation related
	const ImpressumLabels = getImpressumLabels();

	return (
		<Box className={"about-container"}>
			<Header title={"Impressum"} />

			<Box className={"start-body-container static-container"}>
				<Box style={{ textAlign: "left" }}>
					<Typography variant={"h5"}>
						{ImpressumLabels.verantwortlich_fuer_inhalt}
					</Typography>
					<Typography>
						Bahn zum Berg – Verein zur Förderung der nachhaltigen Mobilität bei
						der Anreise zu Outdoor-Aktivitäten
					</Typography>
					<Typography> Wipplingerstraße 18/9 </Typography>
					<Typography>A-1010 Wien</Typography>
					<Typography sx={{ marginTop: "10px" }}>ZVR: 1112324997</Typography>
					<Typography>
						Zuständige Behörde: Bundespolizeidirektion Wien, A-1010 Wien,
						Schottenring 7-9
					</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{ImpressumLabels.spendenkonto}
					</Typography>

					<Typography>Bahn zum Berg</Typography>
					<Typography>IBAN: AT02 2011 1842 7816 9701</Typography>
					<Typography>BIC: GIBAATWWXXX</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{ImpressumLabels.kontakt}{" "}
					</Typography>

					<Typography>
						<a href={"https://www.bahn-zum-berg.at/kontakt-mail.php"}>
							kontakt [at] bahn-zum-berg.at
						</a>
					</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{ImpressumLabels.vereinsvorstand}
					</Typography>

					<Typography> Martin Heppner (Obmann)</Typography>
					<Typography>Veronika Schöll (Kassierin)</Typography>
					<Typography>Nikolaus Vogl (Schriftführer)</Typography>
					<Typography>Dietmar Trummer (Technik)</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{" "}
						{ImpressumLabels.ziel_und_ausrichtung}{" "}
					</Typography>

					<Typography>
						{ImpressumLabels.non_profit_org1}
						{/* <a href={"https://www.bahn-zum-berg.at"} target={"_blank"}>www.bahn-zum-berg.at</a> 
                     {ImpressumLabels.und}
                    <a href={"https://www.zuugle.at/"} target={"_blank"}>www.zuugle.at</a> 
                    {ImpressumLabels.betreiben} */}
					</Typography>

					<Typography sx={{ marginTop: "10px" }}>
						{ImpressumLabels.non_profit_org2}
						{/* <a href={"https://www.bahnzumberg.at"} target={"_blank"}>www.bahnzumberg.at</a>  */}
					</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{ImpressumLabels.haftung_inhalte}
					</Typography>
					<Typography> {ImpressumLabels.beschreibungen_fotos} </Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{ImpressumLabels.haftung_fuer_links}
					</Typography>
					<Typography> {ImpressumLabels.verknuepfung_links} </Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{ImpressumLabels.lizenzbedingungen}
					</Typography>
					<Typography>
						{ImpressumLabels.anfuehrung_quellen}
						<a
							href={
								"https://www.bahn-zum-berg.at/rechtshinweise-fahrplandaten/"
							}
							target={"_blank"}
						>
							{" "}
							bahn-zum-berg
						</a>
						{/* <a href={"https://www.bahn-zum-berg.at/rechtshinweise-fahrplandaten/"} target={"_blank"}>
                        {ImpressumLabels.hier}
                    </a>  */}
						{/* {ImpressumLabels.angeführt} */}
					</Typography>
					<Typography> </Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default Impressum;
