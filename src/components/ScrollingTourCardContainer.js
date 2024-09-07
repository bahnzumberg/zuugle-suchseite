import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { lazy } from "react";
import { useTranslation } from "react-i18next";

const TourCard = lazy(() => import("./TourCard"));

const renderImage = (imageSrc, key) => (
	<Box
		key={key}
		style={{
			display: "block",
		}}
	>
		<img
			src={imageSrc}
			alt="Advertisment"
			className="tour_card_Image"
			loading="lazy"
		/>
	</Box>
);

const renderFourth = (t) => (
	<Box
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			maxWidth: "392px",
			justifyContent: "center",
			marginRight: "20px",
			verticalAlign: "top",
			padding: "0 10px",
			marginBottom: "5px",
		}}
	>
		<Typography
			style={{
				fontSize: "16px",
				fontWeight: "600",
				padding: "30px 10%",
				borderTop: "1px solid #000",
			}}
		>
			{t("start.mehr_abenteuer")}
		</Typography>
		<a href="/search" className="cursor-link">
			<Button
				style={{
					border: "2px solid #000",
					color: "#000",
					width: "100%",
					fontSize: "22px",
					fontWeight: "600",
				}}
			>
				{t("start.mehr_anzeigen")}
			</Button>
		</a>
	</Box>
);

export default function ScrollingTourCardContainer({
	tours,
	onSelectTour,
	city,
	isLoading,
	isMobile,
}) {
	const { t } = useTranslation();
	const firstSet = tours.slice(0, 4);
	const secondSet = tours.slice(4, 7);

	return (
		<Box
			component="div"
			style={{
				display: "grid",
				width: "screen",
				gridTemplateColumns: isMobile
					? "repeat(1, 1fr)"
					: "repeat(3, 1fr)",
				gap: "25px",
				marginLeft: !isMobile ? "64px" : null,
			}}
		>
			{isLoading ? (
				<div style={{ height: "400px", width: "100%" }}></div>
			) : (
				<>
					{firstSet.map((tour) => (
						<Card
							key={tour.id}
							tour={tour}
							onSelectTour={onSelectTour}
							city={city}
						/>
					))}
					{renderImage("/app_static/img/zuugle-ad.gif", "image1")}
					{secondSet.map((tour) => (
						<Card
							key={tour.id}
							tour={tour}
							onSelectTour={onSelectTour}
							city={city}
						/>
					))}
					{renderFourth(t)}
				</>
			)}
		</Box>
	);
}

function Card({ tour, onSelectTour, city }) {
	return (
		<Box
			className={"react-horizontal-scrolling-card"}
			tabIndex={0}
			component="div"
		>
			<TourCard onSelectTour={onSelectTour} tour={tour} city={city} />
		</Box>
	);
}
