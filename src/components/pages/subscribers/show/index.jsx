import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/subscribers';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/subscribers';
/* Base */
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { fieldsShow } from 'components/helpers/fields/subscribers';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Loader from 'components/helpers/loader';
/* Modules */
import updateRecord from 'components/modules/form_actions/update_record';
import withFetching from 'components/modules/with_fetching';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';
/* Pages */
import VehicleList from './vehicles';

class Show extends React.Component {
  static contextType = AlertMessagesContext

  state = {
    inputChanged: false,
    isSaving: false
  };

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  });

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  values = () => {
    const values = Object.assign({}, this.props.record);
    values.confirmed_at = displayUnixTimestamp(values.confirmed_at);
    values.created_at = displayUnixTimestamp(values.created_at);
    values.updated_at = displayUnixTimestamp(values.updated_at);
    return values;
  };

  save = () => {
    const { backPath } = this.props;
    const values = setEmptyFields(fieldsShow(), this.formApi);
    updateRecord.bind(this, update, backPath)(values);
  };

  renderFields () {
    const { currentUserPermissions } = this.props;
    return renderFieldsWithGrid(fieldsShow(currentUserPermissions), 2, 6, { ...this.fieldProps(), errors: this.state.errors });
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
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
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form
          getApi={this.setFormApi}
          initialValues={this.values()}
          className="mt-4 px-4"
        >
          {this.renderFields()}
        </Form>
      </fieldset>
    );
  }

  render () {
    const { isResourceFetching, backPath, record } = this.props;
    if (isResourceFetching) {
      return <Loader />;
    }
    const { inputChanged } = this.state;
    return (
      <div className="pb-4">
        <Breadcrumb
          title={`${record.first_name} ${record.last_name}`}
          id={record.id}
          backPath={backPath}
        />
        {this.renderForm()}
        {inputChanged && this.renderSaveButton()}
        <div className="p-4">List of Vehicles Owned: {record.vehicles_owned}</div>
        <VehicleList
          subscriberId={record.id}
          vehiclesList={record.vehicles_list}
          backPath={backPath}
        />
      </div>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUserPermissions: PropTypes.array,
  isResourceFetching: PropTypes.bool,
  record: PropTypes.object
};

const mapDispatch = (dispatch) => {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
};

export default connectRecord(
  'subscriber',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(
    withFetching(
      withCurrentUser(Show)
    )
  )
);
