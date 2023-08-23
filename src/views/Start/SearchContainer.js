import * as React from "react";
import Box from "@mui/material/Box";
// import Search from "../../components/Search/Search";
import Search from "../../components/Search/Search";

export default function SearchContainer({
	goto,
<<<<<<< HEAD
=======
	pageKey,
>>>>>>> dev-drop-slovenia-front2
	showMobileMenu,
	setShowMobileMenu,
}) {
	// console.log("SearchContainer / goto : ", goto);
<<<<<<< HEAD
	return (
		<Box>
			<Search
				isMain={false}
=======
	
	return (
		<Box>
			<Search
				pageKey={pageKey}
				isMain={false}
				page="start"
>>>>>>> dev-drop-slovenia-front2
				goto={goto}
				showMobileMenu={showMobileMenu}
				setShowMobileMenu={setShowMobileMenu}
			/>
		</Box>
	);
}
