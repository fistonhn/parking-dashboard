export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  PARKING_PERMITS: 'parking_permits'
};

export const PERMISSION_NAMES = [
  'Role',
  'Admin',
  'ParkingLot',
  'Agency',
  'AgencyType',
  'Camera',
  'Report',
  'User',
  'Vehicle',
  'Payment',
  'Permit',
  'Dispute',
  'Violation',
  'Notification',
  'ParkingSlot'
];

export const ACTIONS = ['create', 'read', 'update', 'delete'];

export const ATTR_ACTIONS = ['read', 'update'];

// create permission map with this format
// {
//   CREATE_PARKINGLOT: {
//     name: 'ParkingLot',
//     action: 'create'
//   },
//   UPDATE_PARKINGLOT: {
//     name: 'ParkingLot',
//     action: 'update'
//   },
//   ...
// }
const permissions = {};
PERMISSION_NAMES.forEach((permissionName) => {
  ACTIONS.forEach((action) => {
    const permissionAction = `${action.toUpperCase()}_${permissionName.toUpperCase()}`;
    permissions[permissionAction] = {
      name: permissionName,
      action: action
    };
  });
});
export default permissions;
