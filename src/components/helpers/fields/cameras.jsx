import { FieldType } from 'components/helpers/form_fields';
import faker from 'faker';

const fields = () => [
  { name: 'name', label: 'Stream Name', mandatory: true },
  { name: 'stream', label: 'IP Adress/Domain', mandatory: true },
  { name: 'other_information', label: 'Other required Information', type: FieldType.TEXT_AREA }
];

const filterFields = () => [
  { name: 'name', label: 'Name' },
  { name: 'id', label: 'Parking Lot' },
  { name: 'city', label: 'Location' },
  { name: 'available_cameras', label: 'Available Cameras' }
];

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  name: faker.lorem.words(),
  stream: faker.internet.url(),
  other_information: faker.lorem.sentences()
} : {
}; // These are defaults values for each field

export { filterFields, exampleData, fields };
