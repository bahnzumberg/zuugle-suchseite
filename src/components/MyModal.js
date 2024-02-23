import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import Modal from "@mui/material/Modal";
import { hideModal } from "../actions/modalActions";
import Box from "@mui/material/Box";
import { Divider, IconButton, Typography } from "@mui/material";
import Close from "../icons/Close";


const MyModal = ({ title, size, srhBoxScrollH, page, content, hideModal, onBack, sourceCall}) => {
  const { t } = useTranslation();
  
  const style = {
    overflowY: "scroll",
    overflowX: "hidden",
    display: "block",
    position: "absolute",
    top: { xs: 0, sm: !title ? (srhBoxScrollH-80) : "50%" },
    bottom: { xs: "0", sm: "auto" },
    left: "50%",
    transform: {
      xs: "translate(-50%, 0)", sm: title ? "translate(-50%, -50%)" : "translate(-50%, 0)"
    },
    width: "100%",
    maxWidth: "618px",
    minHeight: "484px",
    bgcolor: "#fff",
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.15)",
    border: "0",
    outline: "none",
    borderRadius: "18px",
    padding: "20px 25px",
    boxSizing: "border-box",
  };


 

  return (
    <Modal open={true} onClose={hideModal}>
      <Box sx={style} className={"my-modal"}>
        <Box
          sx={{
            mb: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {!!title ? (
            <Box>
              <Typography
                sx={{
                  textAlign: "center",
                  lineHeight: "40px",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {title}
              </Typography>
            </Box>
          ) :
            (<Typography
              sx={{
                textAlign: "center",
                lineHeight: "40px",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {sourceCall == "city" ?
                t("start.heimatbahnhof")
              :
                t("start.suche")
              }
            </Typography>)
          }


          {!!onBack ? (
            <Box onClick={onBack}>
              <Typography sx={{
                textDecoration: "underline", cursor: "pointer", fontFamily: "Open Sans",
                fontSize: "13px",
                fontWeight: "600",
                lineHeight: "18px",
              }}>
                {t("search.abbrechen")}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                position: "absolute",
                right: "20px",
                top: "20px",
                width: "40px",
                height: "40px",
                backgroundColor: "#EAEAEA",
                borderRadius: "12px",
              }}
            >
              <Box sx={{ padding: "8px" }} onClick={hideModal}>
                <Close style={{ stroke: "#000000", strokeWidth: 1 }} />
              </Box>
            </Box>
          )}

        </Box>
        {!!title && (<Divider />)}
        <Box>
          <Box>{content}</Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default connect(null, { hideModal })(MyModal);
