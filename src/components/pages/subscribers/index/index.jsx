import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST, SET_LIST_ELEMENT } from 'actions/subscribers';
import { invoke } from 'actions';
/* API */
import { filterFetcher, update } from 'api/subscribers';
/* Base */
import Toggle from 'components/base/toggle';
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { filterFields } from 'components/helpers/fields/subscribers';
import ConfirmationModal from 'components/helpers/modals/confirmation';
import FullscreenLoader from 'components/helpers/fullscreen_loader';
/* Modules */
import connectList from 'components/modules/connect_list';
import PermissibleRender from 'components/modules/permissible_render';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  static contextType = AlertMessagesContext;

  state = {
    selectedUser: null,
    isSaving: false
  }

  isFetching = () => this.props.isResourceFetching;

  onStatusChange = record => (_, event) => {
    event.stopPropagation();
    this.setState({ selectedUser: record });
  }

  handleModalAccept = () => {
    const { setListElement } = this.props;
    const { selectedUser } = this.state;
    const data = {
      status: selectedUser.status === 'active' ? 'suspended' : 'active'
    };
    this.setState({ isSaving: true });
    update({ id: selectedUser.id, data })
      .then((res) => {
        setListElement(res.data);
      })
      .catch(() => {
        this.context.addAlertMessages([{
          type: 'Error',
          text: 'Something went wrong. Please try again.'
        }]);
      })
      .finally(() => {
        this.setState({ selectedUser: null, isSaving: false });
      });
  }

  handleModalCancel = () => {
    this.setState({ selectedUser: null });
  }

  renderRecords = () => {
    const { currentUserPermissions, list, history } = this.props;
    return list.map((record, idx) => (
      <tr
        key={idx}
        onClick={() => history.push(`${this.props.match.path}/${record.id}`)}
      >
        <td>{record.id}</td>
        <td>{record.first_name}</td>
        <td>{record.last_name}</td>
        <td>{record.email}</td>
        <td>{record.vehicles_owned}</td>
        <td>
          <PermissibleRender
            userPermissions={currentUserPermissions}
            requiredPermission={permissions.UPDATE_USER}
          >
            <Toggle
              onChange={this.onStatusChange(record)}
              value={record.status === 'active'}
            />
          </PermissibleRender>
        </td>
      </tr>
    ));
  };

  render () {
    const { isSaving, selectedUser } = this.state;
    return (
      <React.Fragment>
        <IndexTable
          {...this.props}
          isFetching={this.isFetching}
          toolbar={
            <BasicListToolbar
              showFilters={true}
              {...this.props}
              createRequiredPermission={permissions.CREATE_USER}
              title='Subscribers'
            />
          }
          resource={resource}
          columns={
            <React.Fragment>
              <th attr="id">User Id</th>
              <th attr="first_name">First Name</th>
              <th attr="last_name">Last Name</th>
              <th attr="email">Email</th>
              <th attr="vehicles_owned">Number of Vehicles Owned</th>
              <th attr="status">Status</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
          filterFields={filterFields}
          filterFetcher={filterFetcher}
        />
        <ConfirmationModal
          text={
            selectedUser
              ? `Are you sure that you want to ${selectedUser.status === 'active' ? 'deactivate' : 'activate'} user with ID ${selectedUser.id}?`
              : ''
          }
          accept={this.handleModalAccept}
          cancel={this.handleModalCancel}
          isOpen={!!selectedUser}
        />
        <FullscreenLoader isLoading={isSaving} />
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  currentUserPermissions: PropTypes.array,
  history: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  setListElement: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'subscriber';

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectList(resource, SET_LIST, resourceFetcher(filterFetcher, resource), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Index
    )
  )
));
