import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import { RangeObject } from "../features/apiSlice";
import Paper from "@mui/material/Paper";
import { parseFileName } from "../utils/globals";

export interface RangeCardProps {
  range: RangeObject;
}

export default function RangeCard({ range }: RangeCardProps) {
  let imageUrl = range.image_url;
  if (imageUrl && imageUrl.includes("null.webp") && range.range) {
    imageUrl = imageUrl.replace(
      "null.webp",
      parseFileName(range.range, "", ".webp"),
    );
  }

  return (
    <Paper
      sx={{
        height: "228px",
        backgroundImage: `url('${imageUrl}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
        borderRadius: "24px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
      className={"cursor-link"}
    >
      <Box
        sx={{
          padding: "20px",
          position: "absolute",
          top: "0px",
          right: "0px",
        }}
      >
        <Typography
          sx={{
            color: "#FFFFFF",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          <SouthEastIcon
            style={{
              background: "rgba(37, 73, 128, 0.85)",
              borderRadius: "15px",
              padding: "10px",
            }}
          />
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "20px",
          position: "absolute",
          bottom: "0px",
          left: "0px",
        }}
      >
        <Typography
          sx={{
            textAlign: "left",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#FFFFFF",
          }}
        >
          {range.range}
        </Typography>
      </Box>
    </Paper>
  );
}
