import { FieldType } from 'components/helpers/form_fields';

const fields = (categories) => [
  { name: 'name', prefix_error: 'places', label: 'Name', mandatory: true },
  { name: 'category', prefix_error: 'places', label: 'Category', mandatory: true, type: FieldType.SELECT_FIELD, options: categories.map(category => { return { value: category.value, label: category.label }; }) },
  { name: 'distance', prefix_error: 'places', label: 'Distance (m)', mandatory: true, type: FieldType.NUMBER_FIELD }
];

export { fields };
