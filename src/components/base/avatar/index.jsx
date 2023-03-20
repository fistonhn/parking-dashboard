import React from 'react';
import PropTypes from 'prop-types';

import styles from './avatar.module.sass';

const Avatar = ({ src, size = 'xs', className, ...otherProps }) => {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=''
      className={`${styles.avatar} ${styles[`avatar-${size}`]} ${className || ''}`}
      {...otherProps}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string
};

export default Avatar;
