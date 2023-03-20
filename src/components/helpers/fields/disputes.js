import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const filterFields = (officers, parkingLots, disputeStatuses, disputeTypes) => [
  {
    name: 'range',
    label: 'Range Date',
    type: FieldType.DATE_FIELD
  },
  {
    name: 'parking_lot_id',
    label: 'Parking Lot',
    type: FieldType.SELECT_FIELD,
    options: parkingLots
  },
  {
    name: 'status',
    label: 'Dispute Status',
    type: FieldType.SELECT_FIELD,
    options: disputeStatuses
  },
  {
    name: 'dispute_type',
    label: 'Dispute Type',
    type: FieldType.SELECT_FIELD,
    options: disputeTypes
  },
  {
    name: 'user_name',
    label: 'Subscriber username'
  }
];

const notEditableFields = [
  { name: 'created_at', label: 'Date', disabled: true },
  { name: 'username', label: 'User Name', disabled: true },
  { name: 'email', label: 'Subscriber Email', disabled: true },
  {
    name: 'parking_lot',
    label: 'Parking Lot',
    disabled: true
  },
  {
    name: 'dispute_type',
    label: 'Dispute type',
    disabled: true
  }
];

const editableFields = (parkingLots, disputeTypes, disputeStatuses, defaultStatus) => {
  return ([
    {
      name: 'status',
      label: 'Status',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: disputeStatuses,
      defaultValue: defaultStatus
    }
  ]);
};

const fieldsShow = (officers, disputeTypes, disputeStatuses, defaultStatus, userPermissions) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(officers, disputeTypes, disputeStatuses, defaultStatus),
    userPermissions,
    permissions.UPDATE_DISPUTE
  )
];

export { filterFields, fieldsShow };
