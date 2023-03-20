import isEqualIgnoreCase from 'components/modules/is_equal_ignore_case';
import { ACTIONS } from 'config/permissions';

export function normalizePermissions (rolePermissions, availablePermissions) {
  return availablePermissions.map(({ name = '' }) => {
    // init permission with name
    const permission = { name };
    // add permission record actions
    const rolePermission = rolePermissions.find((p) => isEqualIgnoreCase(p.name, name)) || {};
    ACTIONS.forEach((actionType) => {
      const recordActionName = `record_${actionType}`;
      permission[recordActionName] = !!rolePermission[recordActionName];
    });
    return permission;
  });
}

export function isEmptyPermissions (permissions = []) {
  return permissions.every((permission) =>
    ACTIONS.every((actionType) => !permission[`record_${actionType}`])
  );
}
