import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
/* Actions */
import { SET_LIST } from 'actions/subscriber_vehicles';
/* API */
import { index as indexSubscriberVehicles } from 'api/subscriber_vehicles';
/* Base */
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';

class Index extends React.Component {
  static contextType = AlertMessagesContext;

  isFetching = () => this.props.isResourceFetching;

  onRecordClick = (id) => () => {
    const { backPath, subscriberId } = this.props;
    this.props.history.push(`/dashboard/subscribers/${subscriberId}/vehicles/${id}`, { backPath: `${backPath}/${subscriberId}` });
  }

  renderRecords = () => {
    const { vehiclesList } = this.props;
    return vehiclesList.map((record, idx) => (
      <tr key={idx} onClick={this.onRecordClick(record.id)}>
        <td>{record.id}</td>
        <td>{record.plate_number}</td>
        <td>{record.registration_state}</td>
        <td>{record.manufacturer}</td>
        <td>{record.status}</td>
      </tr>
    ));
  };

  render () {
    const { vehiclesList } = this.props;
    const total = vehiclesList.length;
    return (
      <IndexTable
        {...this.props}
        total={total}
        isFetching={this.isFetching}
        resource={resource}
        filterFetcher={indexSubscriberVehicles}
        shouldUpdateURLQuery={false}
        columns={
          <React.Fragment>
            <th disableSort>Vehicle Id</th>
            <th disableSort>Plate Number</th>
            <th disableSort>Registration State</th>
            <th disableSort>Manufacturer</th>
            <th disableSort>Status</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="Subscriber Vehicles"
      />
      // <div>sdsf</div>
    );
  }
}

Index.propTypes = {
  backPath: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  subscriberId: PropTypes.number
};

const resource = 'subscriber_vehicle';

export default withRouter(connectList(
  resource,
  SET_LIST,
  resourceFetcher(indexSubscriberVehicles, resource),
  withFetching(Index),
  { fetchCondition: () => true }
));
