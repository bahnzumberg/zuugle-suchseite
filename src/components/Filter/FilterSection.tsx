import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface FilterSectionProps {
  title: string;
  toggleLabel: string;
  onToggleAll: () => void;
  children: React.ReactNode;
  showSection: boolean;
}

export default function FilterSection({
  title,
  toggleLabel,
  onToggleAll,
  children,
  showSection,
}: FilterSectionProps) {
  if (!showSection) {
    return null;
  }

  return (
    <Box className="filter-box border" sx={{ paddingTop: "20px" }}>
      <Typography variant="subtitle1">
        {title}{" "}
        <Typography
          className="cursor-link"
          sx={{ fontSize: "14px" }}
          onClick={onToggleAll}
        >
          {toggleLabel}
        </Typography>
      </Typography>
      <Grid container sx={{ paddingTop: "16px" }}>
        {children}
      </Grid>
    </Box>
  );
}
