import React from 'react';
import { connect } from 'react-redux';

import Modal from "@mui/material/Modal";
import {hideModal} from "../actions/modalActions";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Close from "../icons/Close";
import ChevronLeft from "../icons/ChevronLeft";
import TextWithIcon from "./TextWithIcon";

const style = {
    overflowY: "scroll",
    overflowX: "hidden",
    height: "90%",
    display: "block",
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -10%)',
    maxWidth: "600px",
    bgcolor: '#FFF',
    border: '1px solid rgba(0,0,0,0.01)',
    boxShadow: 24,
    borderRadius: "20px"

};


const MyModal = ({ title, size, content, hideModal, onBack }) => {
    return <Modal open={true} onClose={hideModal}>
            <Box sx={style} className={"my-modal"}>
                {!!onBack ? <Box>
                        <Box sx={{padding: "20px"}} onClick={onBack}>
                            <TextWithIcon iconLeft={ <ChevronLeft style={{stroke: "#000000", fill: "#000000", strokeWidth: 1}}/>} text={"Zurück"}></TextWithIcon>
                        </Box>
                    </Box> :
                    <Box sx={{position: "absolute", right: "20px", top: "20px", width: "40px", height: "40px", backgroundColor: "#EAEAEA", borderRadius: "12px"}}>
                        <Box sx={{padding: "8px"}} onClick={hideModal}>
                            <Close style={{stroke: "#000000", strokeWidth: 1}}/>
                        </Box>
                    </Box>
                }
                {
                    !!title && <Box sx={{padding: "20px"}}>
                        <Typography sx={{textAlign: "center", lineHeight: "40px", fontSize: "18px", fontWeight: 600}}>{title}</Typography>
                    </Box>
                }

                <Box sx={{borderTop: "1px solid #EAEAEA"}}>
                    { content }
                </Box>
            </Box>
        </Modal>
}

export default connect(null, { hideModal })(MyModal)