import React, { useState } from 'react';
import { asField } from 'informed';
import { Col, Row, Label } from 'reactstrap';
import styles from './hour_input.module.sass';

const HourRangeInput = asField(({ fieldState, fieldApi, events = {}, ...props }) => {
  const { setValue } = fieldApi;
  const { value } = fieldState;
  const { initialValues, field } = props;

  const setInitialValues = (initialValues, field_name) => {
    if (!initialValues || !initialValues.from || !initialValues.to) {
      return [null, null];
    }
    let from = null; let to = null;

    if (initialValues.from) {
      from = initialValues.from;
    }

    if (initialValues.to) {
      to = initialValues.to;
    }
    return [from, to];
  };

  const [initialStartTime, initialEndTime] = setInitialValues(initialValues, field);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const handleStartChange = (e) => {
    setValue({
      from: e.target.value,
      to: endTime
    });
    setStartTime(e.target.value);
    setEndTime(endTime);
    events.onChange && events.onChange();
  };

  const handleEndChange = (e) => {
    setValue({
      from: startTime,
      to: e.target.value
    });
    setEndTime(e.target.value);
    setStartTime(startTime);
    events.onChange && events.onChange();
  };

  return (
    <Row>
      <Col sm={12} md={6}>
        <Label className="mr-1">
            From:
        </Label>
        <input
          className={styles.time}
          onChange={handleStartChange}
          value={startTime}
          type='time'
        />
      </Col>
      <Col sm={12} md={6}>
        <Label className="mr-1">
          To:
        </Label>
        <input
          className={styles.time}
          onChange={handleEndChange}
          value={endTime}
          type='time'
        />
      </Col>
    </Row>
  );
});

export default HourRangeInput;
