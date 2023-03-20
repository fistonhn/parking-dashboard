import { FieldType } from 'components/helpers/form_fields';
import fieldsWithPermission from './fields_with_permission';
import permissions from 'config/permissions';

const filterFields = () => [
  {
    name: 'range',
    label: 'Created Date',
    type: FieldType.DATE_FIELD
  },
  { name: 'username', label: 'Subscriber Username' },
  { name: 'plate_number', label: 'Vehicle Plate Number' },
  { name: 'parking_lot_name', label: 'Parking Lot' },
  {
    name: 'status',
    label: 'Status',
    type: FieldType.SELECT_FIELD,
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'success', label: 'Successful' },
      { value: 'failed', label: 'Failed' }
    ]
  }
];

const notEditableFields = [
  { name: 'parking_session', label: 'Parking Session ID', disabled: true },
  { name: 'uuid', label: 'UUID', disabled: true },
  { name: 'check_in', label: 'Check In Date', disabled: true },
  { name: 'check_out', label: 'Check Out Date', disabled: true },
  { name: 'plate_number', label: 'Vehcile Plate Number', disabled: true },
  { name: 'parking_lot', label: 'Parking Lot', disabled: true },
  { name: 'parking_slot', label: 'Parking Slot', disabled: true }
];

const editableFields = (defaultValue) => {
  return ([
    {
      name: 'status',
      label: 'Status',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Successful', value: 'success' },
        { label: 'Failed', value: 'failed' }
      ],
      defaultValue: defaultValue
    }
  ]);
};

const fieldsShow = (userPermissions, defaultValue) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(defaultValue),
    userPermissions,
    permissions.UPDATE_PAYMENT
  )
];

const fieldImages = {
  name: 'images',
  label: '',
  type: FieldType.MULTIPLE_FILE_FIELDS,
  disabled: true
};

const fieldVideos = {
  name: 'videos',
  label: '',
  type: FieldType.MULTIPLE_FILE_FIELDS,
  disabled: true
};

export { filterFields, fieldImages, fieldVideos, fieldsShow, editableFields };
