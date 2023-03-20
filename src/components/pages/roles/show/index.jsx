import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import constPermissions from 'config/permissions';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/roles';
import { invoke } from 'actions';
/* API */
import { fetchPermissionsAvailable, show, update } from 'api/roles';
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { fieldsShow } from 'components/helpers/fields/roles';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';
import doesUserHasPermission from 'components/modules/does_user_has_permission';
import checkFormError from 'components/modules/check_form_error';
/* Shared */
import PermissionTable from '../shared/permission_table';
import { isEmptyPermissions, normalizePermissions } from '../shared/permission_table/utils';

class Show extends React.Component {
  state = {
    isSaving: false,
    inputChanged: false,
    permissions: null,
    isAvailablePermissionsFetching: true,
    availablePermissions: [],
    errors: {}
  };

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isAvailablePermissionsFetching } = this.state;
    return isResourceFetching || isAvailablePermissionsFetching;
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setInputChanged = (event) => {
    checkFormError.call(this, event, { name: 'notEmpty' });
    this.setState({ inputChanged: true });
  }

  fieldProps = () => ({
    lSize: 4,
    iSize: 8,
    events: {
      onChange: this.setInputChanged
    }
  })

  transformErrorFunc = (errors) => {
    const { display_name: displayName, ...otherErrors } = errors;
    if (!displayName) return otherErrors;
    const nameError = displayName.map(errStr => errStr.replace('Display name', 'Name'));
    return {
      ...otherErrors,
      name: nameError
    };
  }

  save = () => {
    const { backPath } = this.props;
    const { permissions } = this.state;
    const values = setEmptyFields(fieldsShow(), this.formApi);
    values.permissions = permissions;
    updateRecord.bind(this, update, backPath)({ role: values });
  };

  handlePermissionTableChange = (permissions) => {
    this.setInputChanged();
    this.setState({ permissions });
  }

  handleFetchFinished = () => {
    const { permissions, availablePermissions, isAvailablePermissionsFetching } = this.state;
    const { record } = this.props;
    if (permissions) return;
    if (record && !isAvailablePermissionsFetching) {
      this.setState({
        permissions: normalizePermissions(record.permissions, availablePermissions)
      });
    }
  }

  renderFields () {
    const { currentUserPermissions } = this.props;
    return (
      renderFieldsWithGrid(
        fieldsShow(currentUserPermissions),
        2,
        6,
        { ...this.fieldProps(), errors: this.state.errors })
    );
  }

  values () {
    const { record } = this.props;
    const values = Object.assign({}, record);
    return values;
  }

  renderSaveButton = () => {
    const { isSaving, inputChanged, permissions } = this.state;
    if (!inputChanged || isEmptyPermissions(permissions)) return null;
    return (
      <div className="d-flex justify-content-end pt-2 pr-4">
        <Button
          status="success"
          onClick={this.save}
          size="md"
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </div>
    );
  }

  renderForm () {
    const { currentUserPermissions } = this.props;
    const { isSaving, permissions, availablePermissions } = this.state;
    const doesUserHasUpdatePermissions = doesUserHasPermission(
      currentUserPermissions,
      constPermissions.UPDATE_ROLE
    );

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <div className="mt-4 px-4">
            {this.renderFields()}
          </div>
          <PermissionTable
            value={permissions || []}
            availablePermissions={availablePermissions}
            onChange={this.handlePermissionTableChange}
            disabled={!doesUserHasUpdatePermissions || isSaving}
          />
        </Form>
      </fieldset>
    );
  }

  componentDidMount () {
    const { startFetching } = this.props;
    startFetching(fetchPermissionsAvailable())
      .then(res => {
        this.setState({
          isAvailablePermissionsFetching: false,
          availablePermissions: res.data
        }, () => {
          this.handleFetchFinished();
        });
      })
      .catch(() => {
        this.setState({
          isAvailablePermissionsFetching: false
        });
      });
  }

  componentDidUpdate (prevProps) {
    const { record } = this.props;
    if (!prevProps.record && record) {
      this.handleFetchFinished();
    }
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { backPath, record } = this.props;
    return (
      <div className="pb-4">
        <Breadcrumb
          title='Role Details'
          id={record.id}
          backPath={backPath}
        />
        {this.renderForm()}
        {this.renderSaveButton()}
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

Show.propTypes = {
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.object,
  backPath: PropTypes.string.isRequired,
  startFetching: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserPermissions: PropTypes.array
};

export default connectRecord('role', SET_RECORD, resourceFetcher(show), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Show
    )
  )
));
