import React from 'react';
import { Alert } from 'reactstrap';

const AlertError = (props) => {
  const { message } = props;
  return (
    <Alert time={Date.now()} color="danger">
      {message}
    </Alert>
  );
};

export default AlertError;
