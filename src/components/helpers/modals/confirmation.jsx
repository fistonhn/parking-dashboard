import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const ConfirmationModal = (props) => {
  const { text, accept, cancel, isOpen, toggleModal, cancelText } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="sm" centered={true} >
      <ModalHeader className="border-0 h2-title justify-content-center">Confirmation</ModalHeader>
      <ModalBody>
        <div className="text-center  generel-text-1">
          {text}
        </div>
        <div className="text-center mt-4">
          <Button onClick={cancel} className="btn btn-danger mr-1">
            { cancelText ? cancelText : 'No'}
          </Button>
          <Button onClick={accept} color="info" type="submit">
            Yes
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmationModal;
