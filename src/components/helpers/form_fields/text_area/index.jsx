import React, { useState } from 'react';
import { asField } from 'informed';
import { Input } from 'reactstrap';
import { Button } from 'reactstrap';
import styles from './text_area.module.sass';

const TextArea = asField(({ fieldApi, fieldState, disabled, events = {}, values }) => {
  const { value } = fieldState;
  const { setValue } = fieldApi;

  const [text, setText] = useState(value);

  const handleInputChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
    setValue(e.target.value);
    events.onChange && events.onChange();
  };

  const onButtonClick = (e) => {
    e.preventDefault();
    setText(text + e.target.value);
    setValue(text + e.target.value);
    events.onChange && events.onChange();
  };

  const listValues = (values) => {
    const mappedValues = values.predefinedParams;

    return (
      <div className={styles.defaultParams}>
        {
          mappedValues.map((value, idx) => {
            return <Button
              key={idx}
              className={styles.buttons}
              color='primary' onClick={onButtonClick}
              value={value} >
              {value}
            </Button>;
          })
        }
      </div>
    );
  };

  return (
    <div>
      <Input
        type="textarea"
        onChange={handleInputChange}
        value={value}
        disabled={disabled}
        rows={7}
      />
      { values && listValues(values) }
    </div>
  );
});

export default TextArea;
