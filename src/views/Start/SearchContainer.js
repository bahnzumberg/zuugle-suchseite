import * as React from "react";
import Box from "@mui/material/Box";
import Search from "../../components/Search/Search";

export default function SearchContainer({
	goto,
	showMobileMenu,
	setShowMobileMenu,
}) {
	return (
		<Box>
			<Search
				goto={goto}
				showMobileMenu={showMobileMenu}
				setShowMobileMenu={setShowMobileMenu}
			/>
		</Box>
	);
}
