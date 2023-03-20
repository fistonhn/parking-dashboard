import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'informed';

const CustomSelect = props => {
  const { field } = props;
  const options = field.options;
  if (field.defaultValue) {
    const defaultIndex = options && options.length > 0 && options.findIndex(option => option.value === field.defaultValue);
    [options[0], options[defaultIndex]] = [options[defaultIndex], options[0]];
  }

  return (
    <Select className='form-control' {...props.events} disabled={field.disabled} field={field.name} type='select' >
      {!field.defaultValue && <Option value='' disabled={!props.emptyOptionEnabled}>Select One...</Option>}
      {
        field.options.map((option, idx) => (
          <Option
            key={idx}
            value={option.value}
            disabled={option.disabled || false}
          >
            {option.label}
          </Option>
        ))
      }
    </Select>
  );
};

CustomSelect.propTypes = {
  events: PropTypes.shape({}),
  field: PropTypes.shape({
    name: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }),
  emptyOptionEnabled: PropTypes.bool
};

CustomSelect.defaultProps = {
  emptyOptionEnabled: false
};

export default CustomSelect;
