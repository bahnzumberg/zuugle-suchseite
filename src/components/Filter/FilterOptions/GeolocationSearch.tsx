import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";
import { useTranslation } from "react-i18next";

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

  return (
    <Box className="filter-box border" sx={{ p: 2, pt: 3 }}>
      <Grid container alignItems="center" spacing={1}>
        <Typography variant={"subtitle1"}>
          {t("filter.geolocation_search")}
        </Typography>{" "}
        {!!tempGeolocation?.lat !== !!tempGeolocation?.lng && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <WarningIcon color="error" fontSize="small" />
            <Typography sx={{ color: "error.main" }}>
              {" " + t("filter.geolocation_search_warning") + " "}
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid container spacing={"10px"} sx={{ marginTop: "15px" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="lat"
            fullWidth
            value={tempGeolocation?.lat ?? ""}
            onChange={(e) => updateGeolocation(e.target.value, "lat")}
            onBlur={handleAutoRadius}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="lon"
            fullWidth
            value={tempGeolocation?.lng ?? ""}
            onChange={(e) => updateGeolocation(e.target.value, "lng")}
            onBlur={handleAutoRadius}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Radius (m)"
            fullWidth
            value={tempGeolocation?.radius ?? ""}
            onChange={(e) => updateGeolocation(e.target.value, "radius")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
