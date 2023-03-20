import { combineReducers } from 'redux';
import TicketReducers from './tickets';
import UserReducers from './users';
import AdminReducers from './admins';
import AgencyReducers from './agencies';
import PaymentsReducers from './payments';
import PermitsReducers from './permits';
import PermitTypesReducers from './permit_types';

import AgencyTypeReducers from './agency_types';
import VehiclesReducers from './vehicles';
import CameraReducers from './cameras';
import ParkingLotReducers from './parking_lots';
import ParkingSlotReducers from './parking_slots';
import ParkingLotCameraReducers from './parking_lots_camera';
import ParkingSessionReducers from './parking_sessions';
import ReportReducers from './reports';
import ServerErrorReducers from './server_errors';
import ParkingLotVoiReducers from './parking_lot_voi';
import DetailedReportsReducers from './detailed_reports';
import RolesReducers from './roles';
import SideNavReducers from './side-navigation';
import ViolationReducers from './violations';
import CommentReducers from './comments';
import ActivityLogReducers from './activity_logs';
import NotificationReducers from './notifications';
import SubscriberReducers from './subscribers';
import SubscriberVehicleReducers from './subscriber_vehicles';
import { LOG_OUT } from 'actions/users';
import DisputeReducers from './disputes';
import PaymentActivityLogReducers from './payment_activity_logs';

const reducers = combineReducers({
  user: UserReducers,
  admin: AdminReducers,
  vehicles: VehiclesReducers,
  agency: AgencyReducers,
  agency_type: AgencyTypeReducers,
  ticket: TicketReducers,
  camera: CameraReducers,
  payments: PaymentsReducers,
  permits: PermitsReducers,
  permit_types: PermitTypesReducers,
  parking_lot: ParkingLotReducers,
  parking_slot: ParkingSlotReducers,
  parking_lot_camera: ParkingLotCameraReducers,
  parking_session: ParkingSessionReducers,
  parking_lot_voi: ParkingLotVoiReducers,
  report: ReportReducers,
  subscriber: SubscriberReducers,
  subscriber_vehicle: SubscriberVehicleReducers,
  server: ServerErrorReducers,
  detailedReports: DetailedReportsReducers,
  role: RolesReducers,
  side_nav: SideNavReducers,
  violation: ViolationReducers,
  comment: CommentReducers,
  activity_log: ActivityLogReducers,
  notification: NotificationReducers,
  dispute: DisputeReducers,
  payment_activity_log: PaymentActivityLogReducers
});

export default (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return reducers(state, action);
};
