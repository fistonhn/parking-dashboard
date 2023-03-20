import React from 'react';
import PropTypes from 'prop-types';
import styles from './input.module.sass';

const Input = ({ icon, viewOnly, className, value, onChange, ...otherProps }) => {
  const contentType = viewOnly ? 'div' : 'input';
  const inputOnChangeFunc = (e) => onChange(e.target.value);
  const onChangeFunc = viewOnly ? onChange : inputOnChangeFunc;

  const contentElementProps = {
    className: `${styles.input} ${className || ''} ${icon ? 'pr-5' : ''}`,
    onChange: onChangeFunc,
    ...otherProps
  };
  let contentChild;
  if (viewOnly) {
    contentChild = value;
  } else {
    contentElementProps.type = 'text';
    contentElementProps.value = value;
  }
  const contentElement = React.createElement(contentType, contentElementProps, contentChild);
  return (
    <div className="d-flex justify-content-end align-items-center position-relative">
      {contentElement}
      <div className={styles.iconWrapper}>
        {icon}
      </div>
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.node,
  viewOnly: PropTypes.bool,
  className: PropTypes.string
};

export default Input;
