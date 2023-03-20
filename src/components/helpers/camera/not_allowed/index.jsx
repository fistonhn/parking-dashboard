import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './not_allowed.module.sass';

const CameraNotAllowed = () => {
  return (
    <div className={`${styles.stream} `} >
      <FontAwesomeIcon className={styles.lock} icon={faLock} />
      <p className={styles.notallowed}>Not Allowed</p>
    </div>
  );
};

export default CameraNotAllowed;
