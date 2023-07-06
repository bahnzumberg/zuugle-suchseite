import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { langChange } from "../../utils/language_Utils";
import { Modal } from "@mui/material";
import { useTranslation } from "react-i18next";

const Languages = [
	{ key: "en", nativeName: "English" },

	{ key: "fr", nativeName: "Français" },
	{ key: "de", nativeName: "Deutsch" },
	{ key: "it", nativeName: "Italiano" },
	{ key: "sl", nativeName: "Slovenščina" },
];
function LanguageMenu() {
	const { i18n } = useTranslation();

	const i18LangFormatted = i18n.services.languageUtils.formatLanguageCode(
		i18n.language
	);
	const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);

	const setLanguage = (item) => {
		localStorage.setItem("lang", item.key);
		// console.log("itemkey", item.key);
		langChange(item.key);
		setShowLanguageMenu(false);
	};
	const selectedValue = Languages.map((item) =>
		item.key.includes(i18LangFormatted)
	)
		? i18LangFormatted
		: "de";

	React.useEffect(() => {
		// console.log("selected value" + selectedValue + "----" + i18LangFormatted);
	}, [selectedValue]);
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
							{Languages.map((item) =>
								item.key === selectedValue ? (
									<div
										className="rowing"
										key={item}
										style={{ width: 140, marginBottom: 5 }}
									>
										<span
											className="languageItem"
											onClick={() => setLanguage(item)}
											style={{ color: "#4992FF" }}
										>
											{item.nativeName}
										</span>
										<span />
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
				</Modal>
			)}
		</div>
	);
}

export default LanguageMenu;
