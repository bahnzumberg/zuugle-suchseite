import * as React from "react"
import { ReactComponent as YourSvg } from "./../icons/svg/ic_search.svg"
import { styles } from "./defaults"

export default function SearchIcon(props) {
    return <YourSvg style={{ ...styles, ...props.style }} />
}
