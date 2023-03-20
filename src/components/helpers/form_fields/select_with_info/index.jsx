import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'informed';
import { Popover, PopoverBody } from 'reactstrap';
import {
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './select_with_info.module.sass';

const SelectWithInfo = props => {
  const { field } = props;
  const options = field.options;
  if (field.defaultValue) {
    const defaultIndex = options && options.length > 0 && options.findIndex(option => option.value === field.defaultValue);
    [options[0], options[defaultIndex]] = [options[defaultIndex], options[0]];
  }

  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => {
    setPopoverOpen(!popoverOpen);
  };

  return (
    <React.Fragment>
      <Select className={styles.select} {...props.events} disabled={field.disabled} field={field.name} type='select' >
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
      <div>
        <button
          className="ml-2 border-0 bg-white text-primary"
          id="Popover1"
        >
          <FontAwesomeIcon
            className={styles.info}
            color="primary"
            icon={faQuestionCircle}
          />
        </button>
        <Popover
          placement="bottom"
          isOpen={popoverOpen}
          target="Popover1"
          toggle={toggle}
          trigger="click hover focus"
        >
          <PopoverBody>{field.info}</PopoverBody>
        </Popover>
      </div>
    </React.Fragment>
  );
};

SelectWithInfo.propTypes = {
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

SelectWithInfo.defaultProps = {
  emptyOptionEnabled: false
};

export default SelectWithInfo;
