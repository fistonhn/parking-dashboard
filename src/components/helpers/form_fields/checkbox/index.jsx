import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'informed';
import CheckBox from 'components/base/check_box';

export const CheckBoxField = ({ className, onChange, name }) => {
  const { fieldState, fieldApi } = useField({ field: name });
  const { setValue } = fieldApi;

  const onCheckBoxChange = (value) => {
    setValue(value);
    onChange && onChange();
  };

  return <CheckBox
    className={className || ''}
    label=""
    onChange={onCheckBoxChange}
    value={!!fieldState.value}
  />;
};

CheckBoxField.propTypes = {
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired
};

export default CheckBoxField;
