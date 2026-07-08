import Box from "@mui/material/Box";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { SxProps, Theme } from "@mui/material/styles";

type HideMapIconProps = {
  sx?: SxProps<Theme>;
};

export function HideMapIcon({ sx }: HideMapIconProps) {
  return (
    <Box
      sx={[
        { position: "relative", display: "inline-flex" },
        ...(Array.isArray(sx) ? sx : [sx ?? {}]),
      ]}
    >
      <MapOutlinedIcon sx={{ fontSize: "inherit" }} />
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
