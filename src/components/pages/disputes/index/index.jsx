import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/disputes';
/* API */
import { filterFetcher } from 'api/disputes';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/disputes';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  state = {
    isDropdownFetching: true,
    dropdowns: {
      officers: [],
      parkingLots: [],
      statuses: [],
      types: []
    }
  };

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isDropdownFetching } = this.state;
    return isResourceFetching || isDropdownFetching;
  };

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      return (
        <tr
          key={idx}
          onClick={() => history.push(`${match.path}/${record.id}`)}
        >
          <td>{record.id}</td>
          <td>{displayUnixTimestamp(record.created_at)}</td>
          <td>{record.username}</td>
          <td>{record.email}</td>
          <td>{record.parking_lot.name}</td>
          <td>{record.dispute_type}</td>
          <td>{record.status}</td>
        </tr>
      );
    });
  };

  setDropdowns = (key, data) =>
    this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } });

  componentDidMount () {
    const { currentUser, startFetching } = this.props;

    Promise.all([
      startFetching(
        dropdownsSearch('admins_by_role-officer', { admin_id: currentUser.id })
      ).then((response) => this.setDropdowns('officers', response.data)),
      startFetching(dropdownsSearch('parking_lot_list')).then((response) =>
        this.setDropdowns('parkingLots', response.data)
      ),
      startFetching(
        dropdownsSearch('dispute_statuses_field')
      ).then((response) => this.setDropdowns('statuses', response.data)),
      startFetching(dropdownsSearch('dispute_types_field')).then((response) =>
        this.setDropdowns('types', response.data)
      )
    ])
      .catch(this.handleFailed)
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { officers, parkingLots, statuses, types } = this.state.dropdowns;
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={
          <BasicListToolbar
            showFilters={true}
            {...this.props}
            title="Disputes"
          />
        }
        filterFields={filterFields(
          officers,
          parkingLots,
          statuses,
          types
        )}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="disputes.id">Ticket ID</th>
            <th attr="disputes.created_at">Date</th>
            <th attr="users.first_name">Username</th>
            <th attr="users.email">Email</th>
            <th attr="parking_lots.name">Parking Lot</th>
            <th attr="dispute_type">Dispute Type</th>
            <th attr="status">Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
      />
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  startFetching: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'dispute';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
