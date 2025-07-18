import * as React from "react";
import Box from "@mui/material/Box";
import { Fragment } from "react";

export default function TextWithIcon({
  text,
  iconLeft,
  iconRight,
}: {
  text: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {iconLeft ? iconLeft : <Fragment />} {text}{" "}
      {iconRight ? iconRight : <Fragment />}
    </Box>
  );
}
