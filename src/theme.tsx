import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4992FF",
    },
    info: {
      main: "#F7F7F7",
    },
    white: {
      main: "#FFFFFF",
      contrastText: "#4992FF",
    },
  },
  components: {
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
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "& $notchedOutline": {
            borderColor: "#90caf9",
          },
          "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            borderColor: "#90caf9",
            borderWidth: 2,
          },
          "&$focused $notchedOutline": {
            borderColor: "#90caf9",
          },
        },
        notchedOutline: {},
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
    fontFamily: `"Open Sans", "Helvetica", "Arial", sans-serif`,
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
      fontFamily: `"Open Sans", "Helvetica", "Arial", sans-serif`,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 600,
      color: "#101010",
    },
    title: {
      fontSize: 32,
      fontWeight: 700,
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
      color: "#4992FF",
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
      color: "#4992FF",
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
      color: "#4992FF",
    },
    error: {
      fontSize: "16px",
      color: "#FF540B",
    },
  },
});
