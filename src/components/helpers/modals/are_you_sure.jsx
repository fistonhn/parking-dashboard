import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const ConfirmationModal = (props) => {
  const { title, text, footer, accept, cancel, isOpen, cancelText, size } = props;

  return (
    <Modal isOpen={isOpen} toggle={cancel} size={size} centered={true} >
      <ModalHeader toggle={cancel} className=" h2-title justify-content-center">{title}</ModalHeader>
      <ModalBody className="p-4">
        <div>
          {text}
        </div>
        <div className="text-center mt-4">
          <div className="text-left mb-2">
            {footer}
          </div>

          <Button onClick={accept} className="mr-3" color="primary" type="submit">
            Delete
          </Button>
          <Button onClick={cancel} color="secondary">
            { cancelText ? cancelText : 'Cancel'}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmationModal;
