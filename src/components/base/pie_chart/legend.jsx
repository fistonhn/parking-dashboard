import React from 'react';
import PropTypes from 'prop-types';
import styles from './pie_chart.module.sass';

const Legend = ({ data, colors, reportName }) => {
  const items = data.map(({ id, label, value }, i) => (
    <div className={styles.legendItem} key={id}>
      <div style={{ backgroundColor: colors[i % colors.length] }}/>
      <span className="general-text-2">{`${label} (${value})`}</span>
    </div>
  ));
  const total = data.map(i => i.value).reduce((sum, x) => sum + x);
  return (
    <div className={styles.legend}>
      <span className={`${styles.reportName} mb-3`}>{reportName}</span>
      <div className={styles.total}>
        <span className="general-text-2">Total:</span>
        <span className="general-text-2"> {total}</span>
      </div>
      {items}
      <span className="general-text-2">*Only completed parking sessions are counted here</span>
    </div>
  );
};

Legend.propTypes = {
  data: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  reportName: PropTypes.string.isRequired
};

export default Legend;
