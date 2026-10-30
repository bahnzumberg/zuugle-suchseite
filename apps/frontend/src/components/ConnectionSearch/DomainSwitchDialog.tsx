import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { getLocalizedCountryInText } from "../../utils/domainSwitch";

export interface DomainSwitchDialogProps {
  open: boolean;
  targetCountryCode: string;
  targetDomainHost: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DomainSwitchDialog({
  open,
  targetCountryCode,
  targetDomainHost,
  onConfirm,
  onCancel,
}: DomainSwitchDialogProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "de";

  const countryName = getLocalizedCountryInText(
    targetCountryCode,
    t,
    currentLang,
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            p: { xs: 1, sm: 1.5 },
          },
        },
      }}
      aria-labelledby="domain-switch-dialog-title"
    >
      <DialogTitle
        id="domain-switch-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        {t("details.domain_switch_title")}
        <IconButton
          size="small"
          onClick={onCancel}
          aria-label={t("details.domain_switch_cancel")}
          sx={{ color: "grey.500" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 500,
            color: "#222",
            mb: 1,
          }}
        >
          {t("details.domain_switch_message", { country: countryName })}
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "#666" }}>
          {t("details.domain_switch_subtext", { domain: targetDomainHost })}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            color: "#555",
            borderColor: "#ccc",
            "&:hover": { borderColor: "#999", bgcolor: "#f5f5f5" },
          }}
        >
          {t("details.domain_switch_cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "var(--bzb-akelei)",
            "&:hover": { bgcolor: "#5a1d61" },
          }}
        >
          {t("details.domain_switch_action", { domain: targetDomainHost })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
