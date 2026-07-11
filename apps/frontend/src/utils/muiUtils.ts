/**
 * MUI-dependent utility hooks.
 * Separated from globals.tsx to avoid pulling MUI into the initial bundle.
 */
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "../theme";

export const useIsMobile = () => useMediaQuery(theme.breakpoints.down("md"));
