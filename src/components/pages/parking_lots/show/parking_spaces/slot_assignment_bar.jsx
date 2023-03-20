import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import MultiSelect from 'react-select';
import { ParkingPlanContext } from './index';
import { ReactComponent as TimesIcon } from 'assets/times_icon.svg';

const SlotAssignmentBar = (props) => {
  const parkingPlanContext = useContext(ParkingPlanContext);

  const { list, drawedSlotContainer } = parkingPlanContext.state;
  const { cancelMarkingSlotOnParkingPlan } = parkingPlanContext.func;
  const { onChange } = props;

  return (
    <div className="card py-2 px-3">
      <Row className="justify-content-center align-items-center">
        <Col xs={10}>
          <MultiSelect
            options={list.filter(slot => {
              if (!slot.coordinate_parking_plan) {
                return !drawedSlotContainer.some(drawedSlot => drawedSlot.parking_slot_id === slot.id);
              }
              return false;
            }).map(slot => ({ value: slot.id, label: slot.name }))
            }
            placeholder="Space ID"
            onChange={onChange}
          />
        </Col>
        <Col xs={2} className="p-0">
          <TimesIcon className="pointer" onClick={cancelMarkingSlotOnParkingPlan}/>
        </Col>

      </Row>
    </div>
  );
};

SlotAssignmentBar.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default SlotAssignmentBar;
