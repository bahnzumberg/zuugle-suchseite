import * as React from "react"
import { ReactComponent as YourSvg } from "./../icons/svg/ic_filter_2.svg"
import { styles } from "./defaults"

export default function FilterIcon(props) {
    return (
        <YourSvg
            style={{
                ...styles,
                ...props.style,
                ...props.sx,
                transform: "scale(0.675)",
            }}
        />
    )
}
