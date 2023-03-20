import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsShow = (userPermissions) => ([
  { name: 'status', label: 'Status', disabled: true },
  ...fieldsWithPermission([
    { name: 'name', label: 'Parking Slot Title' },
    {
      name: 'archived',
      label: 'Archived',
      type: FieldType.SELECT_FIELD,
      options: [{ value: 'true', label: 'true' }, { value: 'false', label: 'false' }]
    }
  ], userPermissions, permissions.UPDATE_PARKINGLOT)
]);

const fieldsShowMute = (userPermissions) => ([
  { name: 'status', label: 'Status', disabled: true },
  ...fieldsWithPermission([
    { name: 'name', label: 'Parking Slot Title', disabled: true },
    {
      name: 'archived',
      label: 'Archived',
      type: FieldType.SELECT_FIELD,
      options: [{ value: 'true', label: 'true' }, { value: 'false', label: 'false' }],
      disabled: true
    }
  ], userPermissions, permissions.UPDATE_PARKINGLOT)
]);

export { fieldsShow, fieldsShowMute };
