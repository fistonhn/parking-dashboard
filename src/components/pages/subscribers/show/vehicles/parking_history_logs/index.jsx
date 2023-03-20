import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { isString } from 'lodash';
/* Actions */
import { SET_LIST } from 'actions/parking_sessions';
/* API */
import { subscriberVehicleSessionsFilterFetcher as filterFetcher } from 'api/parking_sessions';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { filterFields } from 'components/helpers/fields/parking_sessions';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import { displayUnixTimestamp } from '../../../../../helpers';

class Index extends React.Component {
  static contextType = AlertMessagesContext;

  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  onRecordTabClick = (arg) => (e) => {
    const { backPath, history } = this.props;
    const { id, subscriberId } = this.props.match.params;
    const name = e.target.id;
    switch (name) {
      case 'plate_number_tab':
        history.push(`/dashboard/vehicles/${id}`, { backPath: `/dashboard/subscribers/${subscriberId}/vehicles/${id}`, mute: true });
        break;
      case 'parking_lot_tab':
        history.push(`/dashboard/parking_lots/${arg.id}`, { backPath: `/dashboard/subscribers/${subscriberId}/vehicles/${id}`, mute: true });
        break;
      case 'parking_space_tab':
        history.push(`/dashboard/parking_slots/${arg.id}`, { backPath: `/dashboard/subscribers/${subscriberId}/vehicles/${id}`, mute: true });
        break;
      default:
        history.push(`/dashboard/subscribers/${subscriberId}/vehicles/${id}`, { backPath: `/dashboard/subscribers/${subscriberId}/vehicles/${id}` });
    }
  }

  renderRecords = () => {
    const { list } = this.props;
    return list.map((record, idx) => {
      const { check_in, check_out, status, vehicle, lot, slot, id } = record;
      return (
        <tr key={idx}>
          {/* <td>{}</td> */}
          <td>{check_in || ''}</td>
          <td>{check_out || ''}</td>
          <td>{status || ''}</td>
          <td id='plate_number_tab' onClick={this.onRecordTabClick()} > {vehicle?.plate_number || ''}</td>
          <td id='parking_lot_tab' onClick={this.onRecordTabClick(lot)} >{lot?.name || ''}</td>
          <td id='parking_space_tab' onClick={this.onRecordTabClick(slot)}>{slot?.name || ''}</td>
          <td id='log_id_tab' onClick={this.onRecordTabClick}>{id || ''}</td>
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
            title="Parking History Logs"
          />
        }
        filterFields={filterFields}
        filterFetcher={filterFetcher}
        resource={resource}
        shouldUpdateURLQuery={false}
        columns={
          <React.Fragment>
            <th disableSort>CheckIn Date</th>
            <th disableSort>CheckOut Date</th>
            <th disableSort>Status</th>
            <th disableSort>Vehicle Plate Number</th>
            <th disableSort>Parking Lot</th>
            <th disableSort>Parking Space</th>
            <th disableSort>Logs Records Number</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="parking_session"
      />
    );
  }
}

Index.propTypes = {
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired
};

const resource = 'parking_session';

export default withRouter(connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource, true),
  withFetching(withCurrentUser(Index)),
  { fetchCondition: () => true }
));
