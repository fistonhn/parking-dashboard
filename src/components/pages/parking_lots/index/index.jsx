import React from 'react';
import PropTypes from 'prop-types';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/parking_lots';
/* API */
import { filterFetcher } from 'api/parking_lots';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/parking_lots';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
/* Styles/Assets */
import styles from './index.module.sass';

class Index extends React.Component {
  state = {
    isDropdownFetching: true,
    dropdowns: {
      townManagers: [],
      parkingAdmins: []
    }
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isDropdownFetching } = this.state;
    return isResourceFetching || isDropdownFetching;
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      const { status } = record;
      return (
        <tr key={idx} onClick={() => history.push(`${match.path}/${record.id}`)}>
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td>{record.location.full_address}</td>
          <td>{record.phone}</td>
          <td>{record.email}</td>
          <td>{record.parking_admin ? record.parking_admin.name : null}</td>
          <td>{record.town_manager ? record.town_manager.name : null}</td>
          <td>{status.charAt(0).toUpperCase() + status.slice(1)}</td>
        </tr>
      );
    });
  };

  componentDidMount () {
    const { startFetching, currentUser } = this.props;
    Promise.all([
      startFetching(dropdownsSearch('parking_lot_parking_admins_filter', { admin_id: currentUser.id }))
        .then(response => this.setDropdowns('parkingAdmins', response.data)),
      startFetching(dropdownsSearch('parking_lot_town_managers_filter', { admin_id: currentUser.id }))
        .then(response => this.setDropdowns('townManagers', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { dropdowns: { townManagers, parkingAdmins } } = this.state;

    return (
      <IndexTable
        {...this.props}
        className={styles.table}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar showFilters={true} {...this.props} createRequiredPermission={permissions.CREATE_PARKINGLOT} label="Create New" title="Parking Lots Management" />}
        filterFields={filterFields(parkingAdmins, townManagers)}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="id" style={{ width: '6%', minWidth: 50 }}>Lot ID</th>
            <th attr="name" style={{ width: '14%', minWidth: 120 }}>Name</th>
            <th attr="full_address" style={{ width: '30%', minWidth: 250 }}>Location</th>
            <th attr="phone" style={{ width: '11%', minWidth: 100 }}>Contact Number</th>
            <th attr="email" style={{ width: '11%', minWidth: 100 }}>Email</th>
            <th attr="parking_admin" style={{ width: '11%', minWidth: 100 }}>Parking Operator</th>
            <th attr="town_manager" style={{ width: '11%', minWidth: 100 }}>Town Manager</th>
            <th attr="status" style={{ width: '6%', minWidth: 50 }}>Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="parking lots"
      >
      </IndexTable>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'parking_lot';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
