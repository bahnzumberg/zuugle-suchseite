import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { noticeDismissed } from "../../features/favoritesSlice";

// The "your favorites were rebuilt here" message is a paragraph the user has to
// read; the rest are short confirmations.
const LONG_NOTICES = new Set(["recreated", "recreate_failed"]);

export default function FavoritesNotice() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const notice = useAppSelector((state) => state.favorites.notice);

  if (!notice) return null;

  const dismiss = () => dispatch(noticeDismissed());

  // Only the counted keys may be given a count: passing one to a key without
  // plural forms would send i18next looking for a `_other` variant.
  const message =
    notice.count === undefined
      ? t(`favorites.notice.${notice.key}`)
      : t(`favorites.notice.${notice.key}`, { count: notice.count });

  return (
    <Snackbar
      open
      autoHideDuration={LONG_NOTICES.has(notice.key) ? 15000 : 6000}
      onClose={dismiss}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={dismiss}
        severity={notice.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
