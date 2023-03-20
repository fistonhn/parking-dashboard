import React, { useState, useRef, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Table, Button } from 'reactstrap';
import MultiSelect from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { search as dropdownsSearch } from 'api/dropdowns';

let time = null;

const Recipients = function (props) {
  const {
    toggleModal,
    isOpen,
    recipientsList,
    updateRecipientsList
  } = props;

  const [options, setOptions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [recipientsTmp, setRecipientsTmp] = useState(recipientsList);

  useEffect(() => {
    setRecipientsTmp(recipientsList);
  }, [recipientsList]);

  const inputRef = useRef(null);

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" >
      <ModalHeader className="justify-content-center">Add Notification Recipient</ModalHeader>
      <ModalBody>
        <MultiSelect
          isMulti
          value={[]}
          placeholder="Enter emails here and preser 'Enter'"
          ref={inputRef}
          onKeyDown={(e) => {
            if (time) {
              clearTimeout(time);
            }
            setOptions([{ value: 0, label: 'Loading...' }]);
            time = setTimeout(function () {
              dropdownsSearch('parking_rule-recipient', {
                email: inputRef.current.state.inputValue
              })
                .then(result => {
                  setAdmins(result.data.map(admin => admin.label));
                  setOptions(result.data.map(admin => ({
                    label: admin.label.email,
                    value: admin.label.id
                  })));
                });
            }, 800);
          }}
          isOptionDisabled={(option) => option.value === 0}
          onChange={(selectedOptions) => {
            if (recipientsTmp.every(recipient => recipient.id !== selectedOptions[0].value)) {
              setRecipientsTmp([...recipientsTmp, admins.find(admin => admin.id === selectedOptions[0].value)]);
            }
            return false;
          }}
          options={options}
        />
        <Table className="mt-3 table-striped">
          <thead>
            <tr>
              <th className="selected-point" scope="col">Added Recipients ({recipientsTmp.length}):</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {
              recipientsTmp.map((recipient, index) => {
                return (
                  <tr key={index}>
                    <td>{recipient.name}</td>
                    <td>{recipient.email}</td>
                    <td>{recipient.role.name}</td>
                    <td onClick={() => {
                      const newRecipientsTmp = recipientsTmp;
                      newRecipientsTmp.splice(index, 1);
                      setRecipientsTmp([...newRecipientsTmp]);
                    }}>
                      <FontAwesomeIcon icon={faTimes}/>
                    </td>
                  </tr>

                );
              })
            }
          </tbody>
        </Table>
        <div className="text-center mt-4">
          <Button onClick={toggleModal} className="btn btn-danger mr-1">
            Cancel
          </Button>
          <Button onClick={() => {
            updateRecipientsList(recipientsTmp);
            toggleModal();
          }} color="info" type="submit">
            Save {recipientsTmp.length ? `(${recipientsTmp.length})` : '' }
          </Button>
        </div>
      </ModalBody>

    </Modal>
  );
};

export default Recipients;
