import { FieldType } from 'components/helpers/form_fields';
import { displayUnixTimestamp, dateToUnix } from 'components/helpers';

const generateBadgesFilter = (filterQuery, filterFields) => {
  const badgesFilter = [];
  for (const key in filterQuery) {
    filterFields.forEach(field => {
      if (field.name === key) {
        if (field.type === FieldType.SELECT_FIELD || field.type === FieldType.MULTISELECT_FIELD) {
          field.options.forEach(option => {
            if (filterQuery[key].includes(option.value)) {
              badgesFilter.push({
                label: `${field.label}: ${option.label}`,
                value: option.value,
                key
              });
            }
          });
        } else if (field.type === FieldType.DATE_FIELD) {
          const from = filterQuery[key].from;
          const to = filterQuery[key].to;
          const format = 'MMM Do YYYY';
          const formattedFrom = from ? displayUnixTimestamp(dateToUnix(new Date(from)), format) : null;

          if (formattedFrom) {
            const formattedTo = to ? `${displayUnixTimestamp(dateToUnix(new Date(filterQuery[key].to)), format)}` : '';

            badgesFilter.push({
              label: `${field.label}: ${formattedFrom} - ${formattedTo}`,
              value: filterQuery[key],
              key
            });
          }
        } else {
          badgesFilter.push({
            label: `${field.label}: ${filterQuery[key]}`,
            value: filterQuery[key],
            key
          });
        }
      }
    });
  }
  return badgesFilter;
};

export default generateBadgesFilter;
