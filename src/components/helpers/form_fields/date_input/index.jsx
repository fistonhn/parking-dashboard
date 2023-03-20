import React, { useState } from 'react';
import { asField } from 'informed';
import { Col, Row } from 'reactstrap';
import { infinityDatePicker } from 'components/helpers';

const fromStringDateToDate = (stringDate) => {
  const splittedStringDate = stringDate.split('-');
  var day = splittedStringDate[2];
  var month = splittedStringDate[1] - 1;
  var year = splittedStringDate[0];
  return new Date(year, month, day);
};

const setInitialValues = (initialValues, field_name) => {
  if (!initialValues || !initialValues[field_name]) {
    return [null, null];
  }
  let from = null; let to = null;

  if (initialValues[field_name].from) {
    from = typeof (initialValues[field_name].from) === 'object'
      ? fromStringDateToDate(formatDate(initialValues[field_name].from))
      : fromStringDateToDate(initialValues[field_name].from);
  }

  if (initialValues[field_name].to) {
    to = typeof (initialValues[field_name].to) === 'object'
      ? fromStringDateToDate(formatDate(initialValues[field_name].to))
      : fromStringDateToDate(initialValues[field_name].to);
  }
  return [from, to];
};

const formatDate = (date) => {
  if (date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
};

const DateInput = asField(({ fieldState, fieldApi, ...props }) => {
  const { setValue } = fieldApi;
  const { initialValues, field } = props;

  const [initialStartDate, initialEndDate] = setInitialValues(initialValues, field);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  return (
    <Row>
      <Col>
        {
          infinityDatePicker(startDate, null, {
            selected: startDate,
            onChange: date => {
              setValue(formatDate(date));
              setStartDate(date);
              setEndDate(date ? endDate : null);
            }
          })
        }
      </Col>
    </Row>
  );
});

export default DateInput;
