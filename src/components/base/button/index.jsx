import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

import styles from './button.module.sass';

const Button = ({
  children,
  onClick,
  className,
  icon,
  status = 'primary',
  size = 'sm',
  isLoading = false,
  disabled = false,
  ...otherProps
}) => {
  return (
    <button
      className={`${styles.button} ${styles[`button-${status}`]} ${styles[`button-${size}`]} ${className || ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {!!icon &&
        <div className={isLoading ? 'invisible' : ''}>
          {icon}
        </div>
      }
      {!!children &&
        <span className={isLoading ? 'invisible' : ''}>
          {children}
        </span>
      }
      {isLoading &&
        <div className={styles.loading}>
          <Spinner color="primary" size="sm" />
        </div>
      }
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  status: PropTypes.string,
  size: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Button;
