import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactFileReader from 'react-file-reader';
import { Modal, ModalHeader, ModalBody, Button, Input, Label, Col, Row } from 'reactstrap';
import TooltipInfo from 'components/helpers/tooltip_info';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './file_layout_modal.css';

const FileLayoutModal = ({ saveParkingPlanFile, isOpen, toggleModal, defaultName, defaultURL }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState(defaultName);
  const [fileURL, setFileURL] = useState(defaultURL);
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    setName(defaultName);
    setFileURL(defaultURL);
  }, [defaultName, defaultURL]);

  const handleSave = () => {
    if (!name || !(file || fileURL)) {
      setDisplayError(true);
      return;
    }
    saveParkingPlanFile(file, name);
    setName('');
    setFile(null);
    toggleModal();
  };

  const handleNameChange = (e) => {
    setName(e.target.value.trim());
  };

  const showNameError = displayError && !name;
  const showFileError = displayError && !file && !fileURL;
  return (
    <Modal centered={true} isOpen={isOpen} toggle={toggleModal} size="md">
      <ModalHeader className="justify-content-center border-0 h2-title">Add New Layout</ModalHeader>
      <ModalBody className={style.modalBody}>
        <Label className="general-text-1 d-block">
          <span className="mr-1 text-primary">*</span>
          Layout Name
        </Label>
        <Input
          id='layoutNameInput'
          className={`form-control ${showNameError ? 'input-error' : ''}`}
          onChange={handleNameChange}
          value={name}
          placeholder="Enter Name Here"
        />
        {showNameError &&
          <div className='general-error general-text-1 mt-1'>Layout Name is required</div>
        }
        <Label className="general-text-1 mt-3 d-block">
          <span className="mr-1 text-primary">*</span>
          Layout Image
        </Label>
        <Row>
          <Col sm={9}>
            <Input
              readOnly
              className={`form-control ${showFileError ? 'input-error' : ''}`}
              value={fileURL || (file ? file.fileList[0].name : 'Image URL')}
            />
            {showFileError &&
              <div className='general-error general-text-1 d-block mt-1'>Layout Image is required</div>
            }
            <div className="general-text-3 mt-1">
              Format for image:  Jpeg, Png
              <TooltipInfo className="ml-2" text="This is the layout image" target="picture" />
            </div>
          </Col>
          <Col className="pl-1" sm={3}>
            <ReactFileReader
              base64={true}
              handleFiles={setFile}
            >
              <Button className="w-100">Browse</Button>
            </ReactFileReader>
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-4 my-4">
          <Button color="danger" className="px-5 py-2 mx-2" onClick={toggleModal}>Cancel</Button>
          <Button color="success" className="px-5 py-2 mx-2" onClick={handleSave}>Save</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

FileLayoutModal.propTypes = {
  saveParkingPlanFile: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  defaultName: PropTypes.string.isRequired,
  defaultURL: PropTypes.string.isRequired
};

export default FileLayoutModal;
