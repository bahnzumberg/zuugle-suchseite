import React from 'react';
import {connect} from 'react-redux';
import ModalComponent from "./ModalComponent";

const MODAL_COMPONENTS = {
    'MODAL_COMPONENT': ModalComponent,
};

const ModalRoot = ({modalType, modalProps}) => {
    if (!modalType) {
        return null;
    }

    const SpecificModal = MODAL_COMPONENTS[modalType]
    return <SpecificModal {...modalProps} />
}

export default connect(
    state => state.modal
)(ModalRoot)