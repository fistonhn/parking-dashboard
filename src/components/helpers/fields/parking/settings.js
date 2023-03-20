import { FieldType } from 'components/helpers/form_fields';

const fields = (disabled) => ([
  {
    name: 'incremental',
    label: 'Incremental rate',
    type: FieldType.INCREASER_FIELD,
    step: 60,
    min: 60,
    tooltip: '',
    renderValue: value => value,
    disabled
  },
  {
    name: 'rate',
    label: 'Hourly Rate $',
    type: FieldType.NUMBER_FIELD,
    min: 0,
    tooltip: 'Per hour rate of the parking lot',
    renderValue: value => value,
    disabled
  },
  { name: 'period',
    label: 'Minimum Chargeable Time in minutes',
    type: FieldType.INCREASER_FIELD,
    step: 1800,
    max: 3600,
    min: 1800,
    tooltip: 'This is the minimum time that is multiplied to the hourly rate. Ex. The driver is charged 30 minutes even if he only stayed for 20 minutes.',
    renderValue: value => (value / 60),
    disabled
  },
  { name: 'parked',
    label: 'Grace Period to Park',
    type: FieldType.INCREASER_FIELD,
    step: 120,
    max: 600,
    min: 120,
    tooltip: 'Minutes before a car is considered as parked automatically.',
    renderValue: value => (value / 60),
    disabled
  },
  { name: 'overtime',
    label: 'Grace Period to Exit',
    type: FieldType.INCREASER_FIELD,
    step: 120,
    max: 600,
    min: 120,
    tooltip: 'This is the time given for the user to vacate the parking space after parking expiry.',
    renderValue: value => (value / 60),
    disabled
  },
  { name: 'parking_hour',
    label: 'Parking Hours',
    type: FieldType.HOUR_FIELD,
    step: 120,
    max: 600,
    min: 120,
    tooltip: 'This is the hours in which parking is possible',
    renderValue: value => (value / 60),
    disabled
  }
]);

export { fields };
