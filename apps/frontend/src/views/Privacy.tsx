import { useEffect } from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import { useTranslation } from "react-i18next";

import { usePageHeader } from "../utils/seoPageHelper";
import PrivacyContent from "../components/LegalDialog/PrivacyContent";

/**
 * The `/privacy` page. The body is shared with the privacy dialog in
 * {@link PrivacyContent}; this view only adds the page chrome.
 */
function Privacy() {
  //translation related
  const { t } = useTranslation();

  usePageHeader({ header: t("privacy.datenschutzerklaerung") });

  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Datenschutzerklärung" });
  }, []);

  return (
    <Box className={"about-container"}>
      <Header
        title={t("privacy.datenschutzerklaerung")}
        subTitle={t("privacy.stand")}
        backgroundColor="var(--bzb-wolkenblau)"
      />

      <Box className={"start-body-container static-container"}>
        <PrivacyContent />
      </Box>
    </Box>
  );
}

export default Privacy;
