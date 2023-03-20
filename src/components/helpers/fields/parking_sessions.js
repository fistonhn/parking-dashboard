import { FieldType } from 'components/helpers/form_fields';

const showFields = [
  { name: 'id', label: 'Transaction number' },
  { name: 'vehicle.plate_number', label: 'Vehicle Plate' },
  { name: 'user_id', label: 'Account Linked' },
  { name: 'kiosk_id', label: 'Kiosk Number' },
  { name: 'created_at', label: 'Date' },
  { name: 'check_in', label: 'Start' },
  { name: 'check_out', label: 'End' },
  { name: 'slot_id', label: 'Parking Space ID' },
  { name: 'fee_applied', label: 'Parking Fee' },
  { name: 'total_price', label: 'Total Fee' },
  { name: 'paid', label: 'Payment Status' },
  { name: 'status', label: 'Parking Session Status' },
  { name: 'payment_method', label: 'Payment Method' }
];

const filterFields = (paymentMethod, parkingSessionStatuses, parkingSessionsKioskIds) => [
  { name: 'id', label: 'Transaction number' },
  { name: 'vehicles_plate_number', label: 'Vehicle Plate' },
  { name: 'user_ids', label: 'Account Linked ID' },
  {
    name: 'kiosk_ids',
    label: 'Kiosk Number',
    type: FieldType.MULTISELECT_FIELD,
    options: parkingSessionsKioskIds.map(({ value, label }) => {
      return { value, label };
    })
  },
  {
    name: 'created_at',
    type: FieldType.DATE_FIELD,
    label: 'Date'
  },
  {
    name: 'check_in',
    type: FieldType.DATE_FIELD,
    label: 'Start'
  },
  {
    name: 'check_out',
    type: FieldType.DATE_FIELD,
    label: 'End'
  },
  { name: 'slot_name', label: 'Parking Space ID' },
  { name: 'fee_applied', label: 'Parking Fee' },
  { name: 'total_price', label: 'Total Fee' },
  {
    name: 'statuses',
    label: 'Statuses',
    type: FieldType.MULTISELECT_FIELD,
    options: parkingSessionStatuses.map(({ value, label }) => {
      const modifiedLabel = label === 'created' ? 'In progress' : label;
      return { value, label: modifiedLabel };
    })
  },
  {
    name: 'payment_methods',
    label: 'Payment Method',
    type: FieldType.MULTISELECT_FIELD,
    options: paymentMethod.map(({ value, label }) => {
      return { value, label };
    })
  }
];

export { filterFields, showFields };
