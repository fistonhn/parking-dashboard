import React, { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import { isEmpty } from 'underscore';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as RecordsIcon } from 'assets/records_icon.svg';
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';

import { ParkingPlanContext } from '../index';
import MarkupToggle from './markup_toggle';
import LayoutDropdown from './layout_dropdown';
import Button from 'components/base/button';
import styles from './upper_panel.module.sass';

const UpperPanel = (props) => {
  const parkingPlanContext = useContext(ParkingPlanContext);

  const {
    parkingPlans,
    selectedIndexParkingPlan
  } = parkingPlanContext.state;

  const {
    editCurrentMap,
    toggleParkingPlanDeleteConfirmationModal
  } = parkingPlanContext.func;

  const { parentPath, history, disabled } = props;

  const deleteParkingPlan = () => {
    if (!isEmpty(parkingPlans)) {
      toggleParkingPlanDeleteConfirmationModal();
    }
  };

  const editParkingPlan = () => {
    if (!isEmpty(parkingPlans)) {
      editCurrentMap();
    }
  };

  const buttonDisabled = !parkingPlans[selectedIndexParkingPlan];
  return (
    <Row className="no-gutters">
      <LayoutDropdown hasAddButton={!disabled} />
      <Col xs="12" lg="auto" className="d-flex flex-lg-grow-1 justify-content-between">
        <div className="d-flex">
          {!disabled &&
            <Button
              status="primary"
              onClick={editParkingPlan}
              className={styles.btnTool}
              icon={<EditIcon width="12" height="12" />}
              disabled={buttonDisabled}
            />
          }
          {!disabled &&
            <Button
              status="danger"
              onClick={deleteParkingPlan}
              className={styles.btnTool}
              icon={<TrashIcon width="12" height="12" className="svg-white" />}
              disabled={buttonDisabled}
            />
          }
          <Button
            status="secondary"
            onClick={() => history.push(`${parentPath}/parking_sessions`)}
            className={styles.btnTool}
            icon={<RecordsIcon width="12" height="12" />}
            disabled={buttonDisabled}
          />
        </div>
        {!disabled && <MarkupToggle />}
      </Col>
    </Row>
  );
};

export default UpperPanel;
