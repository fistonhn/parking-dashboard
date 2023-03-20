import React from 'react';
import { asField } from 'informed';
import CustomDropdown from 'components/base/dropdown';
import styles from './multi_select.module.sass';

const CustomMultiSelect = asField(({ fieldApi, fieldState, options, disabled, events = {}, entityName }) => {
  const { value } = fieldState;
  const { setValue } = fieldApi;
  const selectValues = value ? options.filter(option => value.includes(option.value)) : [];

  const coveringText = (value) => {
    return `Selected (${value ? value.length : '0'}) ${entityName || ''}`;
  };

  return (
    <CustomDropdown
      multiple
      value={selectValues}
      onChange={(selectedOptions) => {
        setValue(selectedOptions ? selectedOptions.map(element => element.value) : []);
        events.onChange && events.onChange();
      }}
      options={options}
      disabled={disabled}
      coveringText={coveringText}
      className={styles.dropdown}
    />
  );
});

export default CustomMultiSelect;
