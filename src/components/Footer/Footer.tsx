import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export default function Footer() {
  const { t } = useTranslation();

  return (
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
            <a href="https://www.bmluk.gv.at/" target="_blank" rel="noreferrer">
              <img
                src="https://cdn.zuugle.at/img/BMLUK_Logo_srgb_EN.svg"
                height="100px"
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
            <a href="https://www.alpconv.org/" target="_blank" rel="noreferrer">
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
      </Box>
      <Box sx={{ width: "100%", borderTop: "1px solid #dfdfdf" }}>
        <Grid
          container
          sx={{
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid
            size={{
              xs: 12,
              md: 10,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: { xs: "12px 0px", md: "0px" },
                width: "100%",
              }}
            >
              <a
                href="https://verein.bahn-zum-berg.at/"
                target="_blank"
                rel="noreferrer"
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <img
                  src={`https://cdn.zuugle.at/img/bahnzumberg_logo_blue.svg`}
                  width={"45px"}
                  height={"auto"}
                  alt="Bahn zum Berg"
                  loading="lazy"
                />
              </a>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flex: 1,
                  gap: { xs: "8px 16px", md: "0px" },
                }}
              >
                <a
                  href="https://verein.bahn-zum-berg.at"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    sx={{
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                    className={"cursor-link"}
                  >
                    © {`${currentYear}`} Bahn zum Berg
                  </Typography>
                </a>
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    sx={{
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                    className={"cursor-link"}
                  >
                    {t("start.datenschutz")}
                  </Typography>
                </Link>
                <Link
                  to="/imprint"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    sx={{
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                    className={"cursor-link"}
                  >
                    {t("start.impressum")}
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2,
            }}
          >
            <Box
              sx={{
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
              className={"social-icons"}
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
                  src={`https://cdn.zuugle.at/img/logo-facebook.png`}
                  width={"20px"}
                  height={"20px"}
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
                  src={`https://cdn.zuugle.at/img/logo-instagram.png`}
                  width={"20px"}
                  height={"20px"}
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
                  src={`https://cdn.zuugle.at/img/logo-github.png`}
                  width={"20px"}
                  height={"20px"}
                  alt="GitHub"
                  loading="lazy"
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
