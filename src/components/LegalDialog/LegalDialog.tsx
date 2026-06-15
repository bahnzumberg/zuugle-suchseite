import { lazy, Suspense } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

const ImprintContent = lazy(() => import("./ImprintContent"));
const PrivacyContent = lazy(() => import("./PrivacyContent"));

export type LegalDialogType = "imprint" | "privacy" | null;

interface LegalDialogProps {
  open: LegalDialogType;
  onClose: () => void;
}

function LoadingFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <CircularProgress size={32} />
    </Box>
  );
}

export default function LegalDialog({ open, onClose }: LegalDialogProps) {
  const { t } = useTranslation();

  if (!open) return null;

  const title =
    open === "imprint" ? t("start.impressum") : t("start.datenschutz");

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="legal-dialog-title"
    >
      <DialogTitle
        id="legal-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          pr: 1,
        }}
      >
        {title}
        <IconButton
          aria-label={t("details.schliessen")}
          onClick={onClose}
          size="small"
          sx={{ color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Suspense fallback={<LoadingFallback />}>
          {open === "imprint" ? <ImprintContent /> : <PrivacyContent />}
        </Suspense>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {t("details.schliessen")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
