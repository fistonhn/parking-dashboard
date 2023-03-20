import React from 'react';
import PropTypes from 'prop-types';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/parking_slots';
/* API */
import { filterFetcher } from 'api/parking_slots';
/* Base */
import IndexTable from 'components/base/table';
import Breadcrumb from 'components/base/breadcrumb';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import doesUserHasPermission from 'components/modules/does_user_has_permission';
/* Styles/Assets */
import styles from './parking_slots.module.sass';

class Index extends React.Component {
  isFetching = () => this.props.isResourceFetching;

  onRecordClick = (id) => () => {
    const { location, history } = this.props;
    history.push(
      `/dashboard/parking_slots/${id}`,
      { backPath: `${location.pathname}${location.search}` }
    );
  }

  renderRecords = () => {
    const { list, currentUserPermissions } = this.props;
    const hasReadPermission = doesUserHasPermission(currentUserPermissions, permissions.READ_PARKINGLOT);
    return list.map((record, idx) => (
      <tr
        key={idx}
        className={hasReadPermission ? '' : styles.defaultCursor}
        onClick={hasReadPermission ? this.onRecordClick(record.id) : null}
      >
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>{record.status}</td>
        <td>{record.archived ? 'True' : 'False'}</td>
      </tr>
    ));
  }

  render () {
    const { id } = this.props.match.params;
    return (
      <React.Fragment>
        <Breadcrumb
          title='Parking Slots'
          id={id}
          idPrefix='Parking Lot ID: '
          backPath={`/dashboard/parking_lots/${id}`}
        />
        <IndexTable
          isFetching={this.isFetching}
          {...this.props}
          toolbar={null}
          filterFields={[]}
          filterFetcher={filterFetcher}
          resource={resource}
          columns={
            <React.Fragment>
              <th disableSort>Parking Slot Id</th>
              <th disableSort>Parking Slot Title</th>
              <th disableSort>Status</th>
              <th disableSort>Archived</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
        />
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object,
  currentUserPermissions: PropTypes.array,
  isResourceFetching: PropTypes.bool.isRequired
};

const resource = 'parking_slot';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index)),
  { fetchCondition: () => true }
);
