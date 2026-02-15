import Box from "@mui/material/Box";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

export function HideMapIcon() {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <MapOutlinedIcon />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "5%",
            left: "50%",
            width: "2px",
            height: "95%",
            backgroundColor: "currentColor",
            transform: "translateX(-50%) rotate(-45deg)",
          },
        }}
      />
    </Box>
  );
}
