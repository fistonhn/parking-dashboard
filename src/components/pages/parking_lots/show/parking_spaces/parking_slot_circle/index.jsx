import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Col } from 'reactstrap';
import Draggable from 'react-draggable';
import { ReactComponent as InfoIcon } from 'assets/info_icon.svg';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';
import SlotAssignmentBar from '../slot_assignment_bar';

import styles from '../parking_plans.module.sass';
import localStyles from './parking_slot_circle.module.sass';

import { ParkingPlanContext } from '../index';

const circleSize = {
  width: '30px',
  height: '30px'
};

const isCSSIdValid = (id) => (
  (/^[A-Za-z]+[\w-:.]*$/).test(id)
);

const Circle = (props) => {
  const parkingPlanContext = useContext(ParkingPlanContext);

  const { onMouseDragOnSlotCircle, onMouseUpOnSlotCircle, clearLocateSlotId } = parkingPlanContext.func;
  const { isEditing, isMovingExistingSlot, locateSlotId } = parkingPlanContext.state;
  const { slot, element, backgroundColor } = props;

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [position] = useState(element); // This is in order
  const toggle = () => setTooltipOpen(!tooltipOpen);

  if (locateSlotId) {
    setTimeout(() => {
      clearLocateSlotId();
    }, 2500);
  }
  const ID = slot ? `Slot${slot.name}` : null;
  const cursorClass = isEditing ? isMovingExistingSlot ? 'grabbing' : 'grab' : '';
  const slotName = slot ? slot.name.length > 3 ? `${slot.name.substring(0, 3)}...` : slot.name : 'Error: Missing';

  return (
    <Draggable
      bounds={'.map-boundaries'}
      onStop={onMouseUpOnSlotCircle}
      onDrag={onMouseDragOnSlotCircle}
      disabled={!isEditing}
    >
      <div
        className={`
          ${cursorClass}
          ${backgroundColor}
          ${locateSlotId === slot && slot.id ? localStyles.pulseCircle : ''}
          position-absolute d-flex justify-content-center align-items-center rounded-circle`}
        id={ID}
        style={{
          top: position.y,
          left: position.x,
          width: circleSize.width,
          height: circleSize.height
        }}
      >
        <p className={`text-white m-0 ${slotName.includes('...') ? 'pl-2' : ''}`}>{slotName}</p>
        {
          isCSSIdValid(ID) && !isMovingExistingSlot &&
            <Tooltip placement="top" isOpen={tooltipOpen} target={ID} toggle={toggle}>
              {slot ? slot.name : 'Error: Missing' }
            </Tooltip>
        }
      </div>
    </Draggable>
  );
};

const ParkingSlotCircle = (props) => {
  const parkingPlanContext = useContext(ParkingPlanContext);
  const {
    onMouseDownOnSlotCircle,
    showCircleDrawSlowInfo,
    applyMarkingSlotOnParkingPlan,
    editParkingSlotCircle,
    setSessionRecords,
    toggleCircleConfirmationModal
  } = parkingPlanContext.func;
  const { isChangingIdToExistingSlot } = parkingPlanContext.state;

  const { slot, element, shouldShowInfoBar } = props;

  const currentStyles = isChangingIdToExistingSlot ? styles.CircleBarContainer : `${styles.CircleBarContainer} d-flex flex-row justify-content-around align-items`;
  return (
    <React.Fragment>
      {
        shouldShowInfoBar && (
          <div
            className={`${currentStyles} position-absolute card`}
            style={{
              top: element.y + 'px',
              left: element.x + 40 + 'px'
            }}
          >
            {
              isChangingIdToExistingSlot ? (
                <SlotAssignmentBar {...props} onChange={applyMarkingSlotOnParkingPlan}/>
              ) : (
                <React.Fragment>
                  <Col className="h2-title d-flex justify-content-center align-items-center">
                    {slot ? slot.name : 'Error: Missing'}
                  </Col>
                  <Col className="d-flex flex-row justify-content-around align-items-center">
                    <InfoIcon width="20" height="20" onClick={() => setSessionRecords(slot.active_parking_session)} className="pointer mr-2"/>
                    <EditIcon width="20" height="20" onClick={editParkingSlotCircle} className={`svg-dark pointer mr-2`}/>
                    <TrashIcon width="20" height="20" onClick={() => toggleCircleConfirmationModal(slot.id)} color="red" className="pointer"/>
                  </Col>
                </React.Fragment>
              )
            }
          </div>
        )
      }
      <span
        onMouseDown={() => onMouseDownOnSlotCircle(slot.id)}
        onClick={() => showCircleDrawSlowInfo(slot.id)}
      >
        <Circle {...props} />
      </span>
    </React.Fragment>
  );
};

ParkingSlotCircle.propTypes = {
  slot: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  shouldShowInfoBar: PropTypes.bool.isRequired
};

export default ParkingSlotCircle;
