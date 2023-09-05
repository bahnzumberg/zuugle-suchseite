import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { langChange } from "../../utils/language_Utils";
import { Modal } from "@mui/material";
import { useTranslation } from "react-i18next";

var resolvedLanguage = await import('../../translations/i18n').then((module) => module.default.language);
const storedLanguage = localStorage.getItem("lang");
let currLanguage = storedLanguage || resolvedLanguage;

if (currLanguage=="en") {
	const Languages = [
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "it", nativeName: "Italiano" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="de") {
	const Languages = [
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "it", nativeName: "Italiano" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="fr") {
	const Languages = [
		{ key: "fr", nativeName: "Français" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "it", nativeName: "Italiano" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="it") {
	const Languages = [
		{ key: "it", nativeName: "Italiano" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "sl", nativeName: "Slovenščina" },
	];
}
else if (currLanguage=="sl") {
	const Languages = [
		{ key: "sl", nativeName: "Slovenščina" },
		{ key: "de", nativeName: "Deutsch" },
		{ key: "en", nativeName: "English" },
		{ key: "fr", nativeName: "Français" },
		{ key: "it", nativeName: "Italiano" },
	];
}

function LanguageMenu() {
	const { i18n } = useTranslation();
	const i18LangFormatted = i18n.services.languageUtils.formatLanguageCode(
		i18n.language
	);
	const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
	const setLanguage = (lng) => {
		// console.log("lang inside setLanguage :", lng);
		localStorage.setItem("lang", lng);
		langChange(lng);
		setShowLanguageMenu(false);
	};
	// let selectedValue = '';
	// Languages.forEach((item) =>{
	// if(item.key == i18LangFormatted){
	// selectedValue = item.key;
	// return
	// }
	// }
	// );

	return (
		<div>
			<span
				className="languageIcon centerMe"
				onClick={() => {
					setShowLanguageMenu(!showLanguageMenu);
				}}
			>
				<img
					src={`/app_static/img/langIcon.png`}
					height={"23px"}
					width={"23px"}
				/>
			</span>
			{showLanguageMenu && (
				<Modal
					open={showLanguageMenu}
					onClose={() => setShowLanguageMenu(false)}
				>
					<div
						className="languageMenu"
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
						}}
					>
						<div
							className="rowing"
							style={{ width: "100%", marginBottom: -15 }}
						>
							<div />{" "}
							<span
								className="closeIcon pointy"
								onClick={() => setShowLanguageMenu(false)}
								style={{ marginRight: 5 }}
							>
								<CloseIcon
									sx={{
										color: "#8B8B8B",
										width: 18,
										height: 18,
									}}
								/>
							</span>
						</div>
						<div className="languageOptions">
							{Languages.map((item) => (
								<span
									className="languageItem"
									onClick={() => setLanguage(item.key)}
									key={item.key}
									style={{
										width: 140,
										marginBottom: 5,
										color: i18LangFormatted == item.key && "#4992FF",
									}}
								>
									{item.nativeName}
								</span>
							))}
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
}
export default LanguageMenu;
