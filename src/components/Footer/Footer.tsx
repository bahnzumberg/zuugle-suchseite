import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

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
            justifySelf="center"
            alignItems="center"
            style={{ alignItems: "flex-end" }}
            size={{
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
              xl: 6,
            }}
          >
            <a
              href="https://www.bmkluk.gv.at/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://cdn.zuugle.at/img/BMLUK_Logo_srgb_EN.svg"
                height="100px"
                alt="Funded by www.bmkluk.gv.at"
                loading="lazy"
              />
            </a>
          </Grid>
          <Grid
            justifySelf="center"
            alignItems="center"
            style={{ alignItems: "flex-end" }}
            size={{
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
              xl: 6,
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
            <Grid container spacing={2}>
              <Grid
                style={{ maxWidth: "30px" }}
                className={"footer-logo"}
                size={{
                  xs: "auto",
                  md: 2,
                }}
              >
                <img
                  src={`https://cdn.zuugle.at/img/zuugle.svg`}
                  height={"20px"}
                  width={"36px"}
                  alt="Logo Zuugle"
                  loading="lazy"
                />
              </Grid>
              <Grid
                size={{
                  xs: "grow",
                  md: 3,
                }}
              >
                <a
                  href="https://verein.bahn-zum-berg.at"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography
                    sx={{
                      marginLeft: "10px",
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                    className={"cursor-link"}
                  >
                    © {`${currentYear}`} Bahn zum Berg
                  </Typography>
                </a>
              </Grid>
              <Grid size="grow">
                <Typography
                  sx={{
                    marginLeft: "10px",
                    textDecoration: "underline",
                  }}
                  className={"cursor-link"}
                  onClick={() =>
                    window.open(
                      `${window.location.protocol}//${window.location.host}/privacy`,
                    )
                  }
                >
                  {t("start.datenschutz")}
                </Typography>
              </Grid>
              <Grid size="grow">
                <Typography
                  sx={{
                    marginLeft: "10px",
                    textDecoration: "underline",
                  }}
                  className={"cursor-link"}
                  onClick={() =>
                    window.open(
                      `${window.location.protocol}//${window.location.host}/imprint`,
                    )
                  }
                >
                  {t("start.impressum")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2,
            }}
          >
            <Box sx={{ textAlign: "right" }} className={"social-icons"}>
              <img
                className={"cursor-link"}
                src={`https://cdn.zuugle.at/img/logo-facebook.png`}
                width={"20px"}
                height={"20px"}
                onClick={() =>
                  window.open("https://www.facebook.com/bahnzumberg/")
                }
                loading="lazy"
                alt="Facebook"
              />{" "}
              &nbsp;{" "}
              <img
                className={"cursor-link"}
                src={`https://cdn.zuugle.at/img/logo-instagram.png`}
                width={"20px"}
                height={"20px"}
                style={{ marginLeft: "5px" }}
                onClick={() =>
                  window.open("https://www.instagram.com/bahnzumberg/")
                }
                loading="lazy"
                alt="Instagram"
              />{" "}
              &nbsp;{" "}
              <img
                className={"cursor-link"}
                src={`https://cdn.zuugle.at/img/logo-github.png`}
                width={"20px"}
                height={"20px"}
                style={{ marginLeft: "5px" }}
                onClick={() => window.open("https://github.com/bahnzumberg/")}
                loading="lazy"
                alt="GitHub"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
