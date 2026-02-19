import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadView() {
  return (
    <Box
      style={{
        maxWidth: "100%",
        textAlign: "center",
        padding: "20px",
        width: "500px",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
