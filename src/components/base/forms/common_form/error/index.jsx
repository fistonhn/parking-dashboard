import React from 'react';
import { ReactComponent as Error } from 'assets/error_icon.svg';
import styles from './error.module.sass';

const ErrorWrapper = (props) => {
  const { errors = {}, field } = props;
  let errorName = null;

  if (field) {
    errorName = field.prefix_error ? `${field.prefix_error}_${field.name}` : field.name;
  }

  return (
    <div className={`position-relative ${errors[errorName] ? 'input-error' : ''}`}>
      {props.children}
      <Error className={`${errors[errorName] ? 'd-md-none d-lg-block' : 'd-none'} ${styles.WarningIcon} position-absolute`}/>
      <div className="text-left general-error general-text-1 pt-1">
        {errors[errorName] ? errors[errorName][0] : ''}
      </div>
    </div>
  );
};

export default ErrorWrapper;
