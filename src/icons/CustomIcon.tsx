import React from "react";
import { IconName, icons } from "./icons";
import { styles } from "./defaults";

type IconProps = {
  name: IconName;
  style?: React.CSSProperties;
};

export function CustomIcon({ name, style }: IconProps) {
  const SvgComponent = icons[name];

  if (!SvgComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <SvgComponent style={{ ...styles, ...style }} />;
}
