import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { langChange } from "../../utils/language_Utils";

const lngs = {
	en: { nativeName: "English" },
	fr: { nativeName: "Français" },
	de: { nativeName: "Deutsch" },
	it: { nativeName: "Italiano" },
	sl: { nativeName: "Slovenščina" },
};

export default function LanguageDropdown() {
	const { i18n } = useTranslation();

	const i18LangFormatted = i18n.services.languageUtils.formatLanguageCode(
		i18n.language
	);

	const handleChange = (e) => {
		const selectedLanguage = e.target.value;
		console.log("evalue", e.target.value);
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
