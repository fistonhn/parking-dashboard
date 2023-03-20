import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import Loader from '../loader';
import styles from './fullscreen_loader.module.sass';

const FullscreenLoader = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <Modal isOpen={true} centered={true} className={styles.modal}>
      <Loader />
    </Modal>
  );
};

FullscreenLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default FullscreenLoader;
