import React from 'react';
import PropTypes from 'prop-types';
import styles from './no_data.module.sass';

const NoData = ({ text }) => (
  <div className={styles.empty}>
    <span className="general-text-1">{text}</span>
  </div>
);

NoData.propTypes = {
  text: PropTypes.string.isRequired
};

export default NoData;
