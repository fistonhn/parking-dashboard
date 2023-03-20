import doesUserHasPermission from 'components/modules/does_user_has_permission';

function getFieldsWithDisabled (fields) {
  return fields.map(field => ({
    ...field,
    disabled: true
  }));
}

function fieldsWithPermission (fields, userPermissions, updateRequiredPermission) {
  return doesUserHasPermission(userPermissions, updateRequiredPermission)
    ? fields
    : getFieldsWithDisabled(fields);
}

export default fieldsWithPermission;
