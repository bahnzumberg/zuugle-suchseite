import * as React from "react";
import Button from '@mui/material/Button';


const MapBtn = ({ children, onClick }) => {
    return (
      <Button sx={{
        position: "fixed", 
        bottom: "20px", // Adjust bottom position for desktop
        // left: "50%", // Center horizontally
        transform: "translateX(-50%)", // Center horizontally
        width: "170px", 
        height: "40px", 
        borderRadius: "50px 50px ",
        opacity: 1, 
        backgroundColor: "#101010",
        color: "#f1f1f1", // text color
        cursor: "pointer",
      }}
      onClick={onClick}
      >
        {children}
      </Button>
    );
  };
  
  export default MapBtn;