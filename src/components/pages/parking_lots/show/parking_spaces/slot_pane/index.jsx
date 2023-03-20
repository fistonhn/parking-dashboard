import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/helpers/loader';
import { isEmpty } from 'underscore';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import styles from './slot_pane.module.sass';
import { ReactComponent as LocationIcon } from 'assets/location_icon.svg';
import { ReactComponent as RecordsIcon } from 'assets/records_icon.svg';
import { ReactComponent as EllipsiIcon } from 'assets/ellipsi_icon.svg';

import { ParkingPlanContext } from '../index';

const SlotElement = ({ slot }) => {
  const parkingPlanContext = useContext(ParkingPlanContext);
  const { locateSlotOnParkingPlan, setSessionRecords } = parkingPlanContext.func;

  const statusColor = slot.status === 'free' ? 'green' : 'red';

  return (
    <div className={`${styles.parkingSlot} ${styles[`parkingSlot-${statusColor}`]}`}>
      <div className={statusColor} />
      <span className="general-text-1">
        {slot.id}
      </span>
      <div>
        <UncontrolledDropdown>
          <DropdownToggle tag="span" className="pointer">
            <EllipsiIcon width="15" height="15"/>
          </DropdownToggle>
          <DropdownMenu right>
            {
              slot.coordinate_parking_plan && (
                <DropdownItem onClick={() => locateSlotOnParkingPlan(slot.id)} className="p-3 text-grey">
                  <LocationIcon className={`mr-1 svg-dark`} width="20" height="20"/>
                  <span className="general-text-1" >Locate</span>
                </DropdownItem>
              )
            }
            <DropdownItem onClick={() => setSessionRecords(slot.active_parking_session)} className="p-3 text-grey not-allowed">
              <RecordsIcon className={`mr-2 svg-dark`} width="15" height="15" />
              <span className="general-text-1" >Session Records</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
};

SlotElement.propTypes = {
  slot: PropTypes.object.isRequired
};

const SlotPane = () => {
  const parkingPlanContext = useContext(ParkingPlanContext);
  const { list, isRefreshingData } = parkingPlanContext.state;

  if (isRefreshingData) {
    return <Loader/>;
  }
  if (isEmpty(list)) {
    return (
      <p className={`${styles.emptyText} general-text-1`}>
        You don't have any parking space for now.
      </p>
    );
  }
  return (
    <div className={styles.slotPane}>
      {list.map((slot, i) =>
        <SlotElement key={i} slot={slot} />)
      }
    </div>
  );
};

export default SlotPane;
