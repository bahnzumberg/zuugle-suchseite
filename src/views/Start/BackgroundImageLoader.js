import { Box } from "@mui/material";
import React from "react";
import { isMobileDevice } from "../../utils/globals";

const LINEAR_GRADIENT =
	"linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45)), ";

const BackgroundImageLoader = ({ tld, sx, children }) => {
	// const _isMobile = useResponsive();

	// const backgroundImage = _isMobile
	const backgroundImage = isMobileDevice()
		? `${LINEAR_GRADIENT} url(/app_static/img/background_start_mobil_${tld}.webp)`
		: `${LINEAR_GRADIENT} url(/app_static/img/background_start_small_${tld}.webp)`;

	return (
		<Box
			className={"header-container"}
			sx={{
				backgroundImage: backgroundImage,
				backgroundSize: "cover",
				backgroundPosition: "center",
				...sx,
			}}
		>
			{children}
		</Box>
	);
};

export default BackgroundImageLoader;
