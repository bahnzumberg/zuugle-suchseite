import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";
import { useTranslation } from "react-i18next";
import FilterSection from "../FilterSection";

interface GeolocationSearchProps {
  tempGeolocation: {
    lat?: number | string;
    lng?: number | string;
    radius?: number | string;
  };
  updateGeolocation: (value: string, field: "lat" | "lng" | "radius") => void;
  handleAutoRadius: () => void;
}

export default function GeolocationSearch({
  tempGeolocation,
  updateGeolocation,
  handleAutoRadius,
}: GeolocationSearchProps) {
  const { t } = useTranslation();
  const hasGeolocation =
    isFinite(parseFloat(tempGeolocation?.lat as string)) &&
    isFinite(parseFloat(tempGeolocation?.lng as string));

  return (
    <FilterSection
      title={t("filter.geolocation_search")}
      showSection={true}
      isActive={hasGeolocation}
    >
      {!!tempGeolocation?.lat !== !!tempGeolocation?.lng && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <WarningIcon color="error" fontSize="small" />
          <Typography sx={{ color: "error.main" }}>
            {t("filter.geolocation_search_warning")}
          </Typography>
        </Box>
      )}
      <Grid container spacing={"10px"} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, sm: 4.5 }}>
          <TextField
            label="lat"
            fullWidth
            value={tempGeolocation?.lat ?? ""}
            onChange={(e) => updateGeolocation(e.target.value, "lat")}
            onBlur={handleAutoRadius}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4.5 }}>
          <TextField
            label="lon"
            fullWidth
            value={tempGeolocation?.lng ?? ""}
            onChange={(e) => updateGeolocation(e.target.value, "lng")}
            onBlur={handleAutoRadius}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Radius (m)"
            fullWidth
            value={tempGeolocation?.radius ?? ""}
            onChange={(e) => updateGeolocation(e.target.value, "radius")}
          />
        </Grid>
      </Grid>
    </FilterSection>
  );
}
