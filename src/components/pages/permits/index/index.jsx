import React from 'react';
import PropTypes from 'prop-types';
import { ROLES } from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/permits';
/* API */
import { filterFetcher } from 'api/permits';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import AccessControl from 'components/helpers/access-control';
import { filterFields } from 'components/helpers/fields/permits';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
/* Styles/Assets */
import { Button } from 'reactstrap';
import styles from './index.module.sass';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as EyeIcon } from 'assets/eye_icon.svg';

import Filter from '../filter/index';

class Index extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  };

  renderRecords = () => {
    const { list } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td>{record?.permit_number}</td>
          <td>{record?.permit_type}</td>
          <td>{record?.issue_date}</td>
          <td>{record?.vehicle_details?.plate_number}</td>
          <td>{record?.user_details?.user_name}</td>
          <td>{record?.permit_expired?.toString()}</td>
          <td>{record?.expiry_date}</td>
          <td>

            <div className='d-flex' >
              <EyeIcon className="mt-2 mr-3" />
              <Button className="mr-3" color="danger" size="sm">
                    Revoke
              </Button>
              <EditIcon className="mt-2 svg-dark" />
            </div>
          </td>
        </tr>
      );
    });
  };

  render () {
    const { currentUser, history, match } = this.props;

    const viewPermitType = () => {
      history.push(`${match.path}/types`);
      window.location.reload();
    };

    return (
      <React.Fragment>
        <AccessControl
          currentRole={currentUser?.role_type}
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.PARKING_PERMITS]}
        >
          <div className={styles.title}>Permit Management</div>
          <div className={styles.sec1}>
            <Button className={styles.btn} color="primary">
            View Permit Application
            </Button>
            <Button className={styles.btn} onClick={viewPermitType} color="primary">
            Manage Permit Types
            </Button>
            <Button className={styles.btn} color="primary">
            Import Permit Data
            </Button>
          </div>
          <div className={styles.sec2}>
            <Filter/>
          </div>
          <IndexTable
            {...this.props}
            className={styles.table}
            isFetching={this.isFetching}
            toolbar={
              <BasicListToolbar
                showFilters={false}
                {...this.props}
                title="Permits"
              />
            }
            filterFields={filterFields()}
            filterFetcher={filterFetcher}
            resource={resource}
            columns={
              <React.Fragment>
                <th attr="permits.permit_number" style={{ width: '6%', minWidth: 50 }}>Permit Number</th>
                <th attr="permits.permit_type" style={{ width: '11%', minWidth: 120 }}>Permit Type</th>
                <th attr="permits.issue_date" style={{ width: '20%', minWidth: 250 }}>Issue Date</th>
                <th attr="parking_lots.vehicle_details.plate_number" style={{ width: '15%', minWidth: 100 }}>Vehicle Plate Number</th>
                <th attr="permits.user_details.user_name" style={{ width: '11%', minWidth: 100 }}>Vehicle Owner Name</th>
                <th attr="permits.permit_expired" style={{ width: '11%', minWidth: 100 }}>Permit Expired?</th>
                <th attr="permits.amount" style={{ width: '11%', minWidth: 100 }}>Expiry Date</th>
                <th attr="permits.expiry_date" style={{ width: '15%', minWidth: 100 }}>Action</th>
              </React.Fragment>
            }
            renderRecords={this.renderRecords}
            entityName="Permits"
          ></IndexTable>
        </AccessControl>
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'permits';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
