import * as React from "react";
import { ReactComponent as YourSvg } from "./../icons/svg/list.svg";
import { styles } from "./defaults";

export default function List(props) {
  return <YourSvg style={{ ...styles, ...props.style }} />;
}
