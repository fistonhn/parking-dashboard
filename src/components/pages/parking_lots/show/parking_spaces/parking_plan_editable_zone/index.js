import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';
import ParkingSlotCircle from '../parking_slot_circle';
import SlotAssignmentBar from '../slot_assignment_bar';
import {
  markSlotOnParkingPlan
} from '../mouse_events';
import styles from '../parking_plans.module.sass';
import { ParkingPlanContext } from '../index';

const ParkingPlanEditableZone = (props) => {
  const parkingPlanContext = useContext(ParkingPlanContext);
  const { mapRef, multiSelectContainerRef } = parkingPlanContext.func;
  const { applyMarkingSlotOnParkingPlan } = parkingPlanContext.func;
  const { isEditing, newCircleInfo, drawedSlotContainer, list, isMovingExistingSlot, slotIdClicked } = parkingPlanContext.state;
  const { parkingPlanImageURL } = props;
  const cursorClass = isEditing ? isMovingExistingSlot ? 'grabbing' : styles.followCircle : '';
  const showSlotAssignmentBar = !isEmpty(newCircleInfo) ? '' : 'd-none';
  return (
    <React.Fragment>
      <div
        ref={mapRef}
        className={`user-select-none map-boundaries position-relative ${styles.imageMap} ${cursorClass}`}
        onClick={markSlotOnParkingPlan.bind(parkingPlanContext.func)}
      >
        <div ref={multiSelectContainerRef} className={`${styles.CircleBarContainer} ${showSlotAssignmentBar} position-absolute`}>
          <SlotAssignmentBar
            onChange={applyMarkingSlotOnParkingPlan}
          />
        </div>
        <img src={parkingPlanImageURL} className="pointer-events-none" alt="Layout Parking Space"/>
        {
          drawedSlotContainer.map(element => {
            const slot = list.find(slot => slot.id === element.parking_slot_id);
            const colorCircle = slot ? slot.status === 'free' ? 'bg-green' : 'bg-red' : 'bg-grey-dark';
            return (
              <ParkingSlotCircle
                key={slot && slot.id}
                backgroundColor={colorCircle}
                slot={slot}
                element={element}
                shouldShowInfoBar={slot && isEditing && !isMovingExistingSlot && slotIdClicked === slot.id}
              />
            );
          })
        }
      </div>
    </React.Fragment>
  );
};

ParkingPlanEditableZone.propTypes = {
  parkingPlanImageURL: PropTypes.string.isRequired
};

export default ParkingPlanEditableZone;
