import * as React from "react";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";

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
        width: "68vw",
        margin: "auto",
      }}
    >
      <Box className={"kpi-container"} sx={{ textAlign: "center" }}>
        <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <Typography variant={"h3"} sx={{ marginTop: "20px" }}>
            {t("start.ziel_von_zuugle")}
          </Typography>
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            <Typography variant={"text"} color={"#FFFFFF"}>
              {" "}
              {t("start.weil_es_braucht_kein_auto")}{" "}
            </Typography>
          </Box>
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
                <Typography variant={"h3"}>
                  {Number(totalTours).toLocaleString()}
                </Typography>
                <Typography variant={"text"} color={"#FFFFFF"}>
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
                <Typography variant={"h3"}>{totalProvider}</Typography>
                <Typography variant={"text"} color={"#FFFFFF"}>
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
                <Typography variant={"h3"}>{totalCities}</Typography>
                <Typography variant={"text"} color={"#FFFFFF"}>
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
                <Typography variant={"h3"}>
                  {Number(totalConnections).toLocaleString()}
                </Typography>
                <Typography variant={"text"} color={"#FFFFFF"}>
                  {t("start.anzahl_öffi_verbindungen")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
