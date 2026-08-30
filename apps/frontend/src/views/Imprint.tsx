import { useEffect } from "react";
import Box from "@mui/material/Box";
import Header from "./Header";

import { usePageHeader } from "../utils/seoPageHelper";
import ImprintContent from "../components/LegalDialog/ImprintContent";

/**
 * The `/imprint` page. The body is shared with the imprint dialog in
 * {@link ImprintContent}; this view only adds the page chrome.
 */
function Imprint() {
  usePageHeader({ header: "Imprint" });

  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Imprint" });
  }, []);

  return (
    <Box className={"about-container"} sx={{ paddingBottom: "80px" }}>
      <Header title={"Imprint"} backgroundColor="var(--bzb-lindgruen)" />

      <Box className={"start-body-container static-container"}>
        <ImprintContent />
      </Box>
    </Box>
  );
}

export default Imprint;
