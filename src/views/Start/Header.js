import * as React from "react";
import Box from "@mui/material/Box";
import { Typography, Modal, Dialog } from "@mui/material";
import SearchContainer from "./SearchContainer";
import { useEffect, useState } from "react";
import { getDomainText, isResponsive } from "../../utils/globals";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// const LINEAR_GRADIENT = "linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.56)), ";
const LINEAR_GRADIENT =
	"linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";

// description
//Header.js is a React component that renders the header section of a web page. It receives two props, totalTours and allCities, and conditionally renders different elements based on the value of totalTours. If totalTours is 0, it displays a maintenance message. Otherwise, it displays a heading that indicates the total number of tours available in the website and a search container for cities. The component also sets a background image using the backgroundImage state variable, which changes depending on the device's responsiveness. The component makes use of other React components from the Material-UI library such as Box and Typography, and a custom SearchContainer component. It also makes use of some utility functions from the utils/globals module.
const Languages = ["Deutsch", "English", "Italiano", "Francais", "Solvenski"];

export default function Header({ totalTours, allCities }) {
	const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
	const [showDomainMenu, setShowDomainMenu] = React.useState(false);
	const [activeDomain, setActiveDomain] = React.useState(getDomainText());
	const [activeLanguage, setActiveLanguage] = React.useState("Deutsch");
	const [showMobileMenu, setShowMobileMenu] = React.useState(false);
	const [fSearchQuery, setFSearchQuery] = React.useState("");
	const [showFirstMenu, setShowFirstMenu] = React.useState(false);
	const [firstMenuOptions, setFirstMenuOptions] = React.useState([
		"GroBer Patel",
		"GroBer Priel",
		"GroBer Pythrgas",
	]);
	const [secondSearchQuery, setSecondSearchQuery] = React.useState("");
	const [showSecondMenu, setShowSecondMenu] = React.useState(false);
	const [secondMenuOptions, setSecondMenuOptions] = React.useState([
		"GroBer Patel",
		"GroBer Priel",
		"GroBer Pythrgas",
	]);
	const [backgroundImage, setBackgroundImage] = useState(
		`${LINEAR_GRADIENT} url(/app_static/img/background_start_tiny.jpeg)`
	);
	const _isMobile = isResponsive();
	const listOfDomains = [
		{
			id: 0,
			name: "Zuugle.at",
		},
		{
			id: 1,
			name: "Zuugle.de",
		},
		{
			id: 2,
			name: "Zuugle.ch",
		},
		{
			id: 3,
			name: "Zuugle.it",
		},
		{
			id: 4,
			name: "Zuugle.fr",
		},
		{
			id: 5,
			name: "Zuugle.si",
		},
	];
	const secondMenu = [
		{ id: 0, name: "Über Zuugle" },
		{ id: 1, name: "Impressum" },
		{ id: 2, name: "Datenschutz" },
	];
	const setLanguage = (item) => {
		setActiveLanguage(item);
		setShowLanguageMenu(false);
	};
	useEffect(() => {
		if (!!_isMobile) {
			setBackgroundImage(
				`${LINEAR_GRADIENT} url(/app_static/img/background_start_mobil.webp)`
			);
		} else {
			setBackgroundImage(
				`${LINEAR_GRADIENT} url(/app_static/img/background_start_small.webp)`
			);
		}
	}, [_isMobile]);

	if (totalTours == 0) {
		return (
			<Box
				className={"header-container"}
				style={{ backgroundImage: backgroundImage }}
			>
				<Box className={"header-text"}>
					<Box
						sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
					>
						<img
							src={`/app_static/img/logo-white.png`}
							height={"16px"}
							width={"29px"}
						/>
						<Typography
							style={{
								fontSize: "16px",
								color: "#FFF",
								lineHeight: "16px",
								marginLeft: "5px",
							}}
						>
							{getDomainText()}
						</Typography>
					</Box>
					<Typography variant={"h1"}>
						Zuugle befindet sich gerade im Wartungsmodus. Bitte schau später
						wieder vorbei.
					</Typography>
				</Box>
			</Box>
		);
	} else {
		return (
			<Box
				className={"header-container"}
				style={{ backgroundImage: backgroundImage }}
			>
				<Box comoponent={"div"} className="rowing countryDiv">
					<Box comoponent={"div"} className="colLeft">
						<div
							className="countrySwitch rowing"
							onClick={() => setShowDomainMenu(true)}
						>
							<img
								src={`/app_static/img/logo-white.png`}
								height={"19px"}
								width={"34px"}
							/>
							<Typography
								style={{
									fontSize: "15.4px",
									color: "#FFF",
									lineHeight: "21px",
									// marginLeft: "5px",
								}}
							>
								{getDomainText()}
							</Typography>
							<KeyboardArrowDownIcon sx={{ width: "25px", color: "#ffff" }} />
						</div>
						{showDomainMenu && (
							<div className="domainMenu colCenteral">
								{listOfDomains.map((item) =>
									// getDomainText() === item.name
									item.name === getDomainText() ? (
										<div
											className="rowing"
											key={item.id}
											style={{ paddingTop: 12, paddingBottom: 12 }}
											onClick={() => setShowDomainMenu(false)}
										>
											<img
												src={`/app_static/img/logo30.png`}
												height={"19px"}
												width={"34px"}
											/>
											<span className="domainItem">{item.name}</span>
											<span
												className="closeIcon"
												// onClick={() => setShowDomainMenu(false)}
											>
												<KeyboardArrowUpIcon
													sx={{ color: "#8B8B8B", width: 20, height: 20 }}
												/>
											</span>
										</div>
									) : (
										<span
											className="domainItem"
											key={item.id}
											style={{ paddingTop: 12, paddingBottom: 12 }}
											onClick={() => setShowDomainMenu(false)}
										>
											{item.name}
										</span>
									)
								)}
								<span className="horizontalBar" />
								{secondMenu.map((item) => (
									<span
										className="domainItem"
										style={{
											paddingTop: item.id === 0 ? 0 : 12,
											paddingBottom: 12,
										}}
									>
										{item.name}
									</span>
								))}
							</div>
						)}
					</Box>
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
									item === activeLanguage ? (
										<div
											className="rowing"
											key={item}
											style={{ width: 140, marginBottom: 5 }}
										>
											<span
												className="languageItem"
												onClick={() => setLanguage(item)}
											>
												{item}
											</span>
											<span
												className="closeIcon"
												onClick={() => setShowLanguageMenu(false)}
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
											{item}
										</span>
									)
								)}
							</div>
						</div>
					)}
				</Box>
				<Box className={"header-text"}>
					{/* <Box
						sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
					>
						<img
							src={`/app_static/img/logo-white.png`}
							height={"16px"}
							width={"29px"}
						/>
						<Typography
							style={{
								fontSize: "16px",
								color: "#FFF",
								lineHeight: "16px",
								marginLeft: "5px",
							}}
						>
							{getDomainText()}
						</Typography>
					</Box> */}

					<Typography variant={"h1"}>
						{totalTours.toLocaleString()} Bergtouren im deutschsprachigen
						Alpenraum – erreichbar mit Bahn & Bus
					</Typography>
				</Box>
				{!!allCities && allCities.length > 0 && (
					<SearchContainer goto={"/suche"} />
				)}
			</Box>
		);
	}
}
