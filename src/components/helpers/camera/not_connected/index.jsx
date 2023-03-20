import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from './not_connected.module.sass';

const CameraNotConnected = () => {
  return (
    <div className={`${styles.stream} `} >
      <FontAwesomeIcon className={styles.exclamation} icon={faExclamationTriangle} />
      <p className={styles.noconnection}>Camera not connected</p>
    </div>
  );
};

export default CameraNotConnected;
