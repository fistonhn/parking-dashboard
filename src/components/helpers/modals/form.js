import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from 'components/base/button';

const Form = (props) => {
  const {
    toggleModal,
    isOpen,
    onClosed,
    title,
    showSaveButton,
    onClickSave,
    onOpened
  } = props;
  return (
    <Modal isOpen={isOpen} onOpened={onOpened} size='lg' toggle={toggleModal} onClosed={onClosed} >
      <ModalHeader className="mx-auto border-0">{title}</ModalHeader>
      <ModalBody>
        {props.children}
      </ModalBody>
      <ModalFooter className="justify-content-center border-0 pb-4">
        <Button
          status="danger"
          className="mr-4"
          onClick={toggleModal}
          size="md"
        >
          CANCEL
        </Button>
        {showSaveButton &&
          <Button
            status="success"
            onClick={onClickSave}
            size="md"
          >
            SAVE
          </Button>
        }
      </ModalFooter>
    </Modal>
  );
};

export default Form;
