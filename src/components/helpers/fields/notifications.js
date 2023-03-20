import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const filterFields = (types) => [
  {
    name: 'type',
    label: 'Notification Type',
    type: FieldType.SELECT_FIELD,
    options: Object.keys(types).map(field => ({
      value: field,
      label: types[field]
        .split('_')
        .join(' ')
        .replace(/(\b[a-z](?!\s))/, (x) => x.toUpperCase())
    }))
  }
];

const notEditableFields = [
  { name: 'key', label: 'Key', mandatory: true, autoFocus: true, disabled: true }
];

const editableFields = () => {
  return ([
    {
      name: 'value',
      label: 'Notification Message',
      mandatory: true,
      type: FieldType.TEXT_AREA,
      disabled: false
    }
  ]);
};

const editableFieldsNew = () => {
  return ([
    { name: 'key', label: 'Key', mandatory: true, autoFocus: true },
    {
      name: 'value',
      label: 'Notification Message',
      mandatory: true,
      type: FieldType.TEXT_AREA,
      disabled: false
    }
  ]);
};

const fieldsNew = (userPermissions) => [
  ...fieldsWithPermission(
    editableFieldsNew(),
    userPermissions,
    permissions.CREATE_NOTIFICATION
  )
];

const fieldsShow = (userPermissions) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(),
    userPermissions,
    permissions.UPDATE_NOTIFICATION
  )
];

export { filterFields, fieldsShow, fieldsNew };
