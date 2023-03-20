import { fas } from '@fortawesome/free-solid-svg-icons';
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
    options: [{ value: 'pending', label: 'Pending' }, { value: 'active', label: 'Active' }, { value: 'rejected', label: 'Rejected' }, { value: 'inactive', label: 'Inactive' }]
  },
  {
    name: 'manufacturer_name',
    label: 'Vehicle manufacturer'
  }

];

const notEditableFields = [
  { name: 'created_at', label: 'Date', disabled: true },
  { name: 'plate_number', label: 'Plate Number', disabled: true },
  { name: 'manufacturer', label: 'Manufacturer', disabled: true },
  { name: 'email', label: 'Owner Email', disabled: true },
  { name: 'first_name', label: 'Owner First Name', disabled: true },
  { name: 'last_name', label: 'Owner Last Name', disabled: true }
];

const editableFields = (vehicleStatuses, mute = false) => {
  return ([
    {
      name: 'status',
      label: 'Status',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: vehicleStatuses,
      disabled: mute === true ? true : false
    }
  ]);
};

const fieldsShow = (vehicleStatuses, userPermissions) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(vehicleStatuses),
    userPermissions,
    permissions.UPDATE_VEHICLE
  )
];

const fieldsShowMuted = (vehicleStatuses, userPermissions) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(vehicleStatuses, true),
    userPermissions,
    permissions.READ_VEHICLE
  )
];

const fieldImages = {
  name: 'images',
  label: '',
  type: FieldType.MULTIPLE_FILE_FIELDS,
  disabled: true
};

export { filterFields, fieldImages, fieldsShow, fieldsShowMuted };
