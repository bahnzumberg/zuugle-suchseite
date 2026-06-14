import { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Header from "./Header";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { usePageHeader } from "../utils/seoPageHelper";
import { useGetLicensesQuery, LicenseEntry } from "../features/apiSlice";

/** Group license entries by country_name, both levels sorted alphabetically. */
function groupByCountry(
  licenses: LicenseEntry[],
): { country: string; entries: LicenseEntry[] }[] {
  const map = new Map<string, LicenseEntry[]>();
  for (const entry of licenses) {
    const list = map.get(entry.country_name) ?? [];
    list.push(entry);
    map.set(entry.country_name, list);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([country, entries]) => ({
      country,
      entries: entries.sort((a, b) => a.human_name.localeCompare(b.human_name)),
    }));
}

function LicenseItem({ entry }: { entry: LicenseEntry }) {
  let licenseLabel: React.ReactNode = null;
  if (entry.spdx_license_identifier) {
    licenseLabel = entry.license_url ? (
      <a href={entry.license_url} target="_blank" rel="noreferrer">
        {entry.spdx_license_identifier}
      </a>
    ) : (
      entry.spdx_license_identifier
    );
  } else if (entry.license_url) {
    licenseLabel = (
      <a href={entry.license_url} target="_blank" rel="noreferrer">
        Lizenz
      </a>
    );
  }

  return (
    <li>
      {entry.human_name}
      {entry.publisher && <> — {entry.publisher.name}</>}
      {licenseLabel && <> {licenseLabel}</>}
    </li>
  );
}

function Imprint() {
  //Translation related
  const { t } = useTranslation();

  usePageHeader({ header: "Imprint" });

  useEffect(() => {
    // @ts-expect-error matomo
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ pagetitel: "Imprint" });
  }, []);

  const { data: licenses, isLoading, isError } = useGetLicensesQuery();
  const grouped = useMemo(
    () => (licenses ? groupByCountry(licenses) : []),
    [licenses],
  );

  return (
    <Box className={"about-container"} sx={{ paddingBottom: "80px" }}>
      <Header title={"Imprint"} backgroundColor="var(--bzb-lindgruen)" />

      <Box className={"start-body-container static-container"}>
        <Box style={{ textAlign: "left" }}>
          <Typography variant={"h5"}>
            {t("impressum.verantwortlich_fuer_inhalt")}
          </Typography>
          <Typography>
            Bahn zum Berg – Verein zur Förderung der nachhaltigen Mobilität bei
            der Anreise zu Outdoor-Aktivitäten
          </Typography>
          <Typography> Wipplingerstraße 18/9 </Typography>
          <Typography>A-1010 Wien</Typography>
          <Typography sx={{ marginTop: "10px" }}>ZVR: 1112324997</Typography>
          <Typography>
            Zuständige Behörde: Bundespolizeidirektion Wien, A-1010 Wien,
            Schottenring 7-9
          </Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("impressum.kontakt")}{" "}
          </Typography>

          <Typography>
            <a href={"https://www.bahn-zum-berg.at/kontakt-mail.php"}>
              kontakt [at] bahn-zum-berg.at
            </a>
          </Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("impressum.vereinsvorstand")}
          </Typography>
          <Typography>
            <a href={"https://verein.bahn-zum-berg.at/team/"}>
              https://verein.bahn-zum-berg.at/team/
            </a>
          </Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {" "}
            {t("impressum.ziel_und_ausrichtung")}{" "}
          </Typography>

          <Typography>{t("impressum.non_profit_org1")}</Typography>

          <Typography sx={{ marginTop: "10px" }}>
            {t("impressum.non_profit_org2")}
          </Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("impressum.haftung_inhalte")}
          </Typography>
          <Typography> {t("impressum.beschreibungen_fotos")} </Typography>

          <Typography variant={"h5"} sx={{ marginTop: "20px" }}>
            {t("impressum.haftung_fuer_links")}
          </Typography>
          <Typography> {t("impressum.verknuepfung_links")} </Typography>

          <Typography variant={"h5"} sx={{ marginTop: "40px" }}>
            {t("impressum.gefoerdert_von")}
          </Typography>

          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid style={{ textAlign: "center" }} size={{ xs: 12, md: 6 }}>
              <a
                href="https://www.bmluk.gv.at/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://cdn.zuugle.at/img/BMLUK_Logo_srgb_EN.svg"
                  height="100px"
                  alt="Funded by www.bmluk.gv.at"
                  loading="lazy"
                />
              </a>
            </Grid>
            <Grid style={{ textAlign: "center" }} size={{ xs: 12, md: 6 }}>
              <a
                href="https://www.alpconv.org/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://cdn.zuugle.at/img/Alpenkonvention_logo_gruen.webp"
                  height="75px"
                  width="317px"
                  alt="Logo Alpenkonvention"
                  loading="lazy"
                />
              </a>
            </Grid>
          </Grid>

          <Typography variant={"h5"} sx={{ marginTop: "40px" }}>
            {t("impressum.lizenzbedingungen")}
          </Typography>

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {isError && (
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              {t("impressum.anfuehrung_quellen")}
            </Typography>
          )}

          {grouped.map((group) => (
            <Box key={group.country} sx={{ mt: 2 }}>
              <Typography variant="h6">{group.country}</Typography>
              <ul style={{ margin: "4px 0 0 0", paddingLeft: "24px" }}>
                {group.entries.map((entry) => (
                  <LicenseItem key={entry.human_name} entry={entry} />
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Imprint;
