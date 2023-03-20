import React, { useContext } from 'react';
import { Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { ReactComponent as UploadIcon } from 'assets/upload.svg';

import { ParkingPlanContext } from '../../index';
import Dropdown from 'components/base/dropdown';
import Button from 'components/base/button';
import styles from './layout_dropdown.module.sass';

const LayoutDropdown = ({ hasAddButton }) => {
  const parkingPlanContext = useContext(ParkingPlanContext);

  const {
    parkingPlans,
    selectedIndexParkingPlan
  } = parkingPlanContext.state;

  const {
    selectIndexParkingPlan,
    addNewMap
  } = parkingPlanContext.func;

  const parkingPlan = parkingPlans[selectedIndexParkingPlan];
  if (!parkingPlan) {
    if (!hasAddButton) return null;
    return (
      <Col xs="12" lg="auto" className={styles.uploadLayout}>
        <Button
          status="secondary"
          onClick={addNewMap}
          className={styles.btnAddLayout}
        >
          <UploadIcon className="mr-2"/>
          Add a Layout
        </Button>
      </Col>
    );
  }
  const customOptions = hasAddButton ? [{
    label: '+ ADD NEW',
    onClick: addNewMap,
    className: styles.layoutOptionAddNew
  }] : [];
  return (
    <Col xs="12" lg="auto" className={styles.uploadLayout}>
      <Dropdown
        options={parkingPlans.map(({ name }, i) => ({ value: i, label: name }))}
        customOptions={customOptions}
        value={{ value: selectedIndexParkingPlan, label: parkingPlan.name }}
        onChange={(selectedOption) => selectIndexParkingPlan(selectedOption.value)}
        className={styles.layoutDropdown}
        selectedOptionClassName={styles.layoutSelectedOption}
      />
    </Col>
  );
};

LayoutDropdown.propTypes = {
  hasAddButton: PropTypes.bool.isRequired
};

export default LayoutDropdown;
