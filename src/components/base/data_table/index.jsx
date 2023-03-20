import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './data_table.module.sass';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';

const DataTable = ({ data, defaultDisplayRow = Number.MAX_SAFE_INTEGER }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = data.filter((item, index) => (showAll || index < defaultDisplayRow));

  const fields = Object.keys(data[0] || {});

  return (
    <React.Fragment>
      <table className={`${styles.table} general-text-1`}>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((item, index) => (
            <tr key={index}>
              {fields.map((field, index) => (
                <td key={index}>{item[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data && data.length > defaultDisplayRow &&
        <button
          className={styles.btnShowAll}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? <React.Fragment>
              <span>View less</span>
              <ChevronUp width="12" height="12" />
            </React.Fragment>
            : <React.Fragment>
              <span>View more ({data.length - defaultDisplayRow})</span>
              <ChevronDown width="12" height="12" />
            </React.Fragment>
          }
        </button>
      }
    </React.Fragment>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultDisplayRow: PropTypes.number
};

export default DataTable;
