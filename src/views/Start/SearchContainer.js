import * as React from "react";
import Box from "@mui/material/Box";
import Search from "../../components/Search/Search";

export default function SearchContainer({
  goto,
  pageKey,
  showMobileMenu,
  setShowMobileMenu,
  updateCapCity,
}) {
  // console.log("SearchContainer / goto : ", goto); // '/suche'
  // console.log("SearchContainer / pageKey : ", pageKey); // 'detail'
  // console.log("SearchContainer / showMobileMenu : ", showMobileMenu); // undefined

  return (
    <Box>
      <Search
        pageKey={pageKey}
        isMain={false}
        page="start"
        goto={goto}
        showMobileMenu={showMobileMenu ?? true}
        setShowMobileMenu={setShowMobileMenu ?? true}
        updateCapCity={updateCapCity}
      />
    </Box>
  );
}
