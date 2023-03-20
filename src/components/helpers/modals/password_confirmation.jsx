import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap';
import { checkAdminPassword } from 'api/admins';
import { fromJson as showErrors } from 'components/helpers/errors';

const PasswordConfirmation = function (props) {
  const {
    toggleModal,
    isOpen,
    handleSuccess,
    handleServerError
  } = props;
  const [password_verification, setPasswordVerification] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  return (
    <Modal isOpen={isOpen} toggle={toggleModal} >
      <ModalHeader>Password Verification</ModalHeader>
      <ModalBody>
        {showErrors(errorMessage)}

        <p>We need to verify your identity before change the password </p>
        <Input
          id="password_verification"
          type="password"
          value={password_verification}
          name="password_verification"
          onChange={(e) => setPasswordVerification(e.target.value)}
          placeholder="Password"
          required
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => {
          checkAdminPassword(password_verification)
            .then(({ data }) => {
              if (data.result) {
                handleSuccess();
                toggleModal();
              } else {
                setErrorMessage({ password: ['Password is incorrect, please try again'] });
              }
              setPasswordVerification('');
            })
            .catch(error => handleServerError(error));
        }}>Verify</Button>{' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default PasswordConfirmation;
