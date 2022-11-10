import * as React from "react";
import {VisibilityContext} from "react-horizontal-scrolling-menu";
import {Button} from "@mui/material";
import {ChevronLeft} from "@mui/icons-material";

export function LeftArrow() {
    const { isFirstItemVisible, scrollPrev } = React.useContext(VisibilityContext);

    return (
        <div style={{position: "absolute", height: "100%", zIndex: 10, left: "10px", top: 0}} className={"react-horizontal-scrolling-arrow-container"}>
            <Button disabled={isFirstItemVisible} onClick={() => scrollPrev()} style={{backgroundColor: "black", color: "#FFF", opacity: (!!isFirstItemVisible ? 0 : 0.6)}} className={"react-horizontal-scrolling-arrow"}>
                <ChevronLeft />
            </Button>
        </div>

    );
}