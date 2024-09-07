import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { lazy, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getTotalCityTours } from "../../actions/crudActions";
import { getDomainText } from "../../utils/globals";
import BackgroundImageLoader from "./BackgroundImageLoader";
import "/src/config.js";

const DomainMenu = lazy(() => import("../../components/DomainMenu"));
const LanguageMenu = lazy(() => import("../../components/LanguageMenu"));
const SearchContainer = lazy(() => import("./SearchContainer"));

export default function Header({
	totalTours,
	allCities = [],
	showMobileMenu,
	setShowMobileMenu,
}) {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const city = searchParams.get("city");

	const [capCity, setCapCity] = useState(city);
	const [totalToursFromCity, setTotalToursFromCity] = useState(0);

	const domain = window.location.hostname;
	const tld =
		domain === "localhost" ? "at" : domain.split(".").slice(-2).join(".");

	const updateCapCity = useCallback((newCity) => {
		setCapCity(newCity);
	}, []);

	const getCity = useCallback(() => {
		return searchParams.get("city") || localStorage.getItem("city") || null;
	}, [searchParams]);

	useEffect(() => {
		const _city = getCity();
		if (_city) {
			getTotalCityTours(_city).then((data) =>
				setTotalToursFromCity(data.tours_city)
			);

			const cityObj = allCities.find((e) => e.value === _city);
			if (cityObj) {
				updateCapCity(cityObj.label);
				searchParams.set("city", _city);
			}
		}
	}, [getCity, allCities, searchParams, updateCapCity]);

	if (totalTours === 0) {
		return (
			<BackgroundImageLoader className="header-container" tld={tld}>
				<Box className="header-text">
					<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
						<img
							src="/app_static/img/logo-white.png"
							height="16px"
							width="29px"
							alt="Zuugle"
							loading="eager"
						/>
						<Typography
							sx={{ fontSize: "16px", color: "#FFF", ml: 1 }}
						>
							{getDomainText()}
						</Typography>
					</Box>
					<Typography variant="h1">
						{t("start.wartungsmodus")}
					</Typography>
				</Box>
			</BackgroundImageLoader>
		);
	}

	return (
		<BackgroundImageLoader
			className="header-container"
			sx={{ position: "relative" }}
			tld={tld}
		>
			<Box className="rowing blueDiv">
				<DomainMenu />
				<LanguageMenu />
			</Box>
			<Box className="header-text">
				{totalTours > 0 && (
					<Typography variant="h1" sx={{ height: "162px" }}>
						{totalTours.toLocaleString()}{" "}
						{t(
							totalToursFromCity === 0
								? "start.tourenanzahl_untertitel"
								: "start.tourenanzahl_untertitel_city",
							{ capCity }
						)}
					</Typography>
				)}
			</Box>
			{allCities.length > 0 && (
				<Box
					sx={{
						bgcolor: "#FFF",
						position: "absolute",
						bottom: 0,
						transform: "translate(-50%, 50%)",
						display: "inline-flex",
						borderRadius: "20px",
						p: "12px 15px",
						border: "2px solid #ddd",
						width: "100%",
						maxWidth: { xs: "325px", md: "600px" },
						boxSizing: "border-box",
						boxShadow: "rgba(100, 100, 111, 0.3) 0px 3px 20px 0px",
					}}
				>
					<Box sx={{ width: "100%" }}>
						<SearchContainer
							pageKey="start"
							page="start"
							goto="/search"
							showMobileMenu={showMobileMenu}
							setShowMobileMenu={setShowMobileMenu}
							updateCapCity={updateCapCity}
						/>
					</Box>
				</Box>
			)}
		</BackgroundImageLoader>
	);
}
