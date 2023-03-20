import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Form } from 'informed';
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/notifications';
/* API */
import { create, fetchNotiTypes } from 'api/notifications';
// import { search as dropdownsSearch } from 'api/notifications';
/* Base */
import Breadcrumb from 'components/base/breadcrumb';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fieldsNew, fieldsShow } from 'components/helpers/fields/notifications';
import Loader from 'components/helpers/loader';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class New extends React.Component {
  state = {
    isSaving: false,
    inputChanged: false,
    dropdowns: {
      roles: [],
      agencies: [],
      parkingLots: []
    },
    roleType: '',
    isDropdownFetching: true
  }

  static contextType = AlertMessagesContext

  isFetching () {
    const { isDropdownFetching } = this.state;
    return isDropdownFetching;
  }

  fieldProps = () => ({
    lSize: 4,
    iSize: 8,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  save = () => {
    const { values } = this.formApi.getState();
    const { backPath } = this.props;
    saveRecord.call(this, create, backPath, { notification_message: values });
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.key = record?.key || '';
    values.value = record?.value || '';
    values.predefinedParams = ['username', 'plate_number', 'parking_lot', 'parking_space', 'violation_number', 'citation_number'];

    return values;
  };

  renderFields () {
    const values = this.values();
    const { currentUserPermissions } = this.props;
    return renderFieldsWithGrid(
      fieldsNew(currentUserPermissions),
      2,
      6,
      { ...this.fieldProps(), values: values, errors: this.state.errors });
  }

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

  renderForm () {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi}>
          {this.renderFields()}
        </Form>
      </fieldset>
    );
  }

  componentDidMount () {
    const { startFetching } = this.props;
    startFetching(fetchNotiTypes())
      .then(response => this.setState({ filterNotiField: response.data }))
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { backPath } = this.props;
    return (
      <div className="pb-4">
        <Breadcrumb
          title='Create Notification Configuration'
          backPath={backPath}
        />
        {this.renderForm()}
        {this.renderSaveButton()}
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return { ...bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch) };
}

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  startFetching: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatch
)(withFetching(withCurrentUser(New)));
