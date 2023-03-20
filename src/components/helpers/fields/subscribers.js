import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fields = [
  { name: 'email', label: 'Email', disabled: true },
  { name: 'first_name', label: 'First Name', disabled: true },
  { name: 'last_name', label: 'Last Name', disabled: true },
  { name: 'phone', label: 'Phone Number', disabled: true },
  { name: 'confirmed_at', label: 'Confirmed at Date & Time', disabled: true },
  { name: 'created_at', label: 'Created at Date & Time', disabled: true },
  { name: 'updated_at', label: 'Updated at Date & Time', disabled: true }
];

const fieldsShow = (userPermissions) => ([
  ...fields,
  ...fieldsWithPermission(
    [{ name: 'is_dev', label: 'Testing Account', type: FieldType.CHECKBOX_FIELD, className: 'mt-3' }],
    userPermissions,
    permissions.UPDATE_USER
  )
]);

const filterFields = [
  { name: 'first_name', label: 'First Name' },
  { name: 'last_name', label: 'Last Name' },
  { name: 'created_at', type: FieldType.DATE_FIELD, label: 'Date' }
];

export { fieldsShow, filterFields };
