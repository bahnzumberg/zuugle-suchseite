import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";

export interface KPIContainerProps {
  totalTours: number;
  totalConnections: number;
  totalCities: number;
  totalProvider: number;
}

export default function KPIContainer({
  totalTours,
  totalConnections,
  totalCities,
  totalProvider,
}: KPIContainerProps) {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        bgcolor: "primary.main",
        borderRadius: "24px",
        width: "100%",
        margin: "auto",
      }}
    >
      <Box className={"kpi-container"} sx={{ textAlign: "center" }}>
        <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <Typography variant={"h3"} sx={{ marginTop: "20px" }}>
            {t("start.ziel_von_zuugle")}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "50px" }}>
          <Grid container>
            <Grid
              sx={{ marginBottom: "16px" }}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
                lg: 3,
                xl: 3,
              }}
            >
              <Box>
                <Typography
                  variant={"h3"}
                  sx={{ fontSize: { xs: "27px", sm: "48px" }, fontWeight: 700 }}
                >
                  {Number(totalTours).toLocaleString()}
                </Typography>
                <Typography
                  variant={"text"}
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {t("start.öffi_bergtouren")}
                </Typography>
              </Box>
            </Grid>
            <Grid
              sx={{ marginBottom: "16px" }}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
                lg: 3,
                xl: 3,
              }}
            >
              <Box>
                <Typography
                  variant={"h3"}
                  sx={{ fontSize: { xs: "27px", sm: "48px" }, fontWeight: 700 }}
                >
                  {totalProvider}
                </Typography>
                <Typography
                  variant={"text"}
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {t("start.durchsuchte_portale")}
                </Typography>
              </Box>
            </Grid>
            <Grid
              sx={{ marginBottom: "16px" }}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
                lg: 3,
                xl: 3,
              }}
            >
              <Box>
                <Typography
                  variant={"h3"}
                  sx={{ fontSize: { xs: "27px", sm: "48px" }, fontWeight: 700 }}
                >
                  {totalCities}
                </Typography>
                <Typography
                  variant={"text"}
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {t("start.verfügbare_heimatbahnhöfe")}
                </Typography>
              </Box>
            </Grid>
            <Grid
              sx={{ marginBottom: "16px" }}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
                lg: 3,
                xl: 3,
              }}
            >
              <Box>
                <Typography
                  variant={"h3"}
                  sx={{ fontSize: { xs: "27px", sm: "48px" }, fontWeight: 700 }}
                >
                  {Number(totalConnections).toLocaleString()}
                </Typography>
                <Typography
                  variant={"text"}
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {t("start.anzahl_öffi_verbindungen")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "50px",
            paddingBottom: "0px",
          }}
        >
          <a
            href="https://verein.bahn-zum-berg.at/"
            style={{ display: "block" }}
          >
            <img
              src="https://cdn.zuugle.at/img/bahnzumberg_logo_white.svg"
              alt="Bahn zum Berg"
              style={{ height: "100px", width: "auto", display: "block" }}
              loading="lazy"
            />
          </a>
          <Typography
            variant={"text"}
            sx={{
              color: "#FFFFFF",
              display: "block",
              marginTop: "12px",
              textAlign: "center",
              width: "100%",
              maxWidth: { xs: 420, md: "none" },
              whiteSpace: { xs: "normal", md: "nowrap" },
            }}
          >
            {t("start.weil_es_braucht_kein_auto")}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
