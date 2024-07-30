import * as React from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Impressum({}) {
	//Translation related
	const ImpressumLabels = getImpressumLabels();
	const {t} = useTranslation();
	
	React.useEffect(() => {
		var _mtm = window._mtm = window._mtm || [];
		_mtm.push({'pagetitel': "Impressum"});
	}, []);

	return (
		<Box className={"about-container"} sx={{ paddingBottom: "80px" }}>
			<Header title={"Impressum"} />

			<Box className={"start-body-container static-container"}>
				<Box style={{ textAlign: "left" }}>
					<Typography variant={"h5"}>
						{t('impressum.verantwortlich_fuer_inhalt')}
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
						{t('impressum.spendenkonto')}
					</Typography>

					<Typography>Bahn zum Berg</Typography>
					<Typography>IBAN: AT02 2011 1842 7816 9701</Typography>
					<Typography>BIC: GIBAATWWXXX</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{t('impressum.kontakt')}{" "}
					</Typography>

					<Typography>
						<a href={"https://www.bahn-zum-berg.at/kontakt-mail.php"}>
							kontakt [at] bahn-zum-berg.at
						</a>
					</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{t('impressum.vereinsvorstand')}
					</Typography>

					<Typography> Martin Heppner (Obmann)</Typography>
					<Typography>David Kurz (Kassier)</Typography>
					<Typography>Dietmar Trummer (Schriftführer)</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{" "}
						{t('impressum.ziel_und_ausrichtung')}{" "}
					</Typography>

					<Typography>
						{t('impressum.non_profit_org1')}
					</Typography>

					<Typography sx={{ marginTop: "10px" }}>
						{t('impressum.non_profit_org2')}
					</Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{t('impressum.haftung_inhalte')}
					</Typography>
					<Typography> {t('impressum.beschreibungen_fotos')} </Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{t('impressum.haftung_fuer_links')}
					</Typography>
					<Typography> {t('impressum.verknuepfung_links')} </Typography>

					<Typography variant={"h5"} sx={{ marginTop: "20px" }}>
						{t('impressum.lizenzbedingungen')}
					</Typography>
					<Typography>
						{t('impressum.anfuehrung_quellen')}
						<a
							href={
								"https://www.bahn-zum-berg.at/rechtshinweise-fahrplandaten/"
							}
							target={"_blank"}
						>
							{" "}
							Bahn zum Berg
						</a>
					</Typography>
					<Typography> </Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default Impressum;
