import { FieldType } from 'components/helpers/form_fields';

const filterFields = [
  { name: 'name', label: 'Report name' },
  {
    name: 'range',
    type: FieldType.DATE_FIELD,
    label: 'Date created'
  },
  { name: 'type', label: 'Report type' }
];

export { filterFields };
