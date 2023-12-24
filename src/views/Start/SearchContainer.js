import * as React from "react";
import Box from "@mui/material/Box";
import Search from "../../components/Search/Search";

export default function SearchContainer({
  goto,
  pageKey,
  page,
  showMobileMenu,
  setShowMobileMenu,
  updateCapCity,
}) {

  return (
    <Box>
      <Search
        pageKey={pageKey}
        isMain={false}
        page={page} 
        goto={goto}
        showMobileMenu={showMobileMenu ?? true}
        setShowMobileMenu={setShowMobileMenu ?? true}
        updateCapCity={updateCapCity}
      />
    </Box>
  );
}
