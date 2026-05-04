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
        alignItems: "center",
        height: "100%",
        zIndex: 10,
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
      className={"react-horizontal-scrolling-arrow-container"}
    >
      <Button
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
        style={{
          backgroundColor: "black",
          color: "#FFF",
          opacity: isLastItemVisible ? 0 : 0.6,
        }}
        className={"react-horizontal-scrolling-arrow"}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
