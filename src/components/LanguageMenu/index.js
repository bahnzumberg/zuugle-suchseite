import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { langChange } from "../../utils/language_Utils";
const Languages = [
	{ key: "en", nativeName: "English" },

	{ key: "fr", nativeName: "Français" },
	{ key: "de", nativeName: "Deutsch" },
	{ key: "it", nativeName: "Italiano" },
	{ key: "sl", nativeName: "Slovenščina" },
];
function LanguageMenu() {
	const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
	const [activeLanguage, setActiveLanguage] = React.useState("Deutsch");

	const setLanguage = (item) => {
		localStorage.setItem("lang", item.key);
		langChange(item.key);
		setActiveLanguage(item.nativeName);
		setShowLanguageMenu(false);
	};
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
				<div className="languageMenu">
					<div className="languageOptions">
						{Languages.map((item) =>
							item.nativeName === activeLanguage ? (
								<div
									className="rowing"
									key={item}
									style={{ width: 140, marginBottom: 5 }}
								>
									<span
										className="languageItem"
										onClick={() => setLanguage(item)}
									>
										{item.nativeName}
									</span>
									<span
										className="closeIcon"
										// style={{ marginRight: 10 }}
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
							) : (
								<span
									className="languageItem"
									onClick={() => setLanguage(item)}
									key={item}
									style={{ marginBottom: 5 }}
								>
									{item.nativeName}
								</span>
							)
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default LanguageMenu;
