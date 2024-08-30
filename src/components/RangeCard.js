import * as React from "react";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import SouthEastIcon from "@mui/icons-material/SouthEast";


export default function RangeCard({ range, onSelectTour }) {
  return (
    <Paper
      sx={{
        height: "228px",
        backgroundImage: `url('${range.image_url}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
        borderRadius: "24px",
      }}
      className={"cursor-link"}
      onClick={({ target }) => onSelectTour(range)}
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
          sx={{ textAlign: "left", fontWeight: "bold" }}
          color={"#FFFFFF"}
        >
          <SouthEastIcon
            style={{
              background: "#000",
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
          sx={{ textAlign: "left", fontWeight: "bold" }}
          color={"#FFFFFF"}
        >
          {range.range}
        </Typography>
      </Box>
    </Paper>
  );
}
