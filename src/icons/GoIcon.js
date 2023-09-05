import * as React from "react"
import { ReactComponent as YourSvg } from "./../icons/svg/ic_go.svg"
import { styles } from "./defaults"

export default function GoIcon(props) {
    return (
        <YourSvg
            style={{
                ...styles,
                ...props.style,
            }}
        />
    )
}
