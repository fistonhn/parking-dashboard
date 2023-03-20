import React, { useState } from 'react';
import _ from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Col, FormGroup } from 'reactstrap';
import { updateMe } from 'api/users';
import { fromJson as showErrors } from 'components/helpers/errors';

const ChangePasswordModal = function (props) {
  const {
    toggleModal,
    isOpen,
    currentUser,
    addAlertMessages
  } = props;
  const [old_password, setOldPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [new_password_confirmation, setNewPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const resetInputs = () => {
    setNewPasswordConfirmation('');
    setNewPassword('');
    setOldPassword('');
    setErrorMessage([]);
  };

  const savePassword = () => {
    if (!new_password || !new_password_confirmation || !old_password) {
      setErrorMessage({ password: ['Please fill up all inputs'] });
      return;
    }

    if (new_password !== new_password_confirmation) {
      setErrorMessage({ password: ['Password confirmation doesn\'t match'] });
      return;
    }

    updateMe({
      ...currentUser,
      old_password,
      password: new_password
    })
      .then(({ data }) => {
        addAlertMessages([{
          type: 'Success',
          text: 'Your password has being changed succesfully'
        }]);
        toggleModal();
        resetInputs();
      })
      .catch(error => {
        setErrorMessage({ password: _.get(error, 'response.data.errors') });
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" centered>
      <ModalHeader className="justify-content-center border-0 pt-5">CHANGE PASSWORD</ModalHeader>
      <ModalBody>
        <Col md={10} className="mx-auto ">
          {showErrors(errorMessage)}
          <FormGroup row >
            <Label md={4}>
              Old Password:
            </Label>
            <Col md={8}>
              <Input
                id="old_password"
                type="password"
                value={old_password}
                name="old_password"
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder=""
                required
              />
            </Col>
          </FormGroup>
        </Col>
        <Col md={10} className="mx-auto ">
          <FormGroup row >
            <Label md={4}>
              New Password:
            </Label>
            <Col md={8}>
              <Input
                id="new_password"
                type="password"
                value={new_password}
                name="new_password"
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder=""
                required
              />
            </Col>
          </FormGroup>
        </Col>
        <Col md={10} className="mx-auto ">
          <FormGroup row >
            <Label md={4}>
              Confirmation Password:
            </Label>
            <Col md={8}>
              <Input
                id="new_password_confirmation"
                type="password"
                value={new_password_confirmation}
                name="new_password_confirmation"
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                placeholder=""
                required
              />
            </Col>
          </FormGroup>
        </Col>
      </ModalBody>
      <ModalFooter className="justify-content-center border-0 pb-5">
        <Button color="danger" className="px-5 py-2 mx-2" onClick={() => {
          resetInputs();
          toggleModal();
        }}>Cancel</Button>
        <Button color="success" className="px-5 py-2 mx-2 my-4" onClick={savePassword}>Save</Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default ChangePasswordModal;
