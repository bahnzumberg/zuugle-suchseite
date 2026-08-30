import { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SxProps, Theme, useTheme } from "@mui/material/styles";

interface SearchBarButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  sx?: SxProps<Theme>;
}

const TRANSITION =
  "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out";

/**
 * An action button in the search bar: icon plus label, collapsing to an
 * icon-only button on xs screens. Callers supply their own colours via `sx`.
 */
export default function SearchBarButton({
  icon,
  label,
  onClick,
  variant,
  sx,
}: SearchBarButtonProps) {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.only("xs"));
  const callerSx = Array.isArray(sx) ? sx : [sx];

  if (isXsScreen) {
    return (
      <IconButton
        onClick={onClick}
        aria-label={label}
        sx={[{ height: 40, width: 40, transition: TRANSITION }, ...callerSx]}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <Button
      onClick={onClick}
      aria-label={label}
      variant={variant}
      startIcon={icon}
      sx={[
        { height: 40, minWidth: 100, fontWeight: 700, transition: TRANSITION },
        ...callerSx,
      ]}
    >
      {label}
    </Button>
  );
}
