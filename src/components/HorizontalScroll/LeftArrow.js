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
        zIndex: 10,
        marginRight: "16px",
      }}
      className={"react-horizontal-scrolling-arrow-container"}
    >
      <Button
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
        style={{
          backgroundColor: "#aab5d7",
          color: "#254980",
          opacity: isFirstItemVisible ? 0 : 1,
          borderRadius: "12px",
          minWidth: "40px",
          height: "228px",
        }}
        className={"react-horizontal-scrolling-arrow"}
      >
        <ChevronLeft />
      </Button>
    </div>
  );
}
