import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/notifications';
/* API */
import { filterFetcher, fetchNotiTypes } from 'api/notifications';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { filterFields } from 'components/helpers/fields/notifications';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  state = {
    filterNotiField: []
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { filterNotiField } = this.state;
    return isResourceFetching || isEmpty(filterNotiField);
  }

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx} onClick={() => history.push(`${match.path}/${record.id}`) }>
          <td>{record.key.split('_').join(' ').replace(/(\b[a-z](?!\s))/, (x) => (x.toUpperCase()))}</td>
          <td>{record.value}</td>
        </tr>
      );
    });
  };

  componentDidMount () {
    const { startFetching } = this.props;
    startFetching(fetchNotiTypes())
      .then(response => this.setState({ filterNotiField: response.data }))
      .finally(() => this.setState({ isResourceFetching: false }));
  }

  render () {
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={ <BasicListToolbar showFilters={true} {...this.props} createRequiredPermission={permissions.CREATE_ADMIN} title='Notifications' label="Create Notification" /> }
        resource={resource}
        filterFields={filterFields(this.state.filterNotiField)}
        filterFetcher={filterFetcher}
        columns={
          <React.Fragment>
            <th disableSort style={{ width: '31%' }}>Notification Key</th>
            <th disableSort style={{ width: '58%' }}>Notification Value</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="accounts"
      >
      </IndexTable>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'notification';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
