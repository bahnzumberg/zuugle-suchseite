import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  FavoritesNotice as Notice,
  noticeDismissed,
} from "../../features/favoritesSlice";

/**
 * How each notice is presented. The "your favorites were rebuilt here" messages
 * are a paragraph the user has to read; the rest are short confirmations.
 */
const PRESENTATION: Record<
  Notice["key"],
  { severity: AlertColor; durationMs: number }
> = {
  save_failed: { severity: "error", durationMs: 6000 },
  recreated: { severity: "warning", durationMs: 15000 },
  recreate_failed: { severity: "error", durationMs: 15000 },
  merged: { severity: "success", durationMs: 6000 },
  merged_none: { severity: "success", durationMs: 6000 },
  merged_sent: { severity: "success", durationMs: 6000 },
};

export default function FavoritesNotice() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const notice = useAppSelector((state) => state.favorites.notice);

  if (!notice) return null;

  const dismiss = () => dispatch(noticeDismissed());
  const { severity, durationMs } = PRESENTATION[notice.key];

  return (
    <Snackbar
      open
      autoHideDuration={durationMs}
      onClose={dismiss}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={dismiss}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {/* i18next only looks for plural variants when `count` is defined, so
            the uncounted keys are unaffected by passing it through. */}
        {t(`favorites.notice.${notice.key}`, { count: notice.count })}
      </Alert>
    </Snackbar>
  );
}
