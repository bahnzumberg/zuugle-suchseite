import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import { CustomIcon } from "../../icons/CustomIcon";

export interface MobileModalProps {
  showMobileModal: boolean;
  setShowMobileModal: (value: boolean) => void;
  setShowSearchModal: (value: boolean) => void;
  setShowCitySearch: (value: boolean) => void;
}

export const MobileModal = ({
  showMobileModal,
  setShowMobileModal,
  setShowSearchModal,
  setShowCitySearch,
}: MobileModalProps) => {
  const { t } = useTranslation();
  const style = {
    borderRadius: "18px",
  };
  const city = useSelector((state: RootState) => state.search.city);
  const searchPhrase = useSelector(
    (state: RootState) => state.search.searchPhrase,
  );

  return (
    <Dialog
      open={showMobileModal}
      onClose={() => {
        setShowMobileModal(false);
      }}
      fullScreen={true}
      sx={{ "& .MuiDialog-paper": style }}
      className={"my-modal"}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          {t("search.search")}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          setShowMobileModal(false);
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 6, // spacing between fields
            // width: 300, // optional fixed width
            margin: "0 auto", // center horizontally
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label={t("start.suche")}
            placeholder={searchPhrase || t("start.suche")}
            variant="outlined"
            fullWidth
            onClick={() => {
              setShowMobileModal(false);
              setShowSearchModal(true);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CustomIcon name="searchIcon" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label={t("search.dein_heimatbahnhof")}
            placeholder={city?.label || t("start.heimatbahnhof")}
            variant="outlined"
            fullWidth
            onClick={() => {
              setShowMobileModal(false);
              setShowCitySearch(true);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CustomIcon
                      name="transportTrain"
                      style={{
                        strokeWidth: "1px",
                        fill: "#000",
                        stroke: "none",
                        marginRight: "8px", // optional spacing between SVG and text
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
