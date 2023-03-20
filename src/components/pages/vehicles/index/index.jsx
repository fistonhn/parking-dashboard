import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/vehicles';
/* API */
import { filterFetcher } from 'api/vehicles';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/vehicles';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
class Index extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props;

    return isResourceFetching;
  }

  renderRecords = () => {
    const { list, match, history } = this.props;

    return list.map((record, idx) => {
      const { status } = record;
      return (
        <tr key={idx} onClick={() => history.push(`${match.path}/${record.id}`)}>
          <td>{record?.created_at ? displayUnixTimestamp(record?.created_at) : ''}</td>
          <td>{record?.plate_number || ''}</td>
          <td>{record?.manufacturer?.name || ''}</td>
          <td>{record?.user?.email || ''}</td>
          <td>{record?.user?.first_name || ''}</td>
          <td>{record?.user?.last_name || ''}</td>
          <td>{status.charAt(0).toUpperCase() + status.slice(1) || ''}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar showFilters={true} {...this.props} title="Vehicles" />}
        filterFields={filterFields()}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="created_at" style={{ width: '6%', minWidth: 50 }}>Vehicle Registered On</th>
            <th attr="plate_number" style={{ width: '7%', minWidth: 120 }}>Vehicle Plate Number</th>
            <th attr="manufacturer_id" style={{ width: '7%', minWidth: 120 }}>Vehicle Manufacturer</th>
            <th attr="users.email" style={{ width: '30%', minWidth: 250 }}>Owner Email</th>
            <th attr="users.first_name" style={{ width: '11%', minWidth: 100 }}>Vehicle Owner First Name</th>
            <th attr="users.last_name" style={{ width: '11%', minWidth: 100 }}>Vehicle Owner Last Name</th>
            <th attr="status" style={{ width: '11%', minWidth: 100 }}>Vehicle Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="Vehicles"
      >
      </IndexTable>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'vehicles';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
