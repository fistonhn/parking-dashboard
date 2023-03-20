import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';

const fieldsNew = (managers = [], admins = [], agencies = [], renderLocationModal, mute = false) => (
  [
    { name: 'name', label: 'Parking Lot Title', mandatory: true, autoFocus: true, disabled: mute },
    { name: 'parking_admin_id', label: 'Parking Operator', type: FieldType.SELECT_FIELD, options: admins.map(admin => { return { value: admin.value, label: admin.label }; }), disabled: mute },
    {
      name: 'location',
      label: 'Location',
      mandatory: true,
      render: renderLocationModal,
      disabled: mute
    },
    { name: 'town_manager_id', label: 'Town Manager', mandatory: true, type: FieldType.SELECT_FIELD, options: managers.map(manager => { return { value: manager.value, label: manager.label }; }), disabled: mute },
    { name: 'phone', label: 'Contact', disabled: mute },
    { name: 'status', label: 'Status', mandatory: true, type: FieldType.SELECT_FIELD, options: [{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }], defaultValue: 'active', disabled: mute },
    { name: 'email', label: 'Email', disabled: mute },
    { name: 'agency_id', label: 'Agency', mandatory: true, type: FieldType.SELECT_FIELD, options: agencies, disabled: mute }
  ]
);

const fieldsShow = (managers = [], admins = [], agencies = [], renderLocationModal, userPermissions = []) => fieldsWithPermission(
  [
  // TODO: It hasn't been discussed yet
  //  {
  //   name: 'disputes_count',
  //   type: FieldType.TEXT_LINK_FIELD,
  //   props: { to: '/disputes', value: 'Show list' },
  //   style: { maxWidth: 'inherit', display: 'inline' },
  //   label: 'Disputes received',
  // },
  // {
  //   name: 'violations_count',
  //   type: FieldType.TEXT_LINK_FIELD,
  //   props: { to: '/violations', value: 'Show list' },
  //   style: { maxWidth: 'inherit', display: 'inline' },
  //   label: 'Violation records',
  // },
    ...fieldsNew(managers, admins, agencies, renderLocationModal)
  ],
  userPermissions,
  permissions.UPDATE_PARKINGLOT
);

const fieldsShowMute = (managers = [], admins = [], agencies = [], renderLocationModal, userPermissions = []) => fieldsWithPermission(
  [
    ...fieldsNew(managers, admins, agencies, renderLocationModal, true)
  ],
  userPermissions,
  permissions.READ_PARKINGLOT
);

const liveFootageFilterFields = () => [
  { name: 'name', label: 'Parking Lot Name' },
  { name: 'id', label: 'Parking Lot ID' },
  { name: 'full_address', label: 'Location' },
  { name: 'available_cameras', label: 'Available Cameras' }
];

const filterFields = (parkingAdmins, townManagers) => [
  { name: 'id', label: 'Parking Lot ID' },
  { name: 'name', label: 'Parking Lot Name' },
  { name: 'full_address', label: 'Location' },
  { name: 'phone', label: 'Contact Number ' },
  { name: 'email', label: 'Email Address' },
  {
    name: 'parking_admins',
    label: 'Parking Admin',
    type: FieldType.SELECT_FIELD,
    options: parkingAdmins.map(({ value, label }) => {
      return { value, label };
    })
  },
  {
    name: 'town_managers',
    label: 'Town Manager',
    type: FieldType.SELECT_FIELD,
    options: townManagers.map(({ value, label }) => {
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

const exampleData = (roles) => process.env.NODE_ENV !== 'production' ? {
  name: 'Parking Lot test',
  phone: '+13583767678',
  email: faker.internet.email(),
  status: 'active'
} : {
  status: 'active'
}; // These are defaults values for each field

export { fieldsNew, fieldsShow, fieldsShowMute, filterFields, exampleData, liveFootageFilterFields };
