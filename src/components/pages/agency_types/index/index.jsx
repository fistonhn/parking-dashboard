import React from 'react';
import PropTypes from 'prop-types';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/agency_types';
/* API */
import { filterFetcher, destroy } from 'api/agency_types';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import ConfirmationModal from 'components/helpers/modals/confirmation';
import FullscreenLoader from 'components/helpers/fullscreen_loader';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';
import deleteRecord from 'components/modules/form_actions/delete_record';
/* Styles */
import styles from './index.module.sass';
/* Assets */
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';

class Index extends React.Component {
  state = {
    isModalOpen: false,
    isDeleting: false
  };

  static contextType = AlertMessagesContext;

  isFetching = () => this.props.isResourceFetching;

  handleDeleteAgencyType = (agencyTypeId) => (e) => {
    e.stopPropagation();
    this.agencyTypeId = agencyTypeId;
    this.setState({ isModalOpen: true });
  };

  handleModalAccept = () => {
    this.setState({ isModalOpen: false });
    deleteRecord.call(this, destroy, this.agencyTypeId);
  };

  handleModalCancel = () => {
    this.setState({ isModalOpen: false });
  };

  onRecordClick = (record) => () => {
    const { history, match } = this.props;
    history.push(`${match.path}/${record.id}`);
  };

  renderRecords = () => {
    const { currentUserPermissions, list } = this.props;
    return list.map((record, idx) => {
      return (
        <tr
          key={idx}
          className={styles.tableRow}
          onClick={this.onRecordClick(record)}
        >
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td className={styles.buttonWrapper}>
            {record.removable && (
              <PermissibleRender
                userPermissions={currentUserPermissions}
                requiredPermission={permissions.DELETE_AGENCYTYPE}
              >
                <TrashIcon
                  className={styles.icon}
                  onClick={this.handleDeleteAgencyType(record.id)}
                />
              </PermissibleRender>
            )}
          </td>
        </tr>
      );
    });
  };

  render () {
    const { isModalOpen, isDeleting } = this.state;
    return (
      <React.Fragment>
        <IndexTable
          {...this.props}
          isFetching={this.isFetching}
          toolbar={
            <BasicListToolbar
              showFilters={true}
              {...this.props}
              createRequiredPermission={permissions.CREATE_AGENCYTYPE}
              label="Create Type"
              title="Law Enforcement Agency Types"
            />
          }
          filterFields={[]}
          filterFetcher={filterFetcher}
          resource={resource}
          columns={
            <React.Fragment>
              <th attr="agency_types.id">Law Enforcement Agency Type Id</th>
              <th attr="agency_types.name">Law Enforcement Agency Type Name</th>
              <th style={{ paddingLeft: '12px' }} disableSort>Actions</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
        ></IndexTable>
        <ConfirmationModal
          text='Are you sure that you want to delete this "Law Enforcement Agency Type"?'
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
  fetchData: PropTypes.func.isRequired,
  isResourceFetching: PropTypes.bool,
  currentUserPermissions: PropTypes.array
};

const resource = 'agency_type';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
