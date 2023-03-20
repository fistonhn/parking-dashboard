import { FieldType } from 'components/helpers/form_fields';
import { ACTIVITY_LOG_FILTER_FORM_LABELS as LABELS } from '../../../lang/en';

const filterFields = [
  {
    name: 'range',
    label: LABELS.RANGE_DATE,
    type: FieldType.DATE_FIELD
  },
  {
    name: 'activity_log',
    label: LABELS.TYPE_OF_CHANGE,
    type: FieldType.SELECT_FIELD,
    options: [
      { label: LABELS.STATUS, value: 'Change of Status' },
      { label: LABELS.ASSIGNEE, value: 'Change of Assignee' },
      { label: LABELS.VIOLATION_TYPE, value: 'Change of Violation Type' }
    ]
  }
];

export { filterFields };
