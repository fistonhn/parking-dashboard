import React from 'react';
import PropTypes from 'prop-types';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/agencies';
/* API */
import { filterFetcher, destroy } from 'api/agencies';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { filterFields } from 'components/helpers/fields/agencies';
import ConfirmationModal from 'components/helpers/modals/confirmation';
import FullscreenLoader from 'components/helpers/fullscreen_loader';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import PermissibleRender from 'components/modules/permissible_render';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import deleteRecord from 'components/modules/form_actions/delete_record';
/* Styles */
import styles from './index.module.sass';
/* Assets */
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';

class Index extends React.Component {
  state = {
    isDropdownFetching: true,
    isModalOpen: false,
    isDeleting: false,
    toButtonClick: false,
    dropdowns: {
      agencyTypes: [],
      managers: []
    }
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    return this.props.isResourceFetching || this.state.isDropdownFetching;
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  handleDeleteAgency = (agencyId) => {
    this.agencyId = agencyId;
    this.setState({ isModalOpen: true });
  }

  handleModalAccept = () => {
    this.setState({ isModalOpen: false });
    deleteRecord.call(this, destroy, this.agencyId);
  }

  handleModalCancel = () => {
    this.setState({ isModalOpen: false });
  }

  onRecordClick = (record) => () => {
    const { history, match } = this.props;
    history.push(`${match.path}/${record.id}`);
  };

  renderRecords = () => {
    const { list, match, history, currentUserPermissions } = this.props;

    return list.map((record, idx) => {
      const { status } = record;
      return (
        <tr key={idx} className={styles.tableRow} onClick={this.state.toButtonClick === false && this.onRecordClick(record)}>
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td>{record.manager?.name}</td>
          <td>{record?.agency_type?.name}</td>
          <td>{status.charAt(0).toUpperCase() + status.slice(1)}</td>
          <td className={styles.buttonWrapper}>
            <PermissibleRender
              userPermissions={currentUserPermissions}
              requiredPermission={permissions.UPDATE_AGENCY}
            >
              <EditIcon
                className={`svg-dark position-relative ${styles.icon}`}
                onClick={() => history.push(`${match.path}/${record.id}`)}
              />
            </PermissibleRender>
            {record.can_deleted &&
              <PermissibleRender
                userPermissions={currentUserPermissions}
                requiredPermission={permissions.DELETE_AGENCY}
              >
                <TrashIcon
                  className={styles.icon}
                  onMouseEnter={() => this.setState({ toButtonClick: true }) }
                  onMouseLeave={() => this.setState({ toButtonClick: false }) }
                  onClick={() => this.handleDeleteAgency(record.id)}
                />
              </PermissibleRender>
            }
          </td>
        </tr>
      );
    });
  };

  componentDidMount () {
    const { startFetching } = this.props;
    Promise.all([
      startFetching(dropdownsSearch('agency_type'))
        .then(response => this.setDropdowns('agencyTypes', response.data)),
      startFetching(dropdownsSearch('admins_by_role-manager'))
        .then(response => this.setDropdowns('managers', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { isModalOpen, isDeleting } = this.state;
    return (
      <React.Fragment>
        <IndexTable
          {...this.props}
          isFetching={this.isFetching}
          toolbar={ <BasicListToolbar showFilters={true} {...this.props} createRequiredPermission={permissions.CREATE_AGENCY} label="Create Agency" title="Law Enforcement Agencies Management"/> }
          filterFields={filterFields(this.state.dropdowns.agencyTypes, this.state.dropdowns.managers)}
          filterFetcher={filterFetcher}
          resource={resource}
          columns={
            <React.Fragment>
              <th attr="agencies.id">Law Enforcement Agency ID</th>
              <th attr="agencies.name">Law Enforcement Agency Name</th>
              <th attr="admins.name">Law Enforcement Manager</th>
              <th attr="agencies.types">Law Enforcement Agency Type</th>
              <th attr="agencies.status">Status</th>
              <th style={{ paddingLeft: '12px' }} disableSort>Actions</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
          entityName="agencies"
        />
        <ConfirmationModal
          text="Are you sure that you want to delete this Law Enforcement Agency?"
          accept={this.handleModalAccept}
          cancel={this.handleModalCancel}
          isOpen={isModalOpen}
        />
        <FullscreenLoader isLoading={isDeleting} />
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool,
  currentUserPermissions: PropTypes.array
};

const resource = 'agency';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
