import React from 'react';
import PropTypes from 'prop-types';
import { ACTIONS } from 'config/permissions';
import CheckBox from 'components/base/check_box';
import styles from './permission_table.module.sass';
import { camelize } from 'components/helpers';
import isEqualIgnoreCase from 'components/modules/is_equal_ignore_case';

function getPermissionLabel (permission, availablePermissions = []) {
  const { name } = permission;
  const availablePermission = availablePermissions.find(
    p => isEqualIgnoreCase(name, p.name)
  );
  return availablePermission?.label || name;
}

const PermissionRow = ({ value, label, onChange, disabled }) => {
  const { name, ...actions } = value;
  return (
    <tr>
      <td>
        {label}
      </td>
      {ACTIONS.map((actionType, index) => (
        <td key={index}>
          <CheckBox
            className={styles.checkBox}
            value={actions[`record_${actionType}`]}
            onChange={(v) => onChange(name, actionType, v)}
            disabled={disabled}
          />
        </td>
      ))}
    </tr>
  );
};

PermissionRow.propTypes = {
  value: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

const PermissionTable = ({ value, onChange, disabled, availablePermissions }) => {
  const handleChange = (permissionName, actionType, isChecked) => {
    const newValue = value.map(permission => {
      if (permission.name !== permissionName) return permission;
      return {
        ...permission,
        [`record_${actionType}`]: isChecked
      };
    });
    onChange(newValue);
  };

  return (
    <table className={`${styles.table} general-text-1`}>
      <thead>
        <tr>
          <th>Permission Name</th>
          {ACTIONS.map((action, index) => (
            <th key={index}>{camelize(action)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {value.map((permission, index) => (
          <PermissionRow
            key={index}
            value={permission}
            label={getPermissionLabel(permission, availablePermissions)}
            onChange={handleChange}
            disabled={disabled}
          />
        ))}
      </tbody>
    </table>
  );
};

PermissionTable.propTypes = {
  value: PropTypes.array.isRequired,
  availablePermissions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default PermissionTable;
