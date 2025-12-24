import "@mui/material/styles";
import { TypographyStyle } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Components {
    MuiPickersOutlinedInput?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
  }

  interface TypographyVariants {
    subtitle3: React.CSSProperties;
    title: React.CSSProperties;
    cardTitle: React.CSSProperties;
    grayP: React.CSSProperties;
    blueP: React.CSSProperties;
    blackP: React.CSSProperties;
    h5alt: React.CSSProperties;
    infoKey: React.CSSProperties;
    text: React.CSSProperties;
    textSmall: React.CSSProperties;
    link: React.CSSProperties;
    error: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    subtitle3?: TypographyStyle;
    title?: TypographyStyle;
    cardTitle?: TypographyStyle;
    grayP?: TypographyStyle;
    blueP?: TypographyStyle;
    blackP?: TypographyStyle;
    h5alt?: TypographyStyle;
    infoKey?: TypographyStyle;
    text?: TypographyStyle;
    textSmall?: TypographyStyle;
    link?: TypographyStyle;
    error?: TypographyStyle;
  }

  interface Palette {
    white: Palette["primary"];
  }

  interface PaletteOptions {
    white?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    title: true;
    cardTitle: true;
    grayP: true;
    blueP: true;
    blackP: true;
    h5alt: true;
    infoKey: true;
    text: true;
    textSmall: true;
    link: true;
    error: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    white: true;
  }
}
