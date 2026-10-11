import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import LegalDialog, { type LegalDialogType } from "../LegalDialog/LegalDialog";
import { assetUrl } from "../../utils/assetUrl";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export default function Footer() {
  const { t } = useTranslation();
  const [legalDialog, setLegalDialog] = useState<LegalDialogType>(null);

  return (
    <>
      <Box>
        <Box sx={{ height: "100px" }} />
        <Box sx={{ marginBottom: "50px" }}>
          <Grid container spacing={2} sx={{ paddingBottom: "10px" }}>
            <Grid
              style={{ alignItems: "flex-end", textAlign: "center" }}
              size={{
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
                xl: 6,
              }}
              sx={{
                justifySelf: "center",
                alignItems: "center",
              }}
            >
              <a
                href="https://www.bmluk.gv.at/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={assetUrl("/img/BMLUK_Logo_Foerderung.svg")}
                  width="211"
                  height="100"
                  style={{ height: "100px", width: "auto" }}
                  alt="Funded by www.bmluk.gv.at"
                  loading="lazy"
                />
              </a>
            </Grid>
            <Grid
              style={{ alignItems: "flex-end", textAlign: "center" }}
              size={{
                xs: 12,
                sm: 12,
                md: 6,
                lg: 6,
                xl: 6,
              }}
              sx={{
                justifySelf: "center",
                alignItems: "center",
              }}
            >
              <a
                href="https://www.alpconv.org/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={assetUrl("/img/Alpenkonvention_logo_gruen.webp")}
                  width="317"
                  height="75"
                  style={{ height: "75px", width: "auto" }}
                  alt="Logo Alpenkonvention"
                  loading="lazy"
                />
              </a>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "100%", borderTop: "1px solid #dfdfdf" }}>
          <Box
            sx={{
              padding: { xs: "20px 16px", md: "20px 40px" },
              display: "flex",
              alignItems: { xs: "flex-end", md: "center" },
              justifyContent: "space-between",
              gap: { xs: "8px", md: "16px" },
            }}
          >
            {/* Logo: links unten on mobile */}
            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <a
                href="https://verein.bahn-zum-berg.at/"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={assetUrl("/img/bahnzumberg_logo_blue.svg")}
                  width="45"
                  height="32"
                  style={{ width: "45px", height: "auto" }}
                  alt="Bahn zum Berg"
                  loading="lazy"
                />
              </a>
            </Box>

            {/* Links: zentriert übereinander, in der Mitte von unten startend on mobile */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: { xs: "flex-end", md: "space-evenly" },
                flex: 1,
                gap: { xs: "6px", md: "0px" },
                textAlign: "center",
              }}
            >
              <Box
                component="span"
                onClick={() => setLegalDialog("imprint")}
                sx={{
                  order: { xs: 1, md: 3 },
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.85rem", md: "1rem" },
                  }}
                  className="cursor-link"
                >
                  {t("start.impressum")}
                </Typography>
              </Box>

              <Box
                component="span"
                onClick={() => setLegalDialog("privacy")}
                sx={{
                  order: { xs: 2, md: 2 },
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.85rem", md: "1rem" },
                  }}
                  className="cursor-link"
                >
                  {t("start.datenschutz")}
                </Typography>
              </Box>

              <Box
                component="a"
                href="https://verein.bahn-zum-berg.at"
                target="_blank"
                rel="noreferrer"
                sx={{
                  order: { xs: 3, md: 1 },
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "underline",
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.85rem", md: "1rem" },
                  }}
                  className="cursor-link"
                >
                  © {`${currentYear}`} Bahn zum Berg
                </Typography>
              </Box>
            </Box>

            {/* Social icons: rechts unten on mobile */}
            <Box
              sx={{
                flexShrink: 0,
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
              className="social-icons"
            >
              <IconButton
                component="a"
                href="https://www.facebook.com/bahnzumberg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit us on Facebook"
                size="small"
                title="Facebook"
              >
                <img
                  src={assetUrl("/img/logo-facebook.png")}
                  width="20px"
                  height="20px"
                  alt="Facebook"
                  loading="lazy"
                />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.instagram.com/bahnzumberg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit us on Instagram"
                size="small"
                title="Instagram"
                sx={{ marginLeft: "5px" }}
              >
                <img
                  src={assetUrl("/img/logo-instagram.png")}
                  width="20px"
                  height="20px"
                  alt="Instagram"
                  loading="lazy"
                />
              </IconButton>

              <IconButton
                component="a"
                href="https://github.com/bahnzumberg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit us on GitHub"
                size="small"
                title="GitHub"
                sx={{ marginLeft: "5px" }}
              >
                <img
                  src={assetUrl("/img/logo-github.png")}
                  width="20px"
                  height="20px"
                  alt="GitHub"
                  loading="lazy"
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <LegalDialog open={legalDialog} onClose={() => setLegalDialog(null)} />
    </>
  );
}
