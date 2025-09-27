import { useEffect } from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Privacy({}) {
  //translation related
  const { t } = useTranslation();
  const matomo_link = (
    <a href={"https://matomo.org/"} target={"_blank"}>
      Matomo
    </a>
  );

  useEffect(() => {
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Datenschutzerklärung" });
  }, []);

  return (
    <Box className={"about-container"}>
      <Header
        title={t("privacy.datenschutzerklaerung")}
        subTitle={"aktualisiert: April 2022"}
      />

      <Box className={"start-body-container static-container"}>
        <Box style={{ textAlign: "left" }}>
          <Typography>{t("privacy.datenschutz_ist_uns_wichtig")}</Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("privacy.welche_personenbezogenen_daten")}
          </Typography>
          <Typography>{t("privacy.keine_personenbezogenen_daten")}</Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("privacy.analysedienst")}
          </Typography>
          <Typography
            variant={"h5"}
            sx={{ marginTop: "10px", fontSize: "13px" }}
          >
            {t("privacy.welcher_dienst")}
          </Typography>
          <Typography>
            {t("privacy.matomo_1")} {matomo_link} {t("privacy.matomo_2")}{" "}
          </Typography>
          <Typography
            variant={"h5"}
            sx={{ marginTop: "10px", fontSize: "13px" }}
          >
            {t("privacy.welche_daten")}
          </Typography>
          <Typography>{t("privacy.abgespeichert_werden")}</Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            Cookies
          </Typography>
          <Typography> {t("privacy.cookies_erklaerung1")}</Typography>
          <Typography> {t("privacy.cookies_erklaerung2")}</Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {" "}
            {t("privacy.mit_wem_daten_teilen")}{" "}
          </Typography>
          <Typography>{t("privacy.mit_niemandem")}</Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {" "}
            {t("privacy.wie_lange_daten_speichern")}
          </Typography>
          <Typography>{t("privacy.cookie_verfall_drei_monate")}</Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("privacy.welche_rechte")}
          </Typography>
          <Typography>{t("privacy.nichts_von_dir_abspeichern")}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Privacy;
