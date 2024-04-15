import * as React from "react";
import Button from '@mui/material/Button';
import MapIcon from "../../icons/Map";

const MapBtn = ({ children, onClick , mapBtnext}) => {
  return (
    <Button
      sx={{
        position: "fixed",
        bottom: "20px",
        transform: "translateX(-50%)",
        width: "200px",
        height: "40px",
        borderRadius: "50px 50px",
        opacity: 1,
        backgroundColor: "#101010",
        color: "#f1f1f1",
        cursor: "pointer",
        alignItems: "center", // Align vertically
        justifyContent: "space-between", // Space content evenly
        flexDirection: "row", // Text and icon in a row
        margin: "2 auto",
      }}
      onClick={onClick}
      aria-label="contained"
      variant="contained"
      endIcon={<MapIcon />}
    >
      <span style={{ paddingLeft: "10px" }}>
        {children}
        {mapBtnext}
      </span> 
    </Button>
  );
};
  export default MapBtn;