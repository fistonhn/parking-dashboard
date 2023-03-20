import React, { useContext } from 'react';

import { ParkingPlanContext } from '../../index';
import TooltipInfo from 'components/helpers/tooltip_info';
import Toggle from 'components/base/toggle';
import styles from './markup_toggle.module.sass';

const EnableButton = () => {
  const parkingPlanContext = useContext(ParkingPlanContext);

  const {
    isEditing,
    parkingPlans,
    selectedIndexParkingPlan
  } = parkingPlanContext.state;

  const {
    toggleEdit
  } = parkingPlanContext.func;

  return (
    <div className={styles.toggleWrapper}>
      <TooltipInfo
        text="Edit Mode allows you to create, update or delete markups on the parking lot layout screen."
        target="recipients"
      />
      <span className="general-text-2">Markup Mode</span>
      <Toggle
        value={isEditing}
        onChange={toggleEdit}
        disabled={!parkingPlans[selectedIndexParkingPlan]}
      />
    </div>
  );
};

export default EnableButton;
