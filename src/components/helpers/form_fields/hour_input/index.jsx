import React, { useState } from 'react';
import { asField } from 'informed';
import { ReactComponent as Error } from 'assets/error_icon.svg';
import { Col, Row } from 'reactstrap';
import styles from './hour_input.module.sass';

const HourInput = asField(({ fieldApi, events = {}, ...props }) => {
  const { setValue } = fieldApi;
  const { time_from, field, fieldState } = props;

  const [startTime, setStartTime] = useState(fieldState?.value);
  const [err, setErr] = useState(null);

  const handleStartChange = (e) => {
    if (field === 'parking_hour_to' && time_from) {
      if (time_from < e.target.value) {
        setErr(null);
        setValue(e.target.value);
        setStartTime(e.target.value);
        events.onChange && events.onChange();
      } else {
        setErr('“Time To” must always be later than the “Time From”');
      }
      return;
    }

    setValue(e.target.value);
    setStartTime(e.target.value);
    events.onChange && events.onChange();
  };

  return (
    <Row>
      <Col sm={12} md={12}>
        {err && (
          <div className="d-flex">
            <Error className={styles.WarningIcon}/>
            <div className="text-left general-error general-text-1 pb-1">
              {err}
            </div>
          </div>
        )}
        <input
          className={styles.time}
          onChange={handleStartChange}
          value={startTime}
          type='time'
        />
      </Col>
    </Row>
  );
});

export default HourInput;
