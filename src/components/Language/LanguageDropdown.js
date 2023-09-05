import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { langChange } from "../../utils/language_Utils";

var resolvedLanguage = await import('./i18n').then((module) => module.default.language);
const storedLanguage = localStorage.getItem("lang");
let currLanguage = storedLanguage || resolvedLanguage;

if (currLanguage=="en") {
	const lngs = [
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "it", nativeName: "Italiano" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="de") {
	const lngs = [
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "it", nativeName: "Italiano" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="fr") {
	const lngs = [
		{ key: "fr", nativeName: "Français" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "it", nativeName: "Italiano" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="it") {
	const lngs = [
		{ key: "it", nativeName: "Italiano" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="sl") {
	const lngs = [
		{ key: "sl", nativeName: "Slovenščina" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "it", nativeName: "Italiano" },
	];
}

export default function LanguageDropdown() {
	const { i18n } = useTranslation();

	const i18LangFormatted = i18n.services.languageUtils.formatLanguageCode(
		i18n.language
	);

	const handleChange = (e) => {
		const selectedLanguage = e.target.value;
		// console.log("evalue", e.target.value);
		langChange(selectedLanguage);
		localStorage.setItem("lang", selectedLanguage);
	};
	// Check if the formatted language is a valid option, otherwise fallback to an agreed language
	const selectedValue = Object.keys(lngs).includes(i18LangFormatted)
		? i18LangFormatted
		: "de";

	return (
		<Box sx={{ minWidth: 150 }}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label" sx={{ marginTop: "10px" }}>
					Select language
				</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={selectedValue}
					label="language"
					onChange={handleChange}
					type="submit"
					style={{ backgroundColor: "white" }}
				>
					{Object.keys(lngs).map((lng) => {
						return (
							<MenuItem key={lng} value={lng}>
								{lngs[lng].nativeName}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</Box>
	);
}
