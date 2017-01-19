import React, {Component} from 'react';
import Modal from 'react-modal';

import './Modal.scss';

export default class AppModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: "",
            content: ""
        };

        window.eventEmitter.addListener('requestModal', this.openModal.bind(this));
    }

    componentDidMount() {
        Modal.setAppElement("#root");
    }

    openModal(title, content: 'undefined') {
        this.setState({
            visible: true,
            title: title,
            content: content
        });
    }

    closeModal() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <Modal
                isOpen={this.state.visible}
                onRequestClose={this.closeModal.bind(this)}
                className="modal"
                overlayClassName="modal-overlay"
                contentLabel="Modal"
            >
                <h2 className="modal__title">{this.state.title}</h2>
                <p className="modal__content">{this.state.content}</p>
                <div>
                    <button className="modal__btn" onClick={this.closeModal.bind(this)}>Close</button>
                </div>
            </Modal>
        );
    }
}
