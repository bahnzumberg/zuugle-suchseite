import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useFavorites } from "../../hooks/useFavorites";

// Mounted once app-wide. The favorite is always saved locally already —
// this is just a heads-up that it didn't sync online.
export default function FavoritesErrorSnackbar() {
  const { error, clearError } = useFavorites();

  return (
    <Snackbar
      open={error !== null}
      autoHideDuration={10000}
      onClose={clearError}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={clearError}
        severity="warning"
        variant="standard"
        sx={{
          width: "100%",
          bgcolor: "var(--bzb-warnorange-light)",
          color: "var(--bzb-warnorange-dark)",
          borderLeft: "4px solid var(--bzb-warnorange)",
          borderRadius: "10px",
          // "& .MuiAlert-icon": { color: "var(--bzb-warnorange)" },
        }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
}
