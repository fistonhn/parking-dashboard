import React from 'react';
import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';
import { Label } from 'reactstrap';
import { asField } from 'informed';

const LabelInput = asField(({ fieldState }) => {
  const { value } = fieldState;
  return <Label className="text-muted" sm={2}>{value}</Label>;
});

const renderLabelInput = (field, props) => {
  return <LabelInput {...props} field={field.name} />;
};

const fieldsName = [
  'zip',
  'street',
  'state',
  'country',
  'building',
  'city',
  'ltd',
  'lng'
];

const fields = [
  { name: 'location.country', label: 'Country', mandatory: true, disabled: true },
  { name: 'location.state', label: 'State', mandatory: true, disabled: true },
  { name: 'location.city', label: 'City', mandatory: true, disabled: true },
  { name: 'location.zip', label: 'Zip', mandatory: true, disabled: true },
  { name: 'location.street', label: 'Street', mandatory: true, disabled: true },
  { name: 'location.ltd', label: 'Latitude', mandatory: true, type: FieldType.LABEL_TEXT_FIELD, render: renderLabelInput },
  { name: 'location.lng', label: 'Longitude', mandatory: true, type: FieldType.LABEL_TEXT_FIELD, render: renderLabelInput }
];

const exampleData = () => process.env.NODE_ENV === 'production' ? {
  country: faker.address.country(),
  city: faker.address.city(),
  zip: faker.address.zipCode(),
  street: faker.address.streetName(),
  ltd: '38.771665',
  lng: '-76.0762605'
} : {};

export { fields, exampleData, fieldsName };
