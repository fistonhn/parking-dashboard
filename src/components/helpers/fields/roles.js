import faker from 'faker';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = () => [
  { name: 'name', label: 'Name', mandatory: true }
];

const fieldsShow = (userPermissions) => fieldsWithPermission(
  fieldsNew(),
  userPermissions,
  permissions.UPDATE_ROLE
);

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  name: faker.name.jobTitle()
} : {};

export { fieldsNew, fieldsShow, exampleData };
