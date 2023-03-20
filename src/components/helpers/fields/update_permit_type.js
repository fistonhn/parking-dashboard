import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';

const fieldsNew = (all_parking_lots, record) => {
  let validity_period;

  if (record?.validity === 'days') {
    validity_period = [
      { value: '1 day', label: '1 day' },
      { value: '2 days', label: '2 days' },
      { value: '3 days', label: '3 days' },
      { value: '4 days', label: '4 days' },
      { value: '5 days', label: '5 days' },
      { value: '6 days', label: '6 days' }
    ];
  } else if (record?.validity === 'weeks') {
    validity_period = [
      { value: '1 week', label: '1 week' },
      { value: '2 weeks', label: '2 weeks' },
      { value: '3 weeks', label: '3 weeks' }
    ];
  } else if (record?.validity === 'months') {
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
      disabled: 'disabled',
      options: [
        { value: 'temporary', label: 'Temporary' },
        { value: 'permanent', label: 'Permanent' }
      ]
    },
    {
      name: 'validity',
      label: 'Validity',
      mandatory: true,
      disabled: 'disabled'
    },
    {
      name: 'period',
      label: 'Period',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: validity_period,
      disabled: 'disabled'
    },
    {
      name: 'parking_lot_id',
      label: 'Parking Lot',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: all_parking_lots
    },
    { name: 'parking_hour_from', type: FieldType.HOUR_INPUT_FIELD, label: 'Time From', mandatory: true },
    { name: 'parking_hour_to', type: FieldType.HOUR_INPUT_FIELD, label: 'Time To', mandatory: true },

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
    { name: 'hourly_rate', type: FieldType.NUMBER_FIELD, label: 'Hourly Rate($)', mandatory: true },
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

const selectedData = (record) => ({
  name: record?.name,
  category: record?.category,
  validity: record?.validity,
  period: record?.period,
  parking_lots: record?.parking_lots,
  parking_hour_from: record?.parking_hour_from,
  parking_hour_to: record?.parking_hour_to,
  payment_type: record?.payment_type,
  hourly_rate: record?.hourly_rate
  // status: record?.status

});

export { fieldsNew, selectedData };
