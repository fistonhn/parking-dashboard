import faker from 'faker';
import { FieldType } from 'components/helpers/form_fields';
import permissions from 'config/permissions';
import fieldsWithPermission from './fields_with_permission';
import { AGENCIES_FILTER_FORM_LABELS as LABELS } from '../../../lang/en';

const fieldsNew = (
  officers,
  managers,
  agencyTypes,
  parkingLots,
  renderLocationModal
) => [
  {
    name: 'location',
    label: LABELS.LOCATION,
    mandatory: true,
    render: renderLocationModal
  },
  { name: 'email', label: LABELS.EMAIL, mandatory: true },
  { name: 'name', label: LABELS.NAME, mandatory: true },
  { name: 'phone', label: LABELS.PHONE },
  // TODO add condition to only show status field to system and super admin
  {
    name: 'status',
    label: 'Status',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    defaultValue: 'active'
  },
  {
    name: 'manager_id',
    label: 'Manager',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    emptyValue: 0,
    options: managers.map((manager) => {
      return { value: manager.value, label: manager.label };
    })
  },
  {
    name: 'agency_type_id',
    label: 'Agency Type',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    emptyValue: 0,
    options: agencyTypes.map((agencyType) => {
      return { value: agencyType.value, label: agencyType.label };
    })
  },
  {
    name: 'officer_ids',
    label: 'Officers',
    mandatory: true,
    type: FieldType.MULTISELECT_FIELD,
    options: officers.map((officer) => {
      return { value: officer.value, label: officer.label };
    })
  },
  {
    name: 'parking_lot_ids',
    label: 'Parking Lots',
    mandatory: true,
    type: FieldType.MULTISELECT_FIELD,
    options: parkingLots.map((parkingLot) => {
      return { value: parkingLot.value, label: parkingLot.label };
    })
  }
];

const fieldsShow = (
  officers,
  managers,
  agencyTypes,
  parkingLots,
  renderLocationModal,
  userPermissions
) =>
  fieldsWithPermission(
    fieldsNew(
      officers,
	    managers,
	    agencyTypes,
      parkingLots,
	    renderLocationModal
    ),
    userPermissions,
    permissions.UPDATE_AGENCY
  );

const exampleData = () =>
  process.env.NODE_ENV === 'production'
    ? {
      status: 'active'
    }
    : {
      email: faker.internet.email(),
      name: faker.company.companyName(),
      phone: '+13583767678',
      status: 'active'
    };

const filterFields = (agencyTypes = [], managers = []) => [
  { name: 'id', label: 'Agency ID' },
  { name: 'name', label: 'Agency Name' },
  {
    name: 'agency_type',
    label: 'Agency Type',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    emptyValue: 0,
    options: agencyTypes.map((agencyType) => {
      return { value: agencyType.value, label: agencyType.label };
    })
  },
  {
    name: 'manager_id',
    label: 'Manager',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    emptyValue: 0,
    options: managers.map((manager) => {
      return { value: manager.value, label: manager.label };
    })
  },
  {
    name: 'status',
    label: 'Status',
    mandatory: true,
    type: FieldType.SELECT_FIELD,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    defaultValue: 'active'
  }
];

export { fieldsNew, fieldsShow, exampleData, filterFields };
