import { createTheme } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";
import { alertClasses } from "@mui/material/Alert";

const { augmentColor } = createTheme().palette;

// Corporate Design palette (mirrors the --bzb-* custom properties in App.css).
// Repeated as literals because MUI's palette math — augmentColor, contrastText —
// cannot read CSS custom properties.
const BAHNBLAU = "#254980";
const AKELEI = "#712579";
const WOLKENBLAU = "#aab5d7";
// A Wolkenblau tint, light enough to carry Bahnblau body text at 8.1:1.
const WOLKENBLAU_LIGHT = "#f0f4ff";
const LINDGRUEN = "#ccd8a1";
// From the manual's digital supplement. Warnorange is an accent tone only: white
// on it is 3.8:1 and fails WCAG AA, so text and filled surfaces take Warnorange
// Dunkel (5.6:1 on white) instead.
const WARNORANGE = "#e65100";
const WARNORANGE_DARK = "#bf360c";
const WARNORANGE_LIGHT = "#fff3e0";

/**
 * How each Alert severity is painted: a light surface with dark text, and the
 * accent tone on the icon. Severities are styled here rather than left to MUI's
 * red/orange/green defaults, which are not Corporate Design colours.
 *
 * The manual pairs its warn surface with a left accent bar, as the connection
 * search does — left off here on purpose: on a small alert the bar competes with
 * the icon for the same job and makes the message look busier than it is.
 *
 * The CD has one warn colour, so error and warning share it: severity is carried
 * by the icon and the wording, not by hue.
 */
const ALERT_TONES = {
  error: { bg: WARNORANGE_LIGHT, text: WARNORANGE_DARK, accent: WARNORANGE },
  warning: { bg: WARNORANGE_LIGHT, text: WARNORANGE_DARK, accent: WARNORANGE },
  // No green in the CD beyond Lindgrün, which is a surface tone. Bahnblau on it
  // is 5.9:1 — the pairing the favorites toggle already uses when it is active.
  success: { bg: LINDGRUEN, text: BAHNBLAU, accent: BAHNBLAU },
  info: { bg: WOLKENBLAU_LIGHT, text: BAHNBLAU, accent: WOLKENBLAU },
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: BAHNBLAU,
    },
    secondary: {
      main: AKELEI,
    },
    info: {
      main: WOLKENBLAU,
      light: WOLKENBLAU_LIGHT,
      contrastText: BAHNBLAU,
    },
    // Warnorange Dunkel as `main`, not Warnorange: `main` is what fills buttons
    // and chips, and only the dark tone carries white text accessibly.
    error: {
      main: WARNORANGE_DARK,
      light: WARNORANGE_LIGHT,
      dark: WARNORANGE_DARK,
      contrastText: "#fff",
    },
    warning: {
      main: WARNORANGE_DARK,
      light: WARNORANGE_LIGHT,
      dark: WARNORANGE_DARK,
      contrastText: "#fff",
    },
    success: {
      main: LINDGRUEN,
      light: LINDGRUEN,
      dark: BAHNBLAU,
      contrastText: BAHNBLAU,
    },
    // Lindgrün – Corporate Design brand colour (mirrors `--bzb-lindgruen`).
    lindgruen: augmentColor({
      color: { main: LINDGRUEN },
      name: "lindgruen",
    }),
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const tone = ALERT_TONES[ownerState.severity ?? "success"];
          return {
            borderRadius: 10,
            fontSize: "14px",
            backgroundColor: tone.bg,
            color: tone.text,
            [`& .${alertClasses.icon}`]: { color: tone.accent },
          };
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          border: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          [`&.${buttonClasses.contained}.${buttonClasses.colorPrimary}`]: {
            backgroundColor: AKELEI,
            "&:hover": {
              backgroundColor: BAHNBLAU,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // The border rules that used to live here were written in MUI v4's JSS
        // `$notchedOutline` syntax, which emotion emits verbatim as an invalid
        // selector — they never applied, and the Material blue they carried was
        // not a Corporate Design colour. Inputs keep MUI's default outline;
        // tinting it Wolkenblau would be a deliberate change to every field.
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  typography: {
    fontFamily: `"Source Sans 3", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    subtitle2: {
      fontSize: "16px",
      color: "#8B8B8B",
      fontWeight: 600,
    },
    subtitle3: {
      fontSize: "16px",
      color: "#101010",
      fontWeight: "400",
      fontFamily: `"Source Sans 3", "Helvetica", "Arial", sans-serif`,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 600,
      color: "#101010",
    },
    title: {
      fontSize: 32,
      fontWeight: 700,
      color: AKELEI,
    },
    h1: {
      fontSize: 54,
      fontWeight: 600,
      color: "#FFFFFF",
      "@media (max-width:600px)": {
        fontSize: 36,
      },
    },
    h3: {
      fontSize: 32,
      fontWeight: 700,
      color: "#FFFFFF",
      "@media (max-width:600px)": {
        fontSize: 18,
      },
    },
    h4: {
      fontSize: 22,
      color: "#101010",
      fontWeight: 600,
    },
    h5: {
      fontSize: 14,
      color: BAHNBLAU,
      fontWeight: 700,
      textTransform: "uppercase",
    },
    cardTitle: {
      fontSize: 14,
      color: "#000",
      fontWeight: 700,
    },
    grayP: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.5)",
      fontWeight: 500,
    },
    blueP: {
      fontSize: 12,
      color: BAHNBLAU,
      fontWeight: 500,
    },
    blackP: {
      fontSize: 12,
      color: "#000",
      fontWeight: 500,
    },
    h5alt: {
      fontSize: 18,
      fontWeight: 600,
    },
    infoKey: {
      fontWeight: 400,
      fontSize: "15px",
      lineHeight: "23px",
      color: "#101010",
      "@media (max-width:600px)": {
        fontSize: "12px",
        lineHeight: "18px",
      },
    },
    text: {
      fontSize: "16px",
      lineHeight: "22px",
      color: "#8B8B8B",
    },
    textSmall: {
      fontSize: "14px",
      lineHeight: "22px",
      color: "#8B8B8B",
    },
    link: {
      fontSize: "16px",
      lineHeight: "22px",
      color: BAHNBLAU,
    },
    error: {
      fontSize: "16px",
      color: WARNORANGE_DARK,
    },
  },
});
