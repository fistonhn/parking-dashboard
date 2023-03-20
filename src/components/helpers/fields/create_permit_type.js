import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = (validity, all_parking_lots, payment_type, parking_hour_from) => {
  let validity_period;

  if (validity === '0') {
    validity_period = [
      { value: '1 day', label: '1 day' },
      { value: '2 days', label: '2 days' },
      { value: '3 days', label: '3 days' },
      { value: '4 days', label: '4 days' },
      { value: '5 days', label: '5 days' },
      { value: '6 days', label: '6 days' }
    ];
  } else if (validity === '1') {
    validity_period = [
      { value: '1 week', label: '1 week' },
      { value: '2 weeks', label: '2 weeks' },
      { value: '3 weeks', label: '3 weeks' }
    ];
  } else if (validity === '2') {
    validity_period = [
      { value: '1 month', label: '1 month' },
      { value: '3 months', label: '3 months' },
      { value: '6 months', label: '6 months' }
    ];
  } else validity_period = [];

  const fields = [
    { name: 'name', label: 'Name', mandatory: true },
    {
      name: 'category',
      label: 'Category',
      mandatory: true,
      info: 'Permanent permit types are renewable and extendable by subscribers. Temporary permits can only be renewed or extended by an admin.',
      type: FieldType.SELECT_WITH_INFO,
      options: [
        { value: 'temporary', label: 'Temporary' },
        { value: 'permanent', label: 'Permanent' }
      ]
    },
    {
      name: 'validity',
      label: 'Validity',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 0, label: 'Days' },
        { value: 1, label: 'Weeks' },
        { value: 2, label: 'Months' }
      ]
    },
    {
      name: 'period',
      label: 'Period',
      mandatory: true,
      type: FieldType.MULTISELECT_FIELD,
      options: validity_period
    },
    {
      name: 'parking_lot_id',
      label: 'Parking Lot',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: all_parking_lots
    },
    { name: 'parking_hour_from', type: FieldType.HOUR_INPUT_FIELD, label: 'Time From', mandatory: true },
    { name: 'parking_hour_to', time_from: parking_hour_from, type: FieldType.HOUR_INPUT_FIELD, label: 'Time To', mandatory: true },

    {
      name: 'payment_type',
      label: 'Free/Paid',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'free', label: 'Free' },
        { value: 'paid', label: 'Paid' }
      ]
    },
    { name: 'hourly_rate', type: FieldType.NUMBER_FIELD, label: 'Hourly Rate($)', mandatory: payment_type === 'free' ? false : true },
    {
      name: 'status',
      label: 'Status:',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }

  ];

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
