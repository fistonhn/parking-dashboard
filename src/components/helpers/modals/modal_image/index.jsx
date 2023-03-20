import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import styles from './index.sass';

const ImageModal = (props) => {
  const { image, isOpen, toggleModal } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" centered={true} className={styles.modal}>
      <ModalBody className={styles.modalBody}>
        <div className="text-center generel-text-1">
          <img className="image" src={image} alt="" />
        </div>
      </ModalBody>
    </Modal>
  );
};

ImageModal.prototype = {
  image: PropTypes.string,
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func
};

export default ImageModal;
