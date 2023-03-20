import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as CheckBoxActiveIcon } from 'assets/check_box_active_icon.svg';
import styles from './check_box.module.sass';

const CheckBox = ({ value, onChange, disabled = false, label = '', className = '' }) => (
  <div
    className={`${className} ${styles.checkBox} ${value ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
    onClick={() => !disabled && onChange(!value)}
  >
    <CheckBoxActiveIcon width="16" height="16" />
    <span className="general-text-1">{label}</span>
  </div>
);

CheckBox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default CheckBox;
