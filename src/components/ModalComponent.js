import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MyModal from "./MyModal";
import {hideModal, showModal} from "../actions/modalActions";

class ModalComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.onSubmitted = this.onSubmitted.bind(this);
    }

    onSubmitted() {
        this.props.hideModal();
    }

    render() {
        const {CustomComponent} = this.props;
        const content = (
            <div className="">
                <CustomComponent { ...this.props } onSubmitted={ this.onSubmitted } />
            </div>
        );

        return (
            <MyModal
                style="primary"
                title={ this.props.title }
                page={this.props.page}
                srhBoxScrollH={this.props.srhBoxScrollH}
                content={ content }
                size={!!this.props.modalSize ? this.props.modalSize : "lg"}
                onBack={ this.props.onBack }
            />
        );
    }
}

ModalComponent.contextTypes = {
    router: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        company: state.auth
    };
}

export default connect(mapStateToProps, { hideModal, showModal })(ModalComponent)