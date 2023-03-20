import { FieldType } from 'components/helpers/form_fields';

const filterFields = (officers) => [
  {
    name: 'range',
    label: 'Range Date',
    type: FieldType.DATE_FIELD
  },
  {
    name: 'officer_id',
    label: 'Law Agency Officer',
    type: FieldType.SELECT_FIELD,
    options: officers
  }
];

const filterFieldsDisputes = () => [
  {
    name: 'range',
    label: 'Range Date',
    type: FieldType.DATE_FIELD
  },
  {
    name: 'user_name',
    label: 'User name'
  }
];

const fieldsNew = [
  {
    name: 'content',
    mandatory: true,
    type: FieldType.TEXT_AREA
  }
];

export { fieldsNew, filterFields, filterFieldsDisputes };
