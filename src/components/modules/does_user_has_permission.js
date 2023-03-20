import isEqualIgnoreCase from './is_equal_ignore_case';

function doesUserHasPermission (userPermissions = [], requiredPermission) {
  if (!requiredPermission) return true;
  const { action = '', name = '' } = requiredPermission;
  const userPermission = userPermissions.find(p => {
    const permissionName = p.name.split('::').pop();
    return isEqualIgnoreCase(permissionName, name);
  });
  return userPermission && userPermission[`record_${action}`];
}

export default doesUserHasPermission;
