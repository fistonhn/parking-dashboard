import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input, Spinner } from 'reactstrap';

const momentUnix = timestamp => {
  return moment.unix(timestamp);
};

const displayUnixTimestamp = (timestamp, format = 'ddd, MMM Do YYYY, h:mm:ss a') => {
  return momentUnix(timestamp).format(format);
};

const displayUnixTimestampWithOffset = (timestamp, offset) => {
  const format = 'ddd, MMM Do YYYY, h:mm:ss a';

  if (offset) {
    return momentUnix(timestamp).utcOffset(offset).format(format);
  }

  return momentUnix(timestamp).format(format);
};

const displayDate = (date) => {
  if (!date) {
    return '';
  }
  return moment(date).format('MM/DD/YYYY');
};

const displayDateRange = (from, to) => {
  const fromDate = displayDate(from);
  const toDate = displayDate(to);
  if (fromDate === toDate) {
    return fromDate;
  }
  const fromYear = moment(from).year();
  const toYear = moment(to).year();
  if (fromYear === toYear) {
    return `${moment(from).format('MM/DD')} - ${toDate}`;
  }
  return `${fromDate} - ${toDate}`;
};

const displayMonthAndDay = (date) => {
  if (!date) {
    return '';
  }
  return moment(date).format('MMM DD');
};

const unixDatePicker = (timestamp, inputProps, pickerProps, readOnly = false) => {
  return (
    <DatePicker readOnly={readOnly} maxDate={moment().toDate()} selected={momentUnix(timestamp).toDate()} customInput={<Input {...inputProps}/>} {...pickerProps}/>
  );
};

const infinityDatePicker = (timestamp, inputProps, pickerProps) => {
  return (
    <DatePicker selected={momentUnix(timestamp).toDate()} customInput={<Input {...inputProps}/>} {...pickerProps}/>
  );
};

const dateToUnix = date => {
  return date.getTime() / 1000;
};

const btnSpinner = (props = {}) => {
  return (
    <span>
        Loading...
      <Spinner {...props} size="sm" color="default"/>
    </span>
  );
};

const camelize = (text, separator = '_') => (
  text.split(separator)
    .map(w => w.replace(/./, m => m.toUpperCase()))
    .join(' ')
);

export {
  momentUnix,
  camelize,
  displayUnixTimestamp,
  displayDate,
  displayDateRange,
  displayMonthAndDay,
  unixDatePicker,
  infinityDatePicker,
  dateToUnix,
  btnSpinner,
  displayUnixTimestampWithOffset
};
