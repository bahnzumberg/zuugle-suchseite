import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

/**
 * Mountain peak with a summit cross (Gipfelkreuz).
 * Clean, geometric outlined style matching MUI outlined icons.
 */
export default function PeakIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fill: "none", ...props.sx }}>
      {/* Summit cross */}
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="9.5"
        y1="4.5"
        x2="14.5"
        y2="4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Main peak – outlined only */}
      <path
        d="M12 8 L4 21 L20 21 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}
