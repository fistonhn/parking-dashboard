import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Nav } from 'reactstrap';
import DropdownNavigation from './dropdown_navigation';
import { ReactComponent as DashboardIcon } from 'assets/menu_icons/dashboard_icon.svg';
import { ReactComponent as AdminIcon } from 'assets/menu_icons/user_management_icon.svg';
import { ReactComponent as AgenciesIcon } from 'assets/menu_icons/law_enf_icon.svg';
import { ReactComponent as CameraIcon } from 'assets/menu_icons/stream_footages_icon.svg';
import { ReactComponent as ParkingLotIcon } from 'assets/menu_icons/parking_lot_icon.svg';
import { ReactComponent as ReportIcon } from 'assets/menu_icons/reports_icon.svg';
import { ReactComponent as SubscribersIcon } from 'assets/menu_icons/subscribers_management_icon.svg';
import { ReactComponent as VehiclesIcon } from 'assets/menu_icons/vehicles_management_icon.svg';
import { ReactComponent as PaymentsIcon } from 'assets/menu_icons/payments_transaction_icon.svg';
import { ReactComponent as ViolationsIcon } from 'assets/menu_icons/violations_icon.svg';
import { ReactComponent as DisputesIcon } from 'assets/menu_icons/disputes_icon.svg';
import { ReactComponent as NotificationsIcon } from 'assets/menu_icons/notifications_icon.svg';
import styles from './side-navigation.module.sass';
import permissions from 'config/permissions';
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';
import doesUserHasPermission from 'components/modules/does_user_has_permission';

const routes = {
  dashboard: '/dashboard',
  admins: '/dashboard/admins',
  agencyTypes: '/dashboard/agency_types',
  agencies: '/dashboard/agencies',
  parkingLots: '/dashboard/parking_lots',
  parkingLotsCamera: '/dashboard/live/parking_lots',
  reports: '/dashboard/reports',
  roles: '/dashboard/roles',
  subscribers: '/dashboard/subscribers',
  permits: '/dashboard/permits',
  vehicles: '/dashboard/vehicles',
  payments: '/dashboard/payments',
  disputes: '/dashboard/disputes',
  violations: '/dashboard/violations',
  notifications: '/dashboard/notifications',
  archive: ''
};

const isActive = (location, path) => (
  location ? (
    location.pathname === path ? 'selected-nav-point' : 'menu-points'
  ) : 'menu-points'
);

function SideNavigation ({ currentUserPermissions, location }) {
  const { openedTitle } = useSelector(({ side_nav }) => side_nav);

  return (
    <Nav vertical pills className={`${styles.sideNavigation} ${openedTitle && styles.noScroll} shadow-sm bg-white`}>
      <li>
        <Link className={`nav-link ${isActive(location, routes.dashboard)}`} to={routes.dashboard}>
          <DashboardIcon className="float-left mr-2" />
          <span className="d-none d-xl-block">
            Dashboard
          </span>
        </Link>
      </li>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_ADMIN}
      >
        <li>
          <DropdownNavigation title="Users Management"
            icon={<AdminIcon className="float-left mr-2" />}>
            <Link className={`nav-link ${isActive(location, routes.admins)}`} to={routes.admins}>User Accounts</Link>
            {doesUserHasPermission(currentUserPermissions, permissions.READ_ROLE) &&
              <Link className={`nav-link ${isActive(location, routes.roles)}`} to={routes.roles}>User Roles</Link>
            }
          </DropdownNavigation>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_USER}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.subscribers)}`} to={routes.subscribers}>
            <SubscribersIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Subscribers Management
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_ADMIN}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.permits)}`} to={routes.permits}>
            <ReportIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Permit Management
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_VEHICLE}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.vehicles)}`} to={routes.vehicles}>
            <VehiclesIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Vehicles Management
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_PARKINGLOT}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.parkingLots)}`} to={routes.parkingLots}>
            <ParkingLotIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Parking Lots Management
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_AGENCY}
      >
        <li>
          <DropdownNavigation title="Law Enforcement Agencies"
            icon={<AgenciesIcon className="float-left mr-2"/>}>
            {doesUserHasPermission(currentUserPermissions, permissions.READ_AGENCYTYPE) && (
              <Link className={`nav-link ${isActive(location, routes.agencyTypes)}`} to={routes.agencyTypes}>
                Law Enforcement Agency Types
              </Link>
            )}
            <Link className={`nav-link ${isActive(location, routes.agencies)}`} to={routes.agencies}>Law Enforcement Agencies Management</Link>
          </DropdownNavigation>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_PAYMENT}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.payments)}`} to={routes.payments}>
            <PaymentsIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Payment Transactions
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_DISPUTE}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.disputes)}`} to={routes.disputes}>
            <DisputesIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Disputes
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_VIOLATION}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.violations)}`} to={routes.violations}>
            <ViolationsIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Violations
            </span>
          </Link>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_NOTIFICATION}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.notifications)}`} to={routes.notifications}>
            <NotificationsIcon className="float-left mr-2"/>
            <span className="d-none d-xl-block">
              Notifications Configurations
            </span>
          </Link>
        </li>
      </PermissibleRender>

      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_CAMERA}
      >
        <li>
          <DropdownNavigation title="Videos Footage"
            icon={<CameraIcon className="float-left mr-2" />}>
            <Link className={`nav-link ${isActive(location, routes.parkingLotsCamera)}`} to={routes.parkingLotsCamera}>Live Streaming</Link>
            <Link className={`nav-link ${isActive(location, routes.archive)}`} to={routes.archive}>Archived Videos</Link>
          </DropdownNavigation>
        </li>
      </PermissibleRender>
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.READ_REPORT}
      >
        <li>
          <Link className={`nav-link ${isActive(location, routes.reports)}`} to={routes.reports}>
            <ReportIcon className="float-left mr-2" />
            <span className="d-none d-xl-block">
              System Reports
            </span>
          </Link>
        </li>
      </PermissibleRender>
    </Nav>
  );
}

SideNavigation.propTypes = {
  location: PropTypes.object.isRequired,
  currentUserPermissions: PropTypes.array.isRequired
};

export default withRouter(withCurrentUser(SideNavigation));
