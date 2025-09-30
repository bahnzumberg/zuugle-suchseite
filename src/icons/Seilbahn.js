import { ReactComponent as YourSvg } from "./svg/seilbahn.svg";

export default function Seilbahn(props) {
  return <YourSvg style={{ ...props.style }} />;
}
