import React from 'react';
import { Button, Label, Col, FormGroup } from 'reactstrap';
import { asField } from 'informed';

const offColor = 'text-info';
const onColor = 'text-warning';

const Toggler = asField(({ fieldState, fieldApi, options, label, events }) => {
  const { setValue } = fieldApi;
  const { value } = fieldState;

  const onClick = () => {
    events.onChange();
    setValue(currentOption().value);
  };

  const currentOption = () => (options.on.value === value ? { ...options.off, color: offColor } : { ...options.on, color: onColor });

  return (
    <FormGroup row>
      <Label sm={12} md={6}>{label}</Label>
      <Label className={currentOption().color } sm={12} md={6}>{value}</Label>
      <Col xs={12}>
        <Button className="btn-block" onClick={onClick} >
          { currentOption().labelButton }
        </Button>
      </Col>

    </FormGroup>

  );
});

export default Toggler;
