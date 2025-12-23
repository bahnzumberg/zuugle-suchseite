import CustomSelect from "./CustomSelect";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface AutosuggestSearchProps {
  showSearchModal: boolean;
  setShowSearchModal: (value: boolean) => void;
}

const AutosuggestSearch = ({
  showSearchModal,
  setShowSearchModal,
}: AutosuggestSearchProps) => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const style = {
    borderRadius: "18px",
  };

  return (
    <Dialog
      open={showSearchModal}
      onClose={() => {
        setShowSearchModal(false);
      }}
      fullScreen={fullScreen}
      sx={{
        "& .MuiDialog-paper": style,
        "& .MuiDialog-container": {
          alignItems: "flex-start", // stick to top
        },
        "& .MuiPaper-root": {
          mt: 4, // add some margin from top
        },
      }}
      className={"my-modal"}
      fullWidth
      maxWidth={"sm"}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          {t("search.search")}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          setShowSearchModal(false);
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
        <CustomSelect setShowSearchModal={setShowSearchModal} />
      </DialogContent>
    </Dialog>
  );
};

export default AutosuggestSearch;
