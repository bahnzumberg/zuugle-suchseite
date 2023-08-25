import * as React from "react";
import Box from "@mui/material/Box";
// import Search from "../../components/Search/Search";
import Search from "../../components/Search/Search";

export default function SearchContainer({
	goto,
	pageKey,
	showMobileMenu,
	setShowMobileMenu,
}) {
	// console.log("SearchContainer / goto : ", goto);
	
	return (
		<Box>
			<Search
				pageKey={pageKey}
				isMain={false}
				page="start"
				goto={goto}
				showMobileMenu={showMobileMenu}
				setShowMobileMenu={setShowMobileMenu}
			/>
		</Box>
	);
}
