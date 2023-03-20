import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { cloneDeep } from 'lodash';
import { ROLES } from 'config/permissions';

/* Actions */
import { SET_LIST } from 'actions/permit_types';
/* API */
import { filterFetcher, update, destroy } from 'api/permit_types';

/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import AccessControl from 'components/helpers/access-control';
import { filterFields } from 'components/helpers/fields/permit_types';
import Loader from 'components/helpers/loader';
import AreYouSureModal from 'components/helpers/modals/are_you_sure';
import UpdatePermitTypeModal from 'components/helpers/modals/update_permit_type';

/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import deleteRecord from 'components/modules/form_actions/delete_record';

/* Styles/Assets */
import styles from './index.module.sass';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as DeleteIcon } from 'assets/trash_icon.svg';

import NewPermitType from './new_permit_type';
import Sort from './sort/sort';

class Index extends React.Component {
  state = {
    isSaving: false,
    isUpdating: false,
    records: [],
    selectedRecord: {},
    isModalOpen: false,
    isEditModalOpen: false,
    isDeleting: false,
    permitTypeName: ''
  };

  isFetching = () => {
    return this.props.isResourceFetching;
  }

  handleDeleteRole = (permitTypeId) => {
    this.permitTypeId = permitTypeId;
    this.setState({ isModalOpen: true });
  }

  handleModalAccept = () => {
    this.setState({ isModalOpen: false });
    deleteRecord.call(this, destroy, this.permitTypeId);
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  handleModalCancel = () => {
    this.setState({ isModalOpen: false, isEditModalOpen: false });
  }

  isUpdatingStatus = () => {
    return this.state.isUpdating;
  }

  renderRecords = () => {
    const { list } = this.props;

    const changePermitType = (event, id) => {
      this.setState({ isUpdating: true });

      const status = event.target.value;

      update({ id, data: cloneDeep(status) })
        .then((res) => console.log('resss', res))
        .finally(() => {
          this.setState({ isUpdating: false });
        });
    };

    list.sort(function (a, b) { return b.id - a.id; });

    if (this.isFetching()) {
      return <Loader />;
    }

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td>{record?.name}</td>
          <td>
            {this.isUpdatingStatus() ? <Loader />
              : <Input size="sm"
                type="select"
                onChange = {(event) => changePermitType(event, record?.id)}
                style={{ color: record?.status === 'active' ? 'green' : 'red', width: '60%' }}
                className={styles.select}
              >
                <option>{record?.status}</option>
                <option>{record?.status === 'active' ? 'inactive' : 'active'}</option>
              </Input>
            }
          </td>
          <td>{record?.payment_type}</td>
          <td>{record?.hourly_rate}</td>
          <td>{`${record?.parking_hour_from} - ${record?.parking_hour_from}`}</td>
          <td>

            <div className='d-flex' >
              <EditIcon className="mt-3 mr-3 svg-dark"
                onClick={() => this.handleUpdatePermitType(record)}
              />
              <DeleteIcon
                className="mt-3 svg-red"
                onClick={() => this.handleDeletePermitType(record)}
              />
            </div>
          </td>
        </tr>
      );
    });
  };

  handleDeletePermitType = (record) => {
    this.permitTypeId = record.id;
    this.setState({ isModalOpen: true, permitTypeName: record.name });
  }

  handleUpdatePermitType = (record) => {
    this.permitTypeId = record.id;
    this.setState({ isEditModalOpen: true, selectedRecord: record });
  }

  static contextType = AlertMessagesContext;

  render () {
    const { currentUser, fetchData } = this.props;
    const { isModalOpen, permitTypeName, isEditModalOpen, selectedRecord } = this.state;

    return (
      <React.Fragment>
        <AccessControl
          currentRole={currentUser?.role_type}
          allowedRoles={[ROLES.SUPER_ADMIN, ROLES.PARKING_PERMITS]}
        >
          <div className={styles.title}> Manage Permit Types</div>
          <NewPermitType filter={this.filter} resetFilter={this.resetFilter} search={this.search} />

          <div className={styles.sec2}>
            <Sort/>
          </div>
          <IndexTable
            {...this.props}
            className={styles.table}
            isFetching={this.isFetching}
            toolbar={
              <BasicListToolbar
                showFilters={false}
                {...this.props}
                title="Permit Types"
              />
            }
            filterFields={filterFields()}
            filterFetcher={filterFetcher}
            resource={resource}
            columns={
              <React.Fragment>
                <th attr="permit_types.name" style={{ width: '6%', minWidth: 50 }}>Name</th>
                <th attr="permit_types.status" style={{ width: '11%', minWidth: 120 }}>Status</th>
                <th attr="permit_types.issue_date" style={{ width: '20%', minWidth: 250 }}>Paid/Free</th>
                <th attr="permit_types.cost_per_hour" style={{ width: '15%', minWidth: 100 }}>Cost Per Hour</th>
                <th attr="permit_types.time" style={{ width: '11%', minWidth: 100 }}>Time (From - To)</th>
                <th attr="permit_types.action" style={{ width: '15%', minWidth: 100 }}>Action</th>
              </React.Fragment>
            }
            renderRecords={this.renderRecords}
            entityName="Permit Types"
          ></IndexTable>
          <AreYouSureModal
            text={`This will delete the ${permitTypeName} permit type from the system. Any subscribers who may have paid for the permit type will be entitled to a refund, and their permits will be revoked. Instead, you may use the "deactivate" feature to prevent subscribers from applying for this permit type and delete it when all issued permits of this type have expired.`}
            toggle={this.toggle}
            accept={this.handleModalAccept}
            cancel={this.handleModalCancel}
            isOpen={isModalOpen}
            size="md"
            title='Are you sure?'
            footer='Do you want to proceed with deletion?'
          />
          <UpdatePermitTypeModal
            title="Edit Permit Type"
            record={selectedRecord}
            cancel={this.handleModalCancel}
            isOpen={isEditModalOpen}
            size="md"
            reload={fetchData}
          />

        </AccessControl>
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'permit_types';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
