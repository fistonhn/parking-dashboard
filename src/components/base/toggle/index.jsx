import React from 'react';
import PropTypes from 'prop-types';
import styles from './toggle.module.sass';

const Toggle = ({ value, onChange, label, positiveText = 'YES', negativeText = 'NO', className = '', disabled }) => {
  return (
    <div className={`d-flex align-items-center ${className}`}>
      <div
        className={`${styles.toggle} ${value ? styles.toggleOn : ''} ${disabled ? styles.disabled : ''}`}
        onClick={(event) => onChange(!value, event)}
      >
        <div>
          <span>
            <span>{positiveText}</span>
          </span>
          <span>
            {negativeText}
          </span>
        </div>
      </div>
      {!!label &&
        <span className="general-text-2">{label}</span>
      }
    </div>
  );
};

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  positiveText: PropTypes.string,
  negativeText: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Toggle;
