import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = (roles = [], agencies = [], parkingLots = [], roleType = '') => {
  const fields = [
    {
      name: 'status',
      label: 'Status:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: roles
    },
    {
      name: 'paid_free',
      label: 'Paid/Free:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Successful' },
        { value: 'failed', label: 'Failed' }
      ]
    },

    {
      name: 'category',
      label: 'Category:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Successful' },
        { value: 'failed', label: 'Failed' }
      ]
    },
    {
      name: 'created_by',
      label: 'Created By:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Successful' },
        { value: 'failed', label: 'Failed' }
      ]
    }
  ];
  if (roleType === 'parking_lot_manager' || roleType === 'town_manager') {
    fields.push({
      name: 'parking_lot_ids',
      label: 'Parking Lots',
      mandatory: false,
      type: FieldType.MULTISELECT_FIELD,
      options: parkingLots,
      entityName: 'lots'
    });
  } else if (roleType === 'agency_manager' || roleType === 'agency_officer') {
    fields.push({
      name: 'agency_id',
      label: 'Agency',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: agencies
    });
  }
  return fields;
};

const filterFields = (roles) => {
  return [
    { name: 'permit_number', label: 'Permit Number:', mandatory: false },
    { name: 'application_from', type: FieldType.DATE_FIELD, label: 'Application From(Date):', mandatory: false },
    { name: 'application_to', type: FieldType.DATE_FIELD, label: 'Application To(Date):', mandatory: false },

    {
      name: 'permit_type',
      label: 'Permit Type:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: roles
    },
    { name: 'permit_valid_from', type: FieldType.DATE_FIELD, label: 'Permit Valid From(Date):', mandatory: false },
    { name: 'permit_valid_to', type: FieldType.DATE_FIELD, label: 'Permit Valid To(Date):', mandatory: false },
    { name: 'vehicle_plate_number', label: 'Vehicle Plate Number:', mandatory: false },
    { name: 'vehicle_model', label: 'Vehicle Model:', mandatory: false },
    { name: 'vehicle_owner_Name', label: 'Vehicle Owner Name:', mandatory: false },
    {
      name: 'permit_status',
      label: 'Permit Status:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Successful' },
        { value: 'failed', label: 'Failed' }
      ]
    },

    {
      name: 'issue_date',
      type: FieldType.DATE_FIELD,
      label: 'Issue Date:'
    },
    {
      name: 'parking_lots',
      label: 'Parking Lots:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Successful' },
        { value: 'failed', label: 'Failed' }
      ]
    },
    {
      name: 'permit_category',
      label: 'Permit Category:',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Successful' },
        { value: 'failed', label: 'Failed' }
      ]
    }
  ];
};

const fieldsShow = (roles, agencies, parkingLots, roleType, userPermissions) => fieldsWithPermission(
  fieldsNew(roles, agencies, parkingLots, roleType),
  userPermissions,
  permissions.UPDATE_ADMIN
);

export { fieldsNew, fieldsShow, filterFields };
