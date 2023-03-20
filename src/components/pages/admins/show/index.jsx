import React from 'react';
import PropTypes from 'prop-types';
import permissions from 'config/permissions';
import { Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { generatePath } from 'react-router';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/admins';
import { invoke } from 'actions';
/* API */
import { show, update, destroy } from 'api/admins';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import { fieldsShow } from 'components/helpers/fields/admins';
import PasswordConfirmationModal from 'components/helpers/modals/password_confirmation';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import ConfirmationModal from 'components/helpers/modals/confirmation';
/* Module */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';
import deleteRecord from 'components/modules/form_actions/delete_record';
import withFetching from 'components/modules/with_fetching';
import Loader from 'components/helpers/loader';

class Show extends React.Component {
  state = {
    isSaving: false,
    defaultRecord: {},
    inputChanged: false,
    dropdowns: {
      roles: [],
      agencies: [],
      parkingLots: []
    },
    isDropdownFetching: true,
    modal: false,
    password_verification: '',
    errors: {},
    isModalOpen: false
  }

  static contextType = AlertMessagesContext

  isFetching () {
    const { isResourceFetching } = this.props;
    const { isDropdownFetching } = this.state;
    return isResourceFetching || isDropdownFetching;
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  fieldProps = () => ({
    lSize: 6,
    customAttr: {
      onChange: () => this.setState({ inputChanged: true })
    },
    events: {
      onChange: this.handleInputChange
    }
  })

  handleInputChange = (event) => {
    const { name } = event?.target || {};
    if (name !== 'role_type') {
      this.setState({ inputChanged: true });
      return;
    }
    this.setState({ inputChanged: true });
    setTimeout(this.fillAllParkingLots);
  }

  fillAllParkingLots = () => {
    const { dropdowns } = this.state;
    const roleType = this.formApi.getValue('role_type');
    if (roleType === 'town_manager') {
      const allParkingLotIds = dropdowns.parkingLots.map(p => p.value);
      this.formApi.setValue('parking_lot_ids', allParkingLotIds);
    } else if (roleType === 'parking_lot_manager') {
      this.formApi.setValue('parking_lot_ids', []);
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  toggleEditing = () => this.setState((prevState) => ({ isEditing: !prevState.isEditing }))

  toggleModal = () => this.setState(prevState => ({ modal: !prevState.modal }))

  handlePasswordSuccess = () => {
    const { values } = this.formApi.getState();
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.call(this, update, path, values);
  }

  save = () => {
    const values = setEmptyFields(this.fieldsForCommonForm(), this.formApi);
    values.avatar = this.formApi.getValue('avatar');
    if (this.formApi.getValue('password')) {
      this.toggleModal();
    } else {
      const { backPath, record } = this.props;
      const path = generatePath(backPath, { id: record.id });
      updateRecord.bind(this, update, path)(values);
    }
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.agency_id = record.agency_id ? record.agency_id.toString() : null;
    return values;
  };

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <div className="d-flex justify-content-end pt-2 pr-4">
        <Button
          size="md"
          status="success"
          onClick={this.save}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </div>
    );
  }

  handleDeleteUser = (userId) => {
    this.userId = userId;
    this.setState({ isModalOpen: true });
  }

  handleModalAccept = () => {
    this.setState({ isModalOpen: false });
    const values = setEmptyFields(this.fieldsForCommonForm(), this.formApi);
    values.status = 'suspended';
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)(values);
  }

  handleModalCancel = () => {
    this.setState({ isModalOpen: false });
  }

  renderDeleteButton = () => {
    const { record, currentUserPermissions } = this.props;
    return (
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={permissions.DELETE_USER}
      >
        <div className="d-flex justify-content-end pt-2 pr-4">
          <Button
            size="md"
            status="danger"
            onClick={() => this.handleDeleteUser(record.id)}
            // isLoading={isSaving}
          >
            Delete User
          </Button>
        </div>
      </PermissibleRender>
    );
  }

  renderFields () {
    return renderFieldsWithGrid(this.fieldsForCommonForm(), 2, 6, { ...this.fieldProps(), errors: this.state.errors });
  }

  renderForm () {
    const { record } = this.props;
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving || !record.actions.update}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row className="no-gutters px-2">
            <Col sm={12} md={3}>
              {renderImageField({ name: 'avatar', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  fieldsForCommonForm = () => {
    const { record, currentUserPermissions } = this.props;
    const { roles, agencies, parkingLots } = this.state.dropdowns;
    const roleType = this.formApi ? this.formApi.getValue('role_type') : record.role_type;
    const fieldsSet = fieldsShow(roles, agencies, parkingLots, roleType, currentUserPermissions);
    fieldsSet.push({
      name: 'password', label: 'Password', type: FieldType.PASSWORD_FIELD, filled: true
    });
    return fieldsSet;
  }

  componentDidMount () {
    const { startFetching } = this.props;
    Promise.all([
      startFetching(dropdownsSearch('role_type'))
        .then(response => this.setDropdowns('roles', response.data)),
      startFetching(dropdownsSearch('agency_list'))
        .then(response => this.setDropdowns('agencies', response.data)),
      startFetching(dropdownsSearch('parking_lot_list'))
        .then(response => this.setDropdowns('parkingLots', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { backPath, record } = this.props;
    const { inputChanged } = this.state;
    return (
      <div className="pb-4">
        <PasswordConfirmationModal
          toggleModal={this.toggleModal}
          isOpen={this.state.modal}
          handleSuccess={this.handlePasswordSuccess}
        />
        <Breadcrumb
          title={record.username}
          id={record.id}
          backPath={backPath}
        />
        {this.renderForm()}
        {inputChanged && this.renderSaveButton()}
        {this.renderDeleteButton()}
        <ConfirmationModal
          text="Are you sure that you want to delete this user?"
          accept={this.handleModalAccept}
          cancel={this.handleModalCancel}
          isOpen={this.state.isModalOpen}
        />
      </div>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  currentUserPermissions: PropTypes.array,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired
  }),
  startFetching: PropTypes.func.isRequired
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectRecord('admin', SET_RECORD, resourceFetcher(show), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(Show)
  )
));
