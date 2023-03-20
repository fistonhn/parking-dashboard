import React from 'react';
import styles from './connecting.module.sass';
import { Spinner } from 'reactstrap';

const CameraConnecting = () => {
  return (
    <div className={`${styles.stream} `} >
      <Spinner color="primary" />
      <p className={styles.connecting}>Connecting</p>
    </div>
  );
};

export default CameraConnecting;
