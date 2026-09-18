import { useCallback, useEffect, useRef, useState, FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  useCreatePairingCodeMutation,
  useGetFavoritesListQuery,
  usePairListMutation,
} from "../../features/apiSlice";
import {
  listKeyCreated,
  noticeShown,
  syncDialogClosed,
} from "../../features/favoritesSlice";
import { useFavorites } from "../../hooks/useFavorites";
import { skipToken } from "@reduxjs/toolkit/query/react";

const CODE_LENGTH = 8;
// The other device is the one that merges; this one only finds out by asking.
const POLL_INTERVAL_MS = 5000;

const groupCode = (code: string) => `${code.slice(0, 4)}-${code.slice(4)}`;

const normalizeInput = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, CODE_LENGTH);

const formatRemaining = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const errorStatus = (error: unknown): number | null =>
  typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status: unknown }).status)
    : null;

function SyncFavoritesDialogContent() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const incomingCode = useAppSelector(
    (state) => state.favorites.syncDialog.incomingCode,
  );
  const { listKey, ensureListKey } = useFavorites();

  const [createPairingCode] = useCreatePairingCodeMutation();
  const [pairList, { isLoading: isPairing }] = usePairListMutation();

  const [pairing, setPairing] = useState<{
    code: string;
    expiresAt: number;
  } | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pairError, setPairError] = useState<string | null>(null);
  const [input, setInput] = useState(() =>
    incomingCode ? normalizeInput(incomingCode) : "",
  );
  const [now, setNow] = useState(() => Date.now());
  // The effect below always fetches a code, so the dialog opens on the spinner.
  const [isCreatingCode, setIsCreatingCode] = useState(true);

  // While the dialog is open this device may be merged into from the outside,
  // which only shows up as new tours on the next fetch.
  useGetFavoritesListQuery(listKey ?? skipToken, {
    pollingInterval: POLL_INTERVAL_MS,
  });

  const codeRequestedRef = useRef(false);
  const generateCode = useCallback(async () => {
    codeRequestedRef.current = true;
    setIsCreatingCode(true);
    setCodeError(null);
    try {
      const key = await ensureListKey();
      const result = await createPairingCode(key).unwrap();
      if (result.moved_to) {
        dispatch(listKeyCreated(result.moved_to));
      }
      setPairing({
        code: result.code,
        expiresAt: Date.parse(result.expires_at),
      });
      setNow(Date.now());
    } catch {
      setCodeError(t("favorites.sync.code_failed"));
    } finally {
      setIsCreatingCode(false);
    }
  }, [ensureListKey, createPairingCode, dispatch, t]);

  // A device with no list yet gets an empty one created here — pairing into
  // this device needs a list to point the code at either way.
  useEffect(() => {
    if (codeRequestedRef.current) return;
    void generateCode();
  }, [generateCode]);

  useEffect(() => {
    if (!pairing) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [pairing]);

  const expired = pairing !== null && pairing.expiresAt - now <= 0;
  const syncUrl = pairing
    ? `${window.location.origin}/sync/${pairing.code}`
    : null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPairError(null);
    try {
      const result = await pairList({ code: input, key: listKey }).unwrap();
      dispatch(listKeyCreated(result.key));
      // Only what this device gained is worth counting out; if it gained
      // nothing, the message still has to distinguish two lists that were
      // identical from one that was already a superset of the other.
      dispatch(
        result.received > 0
          ? noticeShown({
              key: "merged",
              severity: "success",
              count: result.received,
            })
          : noticeShown({
              key: result.sent > 0 ? "merged_sent" : "merged_none",
              severity: "success",
            }),
      );
      dispatch(syncDialogClosed());
    } catch (error) {
      const status = errorStatus(error);
      setPairError(
        t(
          status === 409
            ? "favorites.sync.error_domain"
            : status === 404
              ? "favorites.sync.error_invalid"
              : "favorites.sync.error_failed",
        ),
      );
    }
  };

  return (
    <>
      <Typography sx={{ fontSize: "14px", color: "text.secondary", mb: 3 }}>
        {t("favorites.sync.intro")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography
            sx={{ fontSize: "13px", fontWeight: 600, mb: 1.5 }}
            component="h3"
          >
            {t("favorites.sync.this_code")}
          </Typography>

          {isCreatingCode && <CircularProgress size={28} sx={{ my: 4 }} />}

          {!isCreatingCode && pairing && !expired && syncUrl && (
            <>
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "24px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--bzb-bahnblau)",
                }}
              >
                {groupCode(pairing.code)}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                {t("favorites.sync.expires_in", {
                  time: formatRemaining(pairing.expiresAt - now),
                })}
              </Typography>
            </>
          )}

          {/* No code to show: either it ran out, or issuing one failed. Both
              are recovered the same way. */}
          {!isCreatingCode && (expired || !pairing) && (
            <>
              {codeError ? (
                <Alert severity="error" sx={{ my: 2, textAlign: "left" }}>
                  {codeError}
                </Alert>
              ) : (
                <Typography sx={{ fontSize: "13px", my: 2 }}>
                  {t("favorites.sync.expired")}
                </Typography>
              )}
              <Button
                variant="outlined"
                onClick={() => void generateCode()}
                sx={{ borderRadius: "12px", textTransform: "none" }}
              >
                {t("favorites.sync.new_code")}
              </Button>
            </>
          )}
        </Box>

        <Divider
          flexItem
          orientation="vertical"
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Divider flexItem sx={{ display: { xs: "block", sm: "none" } }} />

        <Box
          component="form"
          onSubmit={submit}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "13px", fontWeight: 600 }} component="h3">
            {t("favorites.sync.enter_code")}
          </Typography>
          <TextField
            value={input.length > 4 ? groupCode(input) : input}
            onChange={(event) => setInput(normalizeInput(event.target.value))}
            placeholder={t("favorites.sync.enter_code_placeholder")}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            slotProps={{
              htmlInput: {
                "aria-label": t("favorites.sync.enter_code"),
                style: {
                  fontFamily: "monospace",
                  fontSize: "20px",
                  letterSpacing: "0.12em",
                  textAlign: "center",
                },
              },
            }}
          />
          {/* Akelei is the theme's secondary, so the label picks up its
              contrastText instead of defaulting to the dark primary one. */}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={input.length !== CODE_LENGTH || isPairing}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isPairing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t("favorites.sync.submit")
            )}
          </Button>
          {pairError && <Alert severity="error">{pairError}</Alert>}
        </Box>
      </Box>

      {/* Centred under both columns: the QR is a second route to the same
          pairing, not something that belongs to either side. */}
      {!isCreatingCode && pairing && !expired && syncUrl && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              p: 1.5,
              bgcolor: "#fff",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <QRCodeSVG value={syncUrl} size={148} level="M" />
          </Box>
          <Typography
            sx={{
              fontSize: "12px",
              color: "text.secondary",
              mt: 1.5,
              maxWidth: "320px",
              textAlign: "center",
            }}
          >
            {t("favorites.sync.qr_code")}
          </Typography>
        </Box>
      )}
    </>
  );
}

export default function SyncFavoritesDialog() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.favorites.syncDialog.open);

  const close = () => dispatch(syncDialogClosed());

  if (!open) return null;

  return (
    <Dialog
      open
      onClose={close}
      fullWidth
      maxWidth="sm"
      aria-labelledby="sync-favorites-title"
    >
      <DialogTitle
        id="sync-favorites-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          fontSize: "18px",
          pr: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CloudSyncRoundedIcon
            sx={{ fontSize: 22, color: "var(--bzb-bahnblau)" }}
          />
          {t("favorites.sync.title")}
        </Box>
        <IconButton
          aria-label={t("details.schliessen")}
          onClick={close}
          size="small"
          sx={{ color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3, pb: 3 }}>
        <SyncFavoritesDialogContent />
      </DialogContent>
    </Dialog>
  );
}
