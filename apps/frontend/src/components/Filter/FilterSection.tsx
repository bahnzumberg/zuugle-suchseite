import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useState } from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  showSection: boolean;
  defaultExpanded?: boolean;
  isActive?: boolean;
  headerAction?: React.ReactNode;
}

export default function FilterSection({
  title,
  children,
  showSection,
  defaultExpanded = false,
  isActive = false,
  headerAction,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!showSection) {
    return null;
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      disableGutters
      elevation={0}
      square
      sx={{
        borderTop: "1px solid #EAEAEA",
        mx: "20px",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 0,
          minHeight: 48,
          "&.Mui-expanded": { minHeight: 48 },
          "& .MuiAccordionSummary-content": {
            my: "12px",
            alignItems: "center",
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          {title}
        </Typography>
        {isActive && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#254980",
              mr: 1,
              flexShrink: 0,
            }}
          />
        )}
        {expanded && headerAction && (
          <Box sx={{ ml: "auto", mr: 1 }} onClick={(e) => e.stopPropagation()}>
            {headerAction}
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 2 }}>
        <Grid container>{children}</Grid>
      </AccordionDetails>
    </Accordion>
  );
}
