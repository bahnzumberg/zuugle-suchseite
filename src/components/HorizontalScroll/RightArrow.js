import * as React from "react";
import {VisibilityContext} from "react-horizontal-scrolling-menu";
import {Button} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";

export function RightArrow() {
    const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

    return (
        <div style={{position: "absolute", height: "100%", zIndex: 10, right: "10px", top: 0}} className={"react-horizontal-scrolling-arrow-container"}>
            <Button disabled={isLastItemVisible} onClick={() => scrollNext()} style={{backgroundColor: "black", color: "#FFF", opacity: (!!isLastItemVisible ? 0 : 0.6)}} className={"react-horizontal-scrolling-arrow"}>
                <ChevronRight />
            </Button>
        </div>
    );
}