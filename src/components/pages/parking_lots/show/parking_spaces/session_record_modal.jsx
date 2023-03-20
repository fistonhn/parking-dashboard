import React from 'react';
import { isEmpty } from 'underscore';
import { displayUnixTimestampWithOffset } from 'components/helpers';
import { withRouter } from 'react-router-dom';

import { Modal, ModalHeader, ModalBody, Col, Row, Button } from 'reactstrap';

const SessionRecordModal = (props) => {
  const { isOpen, toggleModal, currentSessionRecord, history, timeOffset } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} centered={true} size="md">
      <ModalHeader className="border-0 px-5 " toggle={() => toggleModal()} >
        <span className="general-text-1">
          Current parked vehicle:
        </span>
      </ModalHeader>
      <ModalBody className="px-5">
        <Row className="justify-content-center">
          {
            isEmpty(currentSessionRecord) ? (
              <Col className="text-center general-text-1" sm={12} md={9}>
                <strong>There isn't an active session on this parking space</strong>
              </Col>
            ) : (
              <React.Fragment>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Plate Number:</strong> {currentSessionRecord.vehicle.plate_number ? currentSessionRecord.vehicle.plate_number.toUpperCase() : 'NON DETECTED'}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Account:</strong> {currentSessionRecord.user_id }
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Created at:</strong> {displayUnixTimestampWithOffset(currentSessionRecord.created_at, timeOffset)}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Entered at:</strong> {displayUnixTimestampWithOffset(currentSessionRecord.entered_at, timeOffset)}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Parked at:</strong> {displayUnixTimestampWithOffset(currentSessionRecord.parked_at, timeOffset)}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Parking session number:</strong> {currentSessionRecord.id}
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Session Status:</strong> {currentSessionRecord.status }
                </Col>
                <Col className="general-text-1 mb-2" sm={12}>
                  <strong>Paid Status:</strong> {currentSessionRecord.paid }
                </Col>
                <Col className="general-text-1 my-3 justify-content-center d-flex" sm={12}>
                  <Button size="md" onClick={() => history.push(`parking_sessions`)} className="bg-grey-dark" >
                    ALL PARKING RECORDS
                  </Button>
                </Col>
              </React.Fragment>
            )
          }
        </Row>
      </ModalBody>

    </Modal>
  );
};

export default withRouter(SessionRecordModal);
