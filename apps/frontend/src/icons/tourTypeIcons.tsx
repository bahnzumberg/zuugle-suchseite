import { createSvgIcon } from "@mui/material/SvgIcon";

export const CrossCountrySkiingIcon = createSvgIcon(
  <g
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="16" cy="4" r="2" fill="currentColor" stroke="none" />
    <path
      strokeWidth="2.2"
      d="M14.8 7.2 11.4 12.6M11.4 12.6 8.6 16.4 6 20.3M11.4 12.6l2.7 3.7.4 4M14.4 8.2l3.6 2.3M14.4 8.2 10 10"
    />
    <path strokeWidth="1.4" d="M18.6 9.2 17.2 19.6M9.6 9.4 4 17.6" />
    <path strokeWidth="1.8" d="M2 20.6h7.5M11 20.6h9a2 2 0 0 0 2-1.6" />
  </g>,
  "CrossCountrySkiing",
);

export const CarabinerIcon = createSvgIcon(
  <g transform="rotate(-25 12 12)">
    <path d="M13 1.8c3.7 0 5.8 2.6 5.8 6.2v8c0 3.9-2.9 6.2-6.5 6.2s-6.9-2.3-6.9-6v-1.1h2.4v1.1c0 2.3 2.1 3.6 4.5 3.6s4.1-1.4 4.1-3.8V8c0-2.4-1.3-3.8-3.4-3.8-1.8 0-2.9 1.3-3.2 4.2L7.4 8.2C7.8 4 9.8 1.8 13 1.8z" />
    <path d="M5.6 13.5 7.4 9.2l2.4 1-1.8 4.3z" />
  </g>,
  "Carabiner",
);

// Phosphor "LadderSimple" (bold, MIT), scaled from its 256 grid to 24
export const LadderIcon = createSvgIcon(
  <path
    transform="scale(0.09375)"
    d="M192,20a12,12,0,0,0-12,12V60H76V32a12,12,0,0,0-24,0V224a12,12,0,0,0,24,0V196H180v28a12,12,0,0,0,24,0V32A12,12,0,0,0,192,20ZM180,84v32H76V84ZM76,172V140H180v32Z"
  />,
  "Ladder",
);
