import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import AdminRoute from 'routes/admins';
import DashboardRoute from 'routes/dashboard';
import AgencyRoute from 'routes/agencies';
import AgencyTypesRoute from 'routes/agency_types';
import VehicleRoute from 'routes/vehicles';
import CameraRoute from 'routes/cameras';
import TicketRoute from 'routes/tickets';
import ParkingLotRoute from 'routes/parking_lots';
import PaymentRoute from 'routes/payments';
import ParkingSlotRoute from 'routes/parking_slots';
import ReportRoute from 'routes/reports';
import ProfileRoute from 'routes/profile';
import PrivateRoute from 'routes/private_route';
import ParkingLotCameras from 'routes/parking_lots_camera';
import RoleRoute from 'routes/roles';
import NotificationRoute from 'routes/notifications';
import SubscriberRoute from 'routes/subscribers';
import PermitsRoute from 'routes/permits';
import ViolationRoute from 'routes/violations';
import DisputeRoute from 'routes/disputes';

function MainContent (props) {
  const { match } = props;

  return (
    <div>
      <PrivateRoute path={`${match.path}`} component={DashboardRoute} />
      <PrivateRoute path={`${match.path}/profile`} component={ProfileRoute} />
      <PrivateRoute path={`${match.path}/admins`} component={AdminRoute} />
      <PrivateRoute path={`${match.path}/subscribers`} component={SubscriberRoute} />
      <PrivateRoute path={`${match.path}/permits`} component={PermitsRoute} />
      <PrivateRoute path={`${match.path}/agencies`} component={AgencyRoute} />
      <PrivateRoute path={`${match.path}/vehicles`} component={VehicleRoute} />
      <PrivateRoute
        path={`${match.path}/agency_types`}
        component={AgencyTypesRoute}
      />
      <PrivateRoute path={`${match.path}/tickets`} component={TicketRoute} />
      <PrivateRoute path={`${match.path}/cameras`} component={CameraRoute} />
      <PrivateRoute path={`${match.path}/payments`} component={PaymentRoute} />
      <PrivateRoute
        path={`${match.path}/parking_lots`}
        component={ParkingLotRoute}
      />
      <PrivateRoute
        path={`${match.path}/parking_slots`}
        component={ParkingSlotRoute}
      />
      <PrivateRoute
        path={`${match.path}/live/parking_lots`}
        component={ParkingLotCameras}
      />
      <PrivateRoute path={`${match.path}/reports`} component={ReportRoute} />
      <PrivateRoute path={`${match.path}/roles`} component={RoleRoute} />
      <PrivateRoute path={`${match.path}/disputes`} component={DisputeRoute} />
      <PrivateRoute
        path={`${match.path}/violations`}
        component={ViolationRoute}
      />
      <PrivateRoute
        path={`${match.path}/notifications`}
        component={NotificationRoute}
      />

    </div>
  );
}

MainContent.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(MainContent);
