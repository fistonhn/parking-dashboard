import React from 'react';
import PropTypes from 'prop-types';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/roles';
/* API */
import { filterFetcher, destroy } from 'api/roles';
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
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as CloneIcon } from 'assets/clone_icon.svg';
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';

class Index extends React.Component {
  state = {
    isModalOpen: false,
    isDeleting: false
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    return this.props.isResourceFetching;
  }

  handleDeleteRole = (roleId) => {
    this.roleId = roleId;
    this.setState({ isModalOpen: true });
  }

  handleModalAccept = () => {
    this.setState({ isModalOpen: false });
    deleteRecord.call(this, destroy, this.roleId);
  }

  handleModalCancel = () => {
    this.setState({ isModalOpen: false });
  }

  renderRecords = () => {
    const { list, match, history, currentUserPermissions } = this.props;

    return list.map((record, idx) => {
      const { predefined_role: predefinedRole, deletable } = record;
      return (
        <tr key={idx} className={styles.tableRow}>
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td className={styles.buttonWrapper}>
            {!predefinedRole &&
              <PermissibleRender
                userPermissions={currentUserPermissions}
                requiredPermission={permissions.UPDATE_ROLE}
              >
                <EditIcon
                  className={`svg-dark position-relative ${styles.icon}`}
                  onClick={() => history.push(`${match.path}/${record.id}`)}
                />
              </PermissibleRender>
            }
            <PermissibleRender
              userPermissions={currentUserPermissions}
              requiredPermission={permissions.CREATE_ROLE}
            >
              <CloneIcon
                className={styles.icon}
                onClick={() => history.push(`${match.path}/new`, { role: record })}
              />
            </PermissibleRender>
            {!predefinedRole && deletable &&
              <PermissibleRender
                userPermissions={currentUserPermissions}
                requiredPermission={permissions.DELETE_ROLE}
              >
                <TrashIcon
                  className={styles.icon}
                  onClick={() => this.handleDeleteRole(record.id)}
                />
              </PermissibleRender>
            }
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
          toolbar={<BasicListToolbar showFilters={false} {...this.props} createRequiredPermission={permissions.CREATE_ROLE} label="Create Role" title="Roles" />}
          filterFields={[]}
          filterFetcher={filterFetcher}
          resource={resource}
          columns={
            <React.Fragment>
              <th attr="id" style={{ width: '21%' }}>Role ID</th>
              <th attr="roles.display_name" style={{ width: '57%' }}>Role Name</th>
              <th disableSort style={{ width: '22%', paddingLeft: '12px' }}>Actions</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
          entityName="roles"
        >
        </IndexTable>
        <ConfirmationModal
          text="Are you sure that you want to delete this role?"
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

const resource = 'role';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(withCurrentUser(Index))
);
