import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/roles';
/* API */
import { create, fetchPermissionsAvailable } from 'api/roles';
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import Loader from 'components/helpers/loader';
import { fieldsNew, exampleData } from 'components/helpers/fields/roles';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import checkFormError from 'components/modules/check_form_error';
/* Shared */
import PermissionTable from '../shared/permission_table';
import { isEmptyPermissions, normalizePermissions } from '../shared/permission_table/utils';

class New extends React.Component {
  constructor (props) {
    super(props);
    const paramRole = props.location.state?.role;
    const role = paramRole || {};
    this.isCloning = !!paramRole;
    const permissions = role.permissions || [];
    this.roleFull = !!role.full;
    this.state = {
      isSaving: false,
      permissions,
      isAvailablePermissionsFetching: true,
      availablePermissions: [],
      errors: {}
    };
    this.initialValues = {
      ...exampleData(),
      ...role
    };
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isAvailablePermissionsFetching } = this.state;
    return isAvailablePermissionsFetching;
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setInputChanged = (event) => {
    checkFormError.call(this, event, { name: 'notEmpty' });
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
    const values = setEmptyFields(fieldsNew(), this.formApi);
    values.allow_save = 1;
    values.permissions = permissions;
    values.full = this.roleFull;
    saveRecord.call(this, create, backPath, { role: values });
  };

  handlePermissionTableChange = (permissions) => {
    this.setState({ permissions });
  }

  renderFields () {
    return (
      renderFieldsWithGrid(
        fieldsNew(),
        2,
        6,
        { ...this.fieldProps(), errors: this.state.errors }
      )
    );
  }

  renderSaveButton = () => {
    const { isSaving, permissions } = this.state;
    if (isEmptyPermissions(permissions)) return null;
    const btnName = this.isCloning ? 'Clone' : 'Submit';
    return (
      <div className="d-flex justify-content-end pt-2 pr-4">
        <Button
          status="success"
          onClick={this.save}
          size="md"
          isLoading={isSaving}
        >
          {btnName}
        </Button>
      </div>
    );
  }

  renderForm () {
    const { isSaving, permissions, availablePermissions } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.initialValues}>
          <div className="mt-4 px-4">
            {this.renderFields()}
          </div>
          <PermissionTable
            value={permissions}
            availablePermissions={availablePermissions}
            onChange={this.handlePermissionTableChange}
            disabled={isSaving || this.isCloning}
          />
        </Form>
      </fieldset>
    );
  }

  componentDidMount () {
    const { startFetching } = this.props;
    startFetching(fetchPermissionsAvailable())
      .then(res => {
        this.setState(state => ({
          permissions: normalizePermissions(state.permissions, res.data),
          availablePermissions: res.data
        }));
      })
      .finally(() => {
        this.setState({
          isAvailablePermissionsFetching: false
        });
      });
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { backPath } = this.props;
    const title = this.isCloning ? 'Create a new role from clone' : 'Create a new role';
    return (
      <div className="pb-4">
        <Breadcrumb
          title={title}
          backPath={backPath}
        />
        {this.renderForm()}
        {this.renderSaveButton()}
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return {
    ...bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch)
  };
}

New.propTypes = {
  location: PropTypes.object.isRequired,
  backPath: PropTypes.string.isRequired,
  startFetching: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

export default connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(New)
  )
);
