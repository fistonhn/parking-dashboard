import { FieldType } from 'components/helpers/form_fields';

const fields = (agencies = [], admins = []) => ({
  recipient: { name: 'recipient', label: `Violation Notification Recipient (${admins.length})`, type: FieldType.MULTISELECT_FIELD, options: admins.map(admin => { return { value: admin.id, label: admin.email }; }) },
  description: { name: 'description', label: 'Description' },
  agency_id: { name: 'agency_id', label: 'Assigned Agency', type: 'select', options: agencies.map(agency => { return { value: agency.id, label: agency.email }; }) },
  status: {
    name: 'status',
    innerLabel: 'Status',
    mandatory: true,
    type: FieldType.TOGGLER_FIELD,
    options: {
      on: {
        value: 'active',
        labelButton: 'Activate'
      },
      off: {
        value: 'inactive',
        labelButton: 'Deactivate'
      }
    },
    defaultValue: 'inactive'
  }
});

export { fields };
