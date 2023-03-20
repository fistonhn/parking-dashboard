import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = (roles = [], agencies = [], parkingLots = [], roleType = '') => {
  const fields = [
    { name: 'name', label: 'Full name', mandatory: true },
    { name: 'email', label: 'Email', mandatory: true },
    { name: 'username', label: 'User name', mandatory: true },
    {
      name: 'role_type',
      label: 'Role',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: roles
    },
    { name: 'phone', label: 'Phone' },
    {
      name: 'status',
      label: 'Current status',
      mandatory: true,
      type: FieldType.SELECT_FIELD,
      options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
    }
  ];
  if (roleType === 'parking_lot_manager' || roleType === 'town_manager') {
    fields.push({
      name: 'parking_lot_ids',
      label: 'Parking Lots',
      mandatory: false,
      type: FieldType.MULTISELECT_FIELD,
      options: parkingLots,
      entityName: 'lots'
    });
  } else if (roleType === 'agency_manager' || roleType === 'agency_officer') {
    fields.push({
      name: 'agency_id',
      label: 'Agency',
      mandatory: false,
      type: FieldType.SELECT_FIELD,
      options: agencies
    });
  }
  return fields;
};

const fieldsShow = (roles, agencies, parkingLots, roleType, userPermissions) => fieldsWithPermission(
  fieldsNew(roles, agencies, parkingLots, roleType),
  userPermissions,
  permissions.UPDATE_ADMIN
);

const filterFields = (roles) => {
  return [
    { name: 'name', label: 'Name' },
    {
      name: 'role_names',
      label: 'Role',
      type: FieldType.MULTISELECT_FIELD,
      options: roles.map(({ value, label }) => {
        return { value, label };
      })
    },
    {
      name: 'status',
      label: 'Status',
      type: FieldType.SELECT_FIELD,
      options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]
    }
  ];
};

const exampleData = () => process.env.NODE_ENV !== 'production' ? {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  phone: '+13583767678',
  status: 'suspended'
} : {
  status: 'suspended'
}; // These are defaults values for each field

export { fieldsNew, fieldsShow, exampleData, filterFields };
