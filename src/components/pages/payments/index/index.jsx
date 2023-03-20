import React from 'react';
import PropTypes from 'prop-types';
import { ROLES } from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/payments';
/* API */
import { filterFetcher } from 'api/payments';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import AccessControl from 'components/helpers/access-control';
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/payments';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
/* Styles/Assets */
import { Button } from 'reactstrap';
import styles from './index.module.sass';

class Index extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  };

  renderRecords = () => {
    const { list, currentUser, history, match } = this.props;

    return list.map((record, idx) => {
      const { status } = record;
      const statusLabel = status === 'success'
        ? `${status.charAt(0).toUpperCase() + status.slice(1)}ful`
        : status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <tr key={idx}>
          <td>
            {record?.created_at ? displayUnixTimestamp(record?.created_at) : ''}
          </td>
          <td>{record?.parking_session?.user?.first_name}</td>
          <td>{record?.parking_session?.vehicle?.plate_number}</td>
          <td>{record?.parking_session?.parking_lot?.name}</td>
          <td>{record?.id}</td>
          <td>{record?.payment_type}</td>
          <td>{record?.amount}</td>
          <td>{statusLabel}</td>
          <td>
            <AccessControl
              currentRole={currentUser?.role_type}
              allowedRoles={[ROLES.SUPER_ADMIN]}
            >
              <Button className={styles.btn} onClick={() => history.push(`${match.path}/${record.id}`)}>
                Show Session
              </Button>
            </AccessControl>
          </td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        className={styles.table}
        isFetching={this.isFetching}
        toolbar={
          <BasicListToolbar
            showFilters={true}
            {...this.props}
            title="Payments"
          />
        }
        filterFields={filterFields()}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="payments.created_at" style={{ width: '6%', minWidth: 50 }}>Creation Date</th>
            <th attr="users.email" style={{ width: '14%', minWidth: 120 }}>Vehicle Owner Email</th>
            <th attr="vehicles.plate_number" style={{ width: '30%', minWidth: 250 }}>Vehicle Plate Number</th>
            <th attr="parking_lots.name" style={{ width: '11%', minWidth: 100 }}>Parking Lot Name</th>
            <th attr="payments.id" style={{ width: '11%', minWidth: 100 }}>Transaction Id</th>
            <th attr="payments.payment_method" style={{ width: '11%', minWidth: 100 }}>Transaction Type</th>
            <th attr="payments.amount" style={{ width: '11%', minWidth: 100 }}>Transaction Amount</th>
            <th attr="payments.status" style={{ width: '11%', minWidth: 100 }}>Transaction Status</th>
            <th disableSort style={{ width: '11%', minWidth: 100 }}></th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
        entityName="payments"
      ></IndexTable>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'payments';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
