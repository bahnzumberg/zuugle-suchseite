import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomIcon } from "../../icons/CustomIcon";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import { IconName } from "../../icons/icons";

export interface ItineraryAccordionSummaryProps {
  iconName: IconName;
  text1: string;
  text2?: string;
  numberOfTransfers: string;
}

export default function ItineraryAccordionSummary({
  iconName,
  text1,
  text2,
  numberOfTransfers,
}: ItineraryAccordionSummaryProps) {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          minWidth: 0,
          gap: "10px",
          py: "10px",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            backgroundColor: "#4992FF",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomIcon
            name={iconName}
            style={{
              strokeWidth: 0.1,
              stroke: "#FFFFFF",
              fill: "#FFFFFF",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              color: "#8B8B8B",
              lineHeight: "18px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text1}
          </Typography>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 500,
              paddingTop: "3px",
              fontSize: { xs: "18px", sm: "20px" },
              lineHeight: "26px",
              whiteSpace: "nowrap",
            }}
          >
            {text2}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
            pr: "4px",
          }}
        >
          <Typography
            sx={{
              color: "#4992FF",
              fontSize: { xs: "13px", sm: "16px" },
              fontWeight: 600,
              lineHeight: "16px",
              whiteSpace: "nowrap",
            }}
          >
            {numberOfTransfers} {t("details.umstiege")}
          </Typography>
          <CustomIcon
            name="shuffle"
            style={{
              strokeWidth: 0.3,
              stroke: "#4992FF",
              fill: "#4992FF",
              width: "20px",
              height: "20px",
              display: "block",
              overflow: "visible",
            }}
          />
        </Box>
      </Box>
    </AccordionSummary>
  );
}
