import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { isString } from 'lodash';
/* Actions */
import { SET_LIST } from 'actions/activity_logs';
/* API */
import { filterFetcherActivityLogs } from 'api/violations';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { filterFields } from 'components/helpers/fields/activity_logs';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import { displayUnixTimestamp } from '../../../../helpers';

class Index extends React.Component {
  static contextType = AlertMessagesContext;

  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  renderRecords = () => {
    const { list } = this.props;
    return list.map((record, idx) => {
      const { attribute, old_value, new_value, user, created_at } = record;
      return (
        <tr key={idx}>
          <td>{isString(attribute) ? attribute : JSON.stringify(attribute)}</td>
          <td>{isString(old_value) ? old_value : JSON.stringify(old_value)}</td>
          <td>{isString(new_value) ? new_value : JSON.stringify(new_value)}</td>
          <td>{isString(user) ? user : JSON.stringify(user)}</td>
          <td>{displayUnixTimestamp(created_at)}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={
          <BasicListToolbar
            {...this.props}
            showFilters={true}
            title="Activity Logs"
          />
        }
        filterFields={filterFields}
        filterFetcher={filterFetcherActivityLogs}
        resource={resource}
        shouldUpdateURLQuery={false}
        columns={
          <React.Fragment>
            <th disableSort>Type of change</th>
            <th disableSort>Old value</th>
            <th disableSort>New value</th>
            <th disableSort>Performed by</th>
            <th disableSort>Date and Time Occurred</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="logs"
      />
    );
  }
}

Index.propTypes = {
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired
};

const resource = 'activity_log';

export default withRouter(connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcherActivityLogs, resource, true),
  withFetching(withCurrentUser(Index)),
  { fetchCondition: () => true }
));
