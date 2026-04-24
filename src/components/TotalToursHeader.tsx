import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AutocompleteCitySelection from "./Search/AutocompleteCitySelection";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { RootState } from "..";

export default function TotalToursHeader({
  loadedTours,
}: {
  loadedTours?: { total: number };
}) {
  const city = useSelector((state: RootState) => state.search.city);

  return (
    <Box className={"header-line-main"} sx={{ width: "100%" }}>
      <Box
        sx={{
          paddingTop: "25px",
          paddingBottom: "6px",
          paddingX: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {loadedTours?.total != undefined && (
          <>
            {city && (
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#333",
                  whiteSpace: "nowrap",
                }}
              >
                {Number(loadedTours.total).toLocaleString()}
                {loadedTours.total === 1
                  ? ` ${t("main.ergebnis")}`
                  : ` ${t("main.ergebnisse")}`}
              </Typography>
            )}
            <Box
              sx={{
                width: "100%",
                maxWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <AutocompleteCitySelection highlighted={!city} />
              {!city && (
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", px: "2px", lineHeight: 1.3 }}
                >
                  {t("search.waehle_dein_heimatbahnhof")}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
