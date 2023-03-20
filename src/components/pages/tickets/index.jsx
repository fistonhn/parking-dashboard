import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/tickets';
/* API */
import { filterFetcher } from 'api/parking/tickets';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import Ticket from 'components/base/tickets';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/tickets';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';

class Index extends React.Component {
  state = {
    isDropdownFetching: true,
    dropdowns: {
      officers: [],
      statuses: [],
      types: [],
      agencies: []
    }
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isDropdownFetching } = this.state;
    return isResourceFetching || isDropdownFetching;
  }

  renderRecords = () => {
    const { list, match } = this.props;

    return list.map((record, idx) => {
      record.type = this.typeDict[record.type];
      return <Ticket
        key={record.id}
        parkingTicket={record}
        url={match.url}
      />;
    });
  };

  setDropdownDict = types => this.typeDict = types.reduce((acc, curr) => { acc[curr.value] = curr.label; }, {})

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  componentDidMount () {
    const { currentUser, startFetching } = this.props;

    Promise.all([
      startFetching(dropdownsSearch('tickets_officers_filter', { admin_id: currentUser.id }))
        .then(response => this.setDropdowns('officers', response.data)),
      startFetching(dropdownsSearch('tickets_statuses_field'))
        .then(response => this.setDropdowns('statuses', response.data)),
      startFetching(dropdownsSearch('tickets_types_field'))
        .then(response => {
          this.setTypesDict(response.data);
          this.setDropdowns('types', response.data);
        }),
      startFetching(dropdownsSearch('tickets_agencies_list', { admin_id: currentUser.id }))
        .then(response => this.setDropdowns('agencies', response.data))
    ])
      .catch(this.handleFailed)
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { statuses, officers, types, agencies } = this.state.dropdowns;
    return (
      <IndexTable
        isFetching={this.isFetching}
        {...this.props}
        toolbar={ <BasicListToolbar showFilters={true} {...this.props} title="Tickets"/>}
        filterFields={filterFields(officers, statuses, types, agencies)}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th disableSort>#</th>
            <th disableSort>Violation Name</th>
            <th disableSort>Parking Lot Name</th>
            <th disableSort>Date</th>
            <th disableSort>Officer</th>
            <th disableSort>Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
      >
      </IndexTable>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired
};

const resource = 'ticket';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
