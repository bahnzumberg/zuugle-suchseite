import { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import Button from "@mui/material/Button";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

export function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        zIndex: 10,
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
      className={"react-horizontal-scrolling-arrow-container"}
    >
      <Button
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
        style={{
          backgroundColor: "black",
          color: "#FFF",
          opacity: isFirstItemVisible ? 0 : 0.6,
        }}
        className={"react-horizontal-scrolling-arrow"}
      >
        <ChevronLeft />
      </Button>
    </div>
  );
}
