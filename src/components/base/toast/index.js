import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { Toast as BootstrapToast, ToastHeader } from 'reactstrap';
import { ReactComponent as Done } from 'assets/done_image.svg';
import { ReactComponent as Error } from 'assets/error_image.svg';

import styles from './toast.module.sass';

const Toast = (props) => {
  const { type, text } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <BootstrapToast isOpen={isOpen}>
      <ToastHeader className={`position-relative p-2 ${styles.toastHeader}`} toggle={() => { setIsOpen(false); }}>
        <Row>
          <Col className="d-flex justify-content-center align-items-center" xs={4}>
            {type.toLocaleLowerCase() === 'success' ? <Done/> : <Error/>}
          </Col>
          <Col xs={8} className="pl-0 d-flex flex-column justify-content-center">
            <p className="mb-1 menu-points">
              {type}
            </p>
            <p className="general-text-3">
              {text}
            </p>
          </Col>
        </Row>
      </ToastHeader>
    </BootstrapToast>
  );
};

export default Toast;
