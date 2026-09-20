import { Trans, useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function PrivacyContent() {
  const { t } = useTranslation();
  const matomo_link = (
    <a href={"https://matomo.org/"} target={"_blank"} rel="noreferrer">
      Matomo
    </a>
  );

  return (
    <Box style={{ textAlign: "left" }}>
      <Typography>{t("privacy.datenschutz_ist_uns_wichtig")}</Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.welche_personenbezogenen_daten")}
      </Typography>
      <Typography>{t("privacy.ueberblick")}</Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.analysedienst")}
      </Typography>
      <Typography variant={"h5"} sx={{ marginTop: "10px", fontSize: "13px" }}>
        {t("privacy.welcher_dienst")}
      </Typography>
      <Typography>
        {t("privacy.matomo_1")} {matomo_link} {t("privacy.matomo_2")}{" "}
      </Typography>
      <Typography variant={"h5"} sx={{ marginTop: "10px", fontSize: "13px" }}>
        {t("privacy.welche_daten")}
      </Typography>
      <Typography>{t("privacy.abgespeichert_werden")}</Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.cookies")}
      </Typography>
      <Typography>{t("privacy.cookies_erklaerung1")}</Typography>
      <Typography sx={{ marginTop: "10px" }}>
        {t("privacy.cookies_erklaerung2")}
      </Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.favoriten")}
      </Typography>
      <Typography>{t("privacy.favoriten_1")}</Typography>
      <Typography sx={{ marginTop: "10px" }}>
        {t("privacy.favoriten_2")}
      </Typography>
      <Typography sx={{ marginTop: "10px" }}>
        {t("privacy.favoriten_3")}
      </Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.mit_wem_daten_teilen")}
      </Typography>
      <Typography>{t("privacy.mit_niemandem")}</Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.wie_lange_daten_speichern")}
      </Typography>
      <Typography>{t("privacy.cookie_verfall_drei_monate")}</Typography>
      <Typography sx={{ marginTop: "10px" }}>
        {t("privacy.favoriten_speicherdauer")}
      </Typography>

      <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
        {t("privacy.welche_rechte")}
      </Typography>
      <Typography>
        <Trans
          i18nKey="privacy.rechte_auskunft"
          components={[
            <a
              key="contact"
              href="https://www.bahn-zum-berg.at/kontakt-mail.php"
            />,
          ]}
        />
      </Typography>
    </Box>
  );
}
