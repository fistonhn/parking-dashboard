import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const filterFields = (agencies, officers, parkingLots, ticketStatuses, violationTypes) => [
  {
    name: 'range',
    label: 'Range Date',
    type: FieldType.DATE_FIELD
  },
  {
    name: 'agency_id',
    label: 'Law Agency',
    type: FieldType.SELECT_FIELD,
    options: agencies
  },
  {
    name: 'officer_id',
    label: 'Law Agency Officer',
    type: FieldType.SELECT_FIELD,
    options: officers
  },
  { name: 'ticket_id', label: 'Ticket ID' },
  {
    name: 'parking_lot_id',
    label: 'Parking Lot',
    type: FieldType.SELECT_FIELD,
    options: parkingLots
  },
  {
    name: 'ticket_status',
    label: 'Ticket Status',
    type: FieldType.SELECT_FIELD,
    options: ticketStatuses
  },
  {
    name: 'violation_type',
    label: 'Violation Type',
    type: FieldType.SELECT_FIELD,
    options: violationTypes
  }
];

const notEditableFields = [
  { name: 'created_at', label: 'Date', disabled: true },
  { name: 'updated_at', label: 'Updated Date', disabled: true },
  { name: 'updated_by', label: 'Updated By', disabled: true },
  { name: 'parking_lot', label: 'Parking Lot Title', disabled: true },
  { name: 'agency', label: 'Law Enforcement Agency', disabled: true },
  { name: 'plate_number', label: 'Vehicle Plate Number', disabled: true }
];

const editableFields = (officers, violationTypes, ticketStatuses) => {
  return ([
    {
      name: 'admin_id',
      label: 'Assignee',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: officers
    },
    {
      name: 'violation_type',
      label: 'Violation type',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: violationTypes
    },
    {
      name: 'status',
      label: 'Status',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: ticketStatuses
    }
  ]);
};

const fieldsShow = (officers, violationTypes, ticketStatuses, userPermissions) => [
  ...notEditableFields,
  ...fieldsWithPermission(
    editableFields(officers, violationTypes, ticketStatuses),
    userPermissions,
    permissions.UPDATE_VIOLATION
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

export { filterFields, fieldImages, fieldVideos, fieldsShow };
