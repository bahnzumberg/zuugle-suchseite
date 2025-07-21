import React, { Component } from "react";
import { connect } from "react-redux";

import MyModal from "./MyModal";
import { hideModal, showModal } from "../actions/modalActions";

export interface ModalComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CustomComponent: any;
  title: string;
  srhBoxScrollH: number;
  hideModal: () => void;
  onBack: () => void;
  sourceCall: string;
}
class ModalComponent extends Component<ModalComponentProps> {
  constructor(props: ModalComponentProps) {
    super(props);

    this.state = {};

    this.onSubmitted = this.onSubmitted.bind(this);
  }

  onSubmitted() {
    this.props.hideModal();
  }

  render() {
    const { CustomComponent } = this.props;
    const content = (
      <div className="">
        <CustomComponent {...this.props} onSubmitted={this.onSubmitted} />
      </div>
    );

    return (
      <MyModal
        title={this.props.title}
        srhBoxScrollH={this.props.srhBoxScrollH}
        content={content}
        onBack={this.props.onBack}
        sourceCall={this.props.sourceCall}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStateToProps(state: any) {
  return {
    company: state.auth,
  };
}

export default connect(mapStateToProps, { hideModal, showModal })(
  ModalComponent,
);
