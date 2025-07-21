import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { hideModal } from "../actions/modalActions";
import { IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const MyModal = ({
  title,
  srhBoxScrollH,
  content,
  hideModal,
  onBack,
  sourceCall,
}: {
  title: string;
  srhBoxScrollH: number;
  content: JSX.Element;
  hideModal: () => void;
  onBack: () => void;
  sourceCall: string;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const style = {
    overflowX: "hidden",
    display: "block",
    position: "absolute",
    top: { xs: 0, sm: !title ? srhBoxScrollH - 80 : "50%" },
    bottom: { xs: "0", sm: "auto" },
    left: "50%",
    transform: {
      xs: "translate(-50%, 0)",
      sm: title ? "translate(-50%, -50%)" : "translate(-50%, 0)",
    },
    margin: 0,
    borderRadius: "18px",
  };

  return (
    <Dialog
      open={true}
      onClose={hideModal}
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={"sm"}
      sx={{ "& .MuiDialog-paper": style }}
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {title ||
            (sourceCall == "city"
              ? t("start.heimatbahnhof")
              : t("start.suche"))}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onBack || hideModal}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers={title ? true : false} className={"my-modal"}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, { hideModal })(MyModal);
