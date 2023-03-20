import React from 'react';
import TooltipInfo from 'components/helpers/tooltip_info';

import styles from './rules.module.sass';
import Toggle from 'components/base/toggle';
import Dropdown from 'components/base/dropdown';

function renderRecords () {
  const { list, dropdowns } = this.state;
  const { errors = {} } = this.props;
  const handleToggleStatus = (idx) => {
    const updatedList = list.map((item, i) => {
      if (i !== idx) return item;
      return {
        ...item,
        status: !item.status
      };
    });
    this.setState({
      list: updatedList
    });
  };
  const handleOfficerChange = (idx, selectedOfficer) => {
    if (!selectedOfficer) return;
    const updatedList = list.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, admin_id: selectedOfficer.value };
    });
    this.setState({
      list: updatedList
    });
  };
  return list.map((record, idx) => {
    const { name, admin_id: adminId } = record;
    const error = errors[name];

    let selectedOfficer;
    if (dropdowns.officers.length > 0) {
      if (adminId) {
        selectedOfficer = dropdowns.officers.find(officer => officer.value === adminId);
        // eslint-disable-next-line no-unneeded-ternary
        selectedOfficer = selectedOfficer ? selectedOfficer : dropdowns.officers[0];
      } else {
        selectedOfficer = dropdowns.officers[0];
      }
    }

    return (
      <tr key={idx} className={`non-hover ${record.status ? styles.active : ''}`}>
        <td>
          <Toggle
            value={record.status}
            onChange={() => handleToggleStatus(idx)}
          />
        </td>
        <td>
          {record.description}
          <TooltipInfo className="ml-1" text={record.description} target={`rule_${record.id}`} />
        </td>
        <td>
          <Dropdown
            options={dropdowns.officers}
            value={selectedOfficer}
            onChange={(selectedValue) => handleOfficerChange(idx, selectedValue)}
            error={error}
            disabled={dropdowns.officers.length === 0}
          />
        </td>
      </tr>
    );
  });
};

export {
  renderRecords
};
