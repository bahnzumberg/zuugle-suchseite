import { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";

export function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "100%",
        zIndex: 10,
      }}
      className={"react-horizontal-scrolling-arrow-container"}
    >
      <Button
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
        style={{
          backgroundColor: "#aab5d7",
          color: "#254980",
          opacity: isLastItemVisible ? 0 : 1,
          borderRadius: "12px",
          minWidth: "40px",
        }}
        className={"react-horizontal-scrolling-arrow"}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
