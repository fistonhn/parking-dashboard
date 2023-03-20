import React from 'react';
import PropTypes from 'prop-types';
/* Actions */
import { SET_LIST } from 'actions/parking_lots_camera';
/* API */
import { filterFetcher } from 'api/parking_lots';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { liveFootageFilterFields } from 'components/helpers/fields/parking_lots';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
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
      return (
        <tr key={idx} onClick={() => history.push(`${match.path}/${record.id}`, { record: record })} >
          <td>{record.name}</td>
          <td>{record.id ? record.id : null}</td>
          <td>{record.location.full_address ? record.location.full_address : null}</td>
          <td>{record.available_cameras}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar showFilters={true} {...this.props} title="Live footage" />}
        filterFields={liveFootageFilterFields()}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="name">Parking lot name</th>
            <th attr="id">Parking lot ID</th>
            <th attr="full_address">Location</th>
            <th attr="available_cameras">Available Cameras</th>
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
  match: PropTypes.object.isRequired
};

const resource = 'parking_lot_camera';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
