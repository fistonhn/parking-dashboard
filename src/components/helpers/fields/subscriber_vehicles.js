import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const filterFields = () => [
  {
    name: 'range',
    label: 'Created Date',
    type: FieldType.DATE_FIELD
  },
  {
    name: 'user_email',
    label: 'Owner Email'
  },
  {
    name: 'plate_number',
    label: 'Vehicle Plate Number'
  },

  {
    name: 'status',
    label: 'Status',
    type: FieldType.SELECT_FIELD,
    options: [{ value: 'pending', label: 'Pending' }, { value: 'active', label: 'Active' }, { value: 'rejected', label: 'Rejected' }, { value: 'inactive', label: 'Inactive' }],
    defaultValue: 'pending'
  },
  {
    name: 'manufacturer_name',
    label: 'Vehicle manufacturer'
  }

];

const notEditableFields = [
  { name: 'created_at', label: 'Created Date', disabled: true },
  { name: 'updated_at', label: 'Updated Date', disabled: true },
  { name: 'status', label: 'Status', disabled: true }
//   { name: 'email', label: 'Owner Email', disabled: true },
//   { name: 'first_name', label: 'Owner First Name', disabled: true },
//   { name: 'last_name', label: 'Owner Last Name', disabled: true },
];

const editableFields = (manufacturers, manufacturer) => {
  return ([
    { name: 'plate_number', label: 'Plate Number' },
    { name: 'registration_state', label: 'Vehicle Registration State' },
    { name: 'model', label: 'Model' },
    { name: 'color', label: 'Color' },
    {
      name: 'manufacturer_id',
      label: 'Vehicle Manufacturer',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: manufacturers,
      defaultValue: manufacturer?.value
    }
  ]);
};

const fieldsShow = (userPermissions, manufacturers, manufacturer) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(manufacturers, manufacturer),
    userPermissions,
    permissions.UPDATE_VEHICLE
  )
];

const fieldImages = {
  name: 'images',
  label: '',
  type: FieldType.MULTIPLE_FILE_FIELDS,
  disabled: true
};

export { filterFields, fieldImages, fieldsShow };
