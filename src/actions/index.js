/* eslint camelcase: "off" */

import * as AdminActions from './admins';
import * as TicketActions from './tickets';
import * as AgencyActions from './agencies';
import * as AgencyTypesActions from './agency_types';
import * as UserActions from './users';
import * as CameraActions from './cameras';
import * as PaymentsActions from './payments';
import * as ParkingLotActions from './parking_lots';
import * as VehiclesActions from './vehicles';
import * as ParkingSlotActions from './parking_slots';
import * as ParkingLotCameraActions from './parking_lots_camera';
import * as ParkingSessionActions from './parking_sessions';
import * as ReportActions from './reports';
import * as ParkingLotVoiActions from './parking_lot_voi';
import * as ServerErrorActions from './server_errors';
import * as DetailedReports from './detailed_reports';
import * as RoleActions from './roles';
import * as SideNavActions from './side_navigation';
import * as ViolationActions from './violations';
import * as CommentActions from './comments';
import * as ActivityLogActions from './activity_logs';
import * as NotificationActions from './notifications';
import * as SubscriberActions from './subscribers';
import * as DisputeActions from './disputes';
import * as SubscriberVehicleActions from './subscriber_vehicles';
import * as PaymentActivityLogActions from './payment_activity_logs';
import * as PermitsActions from './permits';
import * as PermitTypesActions from './permit_types';

const INIT_SET_TOKEN = 'APP_INIT_SET_TOKEN';
const INIT_SET_CURRENT_USER = 'APP_INIT_SET_CURRENT_USER';

const init_set_token = {
  type: INIT_SET_TOKEN
};

const init_set_current_user = {
  type: INIT_SET_CURRENT_USER
};

const invoke = (type) => {
  return (payload) => {
    return {
      type,
      payload
    };
  };
};

export {
  VehiclesActions,
  UserActions,
  AdminActions,
  AgencyActions,
  AgencyTypesActions,
  CameraActions,
  ParkingLotActions,
  PaymentsActions,
  ParkingSlotActions,
  ParkingLotCameraActions,
  ParkingSessionActions,
  ReportActions,
  TicketActions,
  DetailedReports,
  RoleActions,
  ViolationActions,
  CommentActions,
  ActivityLogActions,
  INIT_SET_TOKEN,
  INIT_SET_CURRENT_USER,
  init_set_token,
  init_set_current_user,
  ParkingLotVoiActions,
  ServerErrorActions,
  invoke,
  SideNavActions,
  NotificationActions,
  SubscriberActions,
  SubscriberVehicleActions,
  DisputeActions,
  PaymentActivityLogActions,
  PermitsActions,
  PermitTypesActions
};
