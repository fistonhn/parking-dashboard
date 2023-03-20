import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
/* Actions */
import { SET_LIST } from 'actions/parking_lot_voi';
/* API */
import { filterFetcher } from 'api/parking_lot_voi';
/* Base */
import IndexTable from 'components/base/table';
import BasicListToolbar from 'components/base/basic_list_toolbar';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/parking_lot_voi';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class VOITable extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  renderRecords = () => {
    return this.props.list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td>{displayUnixTimestamp(record.created_at)}</td>
          <td>{record.plate_number}</td>
          <td>{record.manufacturer?.name || ''}</td>
          <td>{record.model}</td>
          <td>{record.color}</td>
          <td>{record.violations_number}</td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar showFilters={true} {...this.props} title="Vehicles of Interest" />}
        filterFields={filterFields}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th disableSort>Date and Time</th>
            <th disableSort>Vehicle Plate Number</th>
            <th disableSort>Vehicle Manufacturer</th>
            <th disableSort>Vehicle Model</th>
            <th disableSort>Vehicle Color</th>
            <th disableSort>Violations Number</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="vehicles"
      />
    );
  }
}

VOITable.propTypes = {
  list: PropTypes.array,
  isResourceFetching: PropTypes.bool.isRequired
};

const resource = 'parking_lot_voi';

export default withRouter(connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(VOITable)),
  { fetchCondition: () => true }
));
