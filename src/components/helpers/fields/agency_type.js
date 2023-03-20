import faker from 'faker';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = [
  { name: 'name', label: 'Law Enforcement Agency Type Name', mandatory: true }
];

const fieldsShow = (userPermissions = []) => fieldsWithPermission(
  fieldsNew,
  userPermissions,
  permissions.UPDATE_AGENCYTYPE
);

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  name: faker.name.lastName()
} : {};

export { fieldsNew, fieldsShow, exampleData };
