import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
/* Actions */
import { invoke } from 'actions';
import { SET_LIST_ELEMENT, SET_RECORD } from 'actions/parking_slots';
/* API */
import { show, update } from 'api/parking_slots';
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { fieldsShow, fieldsShowMute } from 'components/helpers/fields/parking_slots';
import Loader from 'components/helpers/loader';
/* Modules */
import setEmptyFields from 'components/modules/set_empty_fields';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Show extends React.Component {
  static contextType = AlertMessagesContext

  state = {
    inputChanged: false,
    isSaving: false
  };

  isFetching = () => this.props.isResourceFetching;

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
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.archived = values.archived ? 'true' : 'false';
    return values;
  };

  save = () => {
    const values = setEmptyFields(fieldsShow(), this.formApi);
    const { location } = this.props;
    const backPath = location.state?.backPath || '';
    updateRecord.bind(this, update, backPath)(values);
  };

  renderInformation = () => {
    const { match, record, history } = this.props;
    const parkingSlotId = match.params.id;
    const sessionLink = `${match.path.replace(':id', parkingSlotId)}/parking_sessions`;
    return (
      <React.Fragment>
        <div className="general-text-1 pb-2">
          <span className="font-weight-bold">Updated By: </span>
          <span>{record.updated_by && record.updated_by.name || 'Unknown'}</span>
        </div>
        <div className="general-text-1 pb-2">
          <span className="font-weight-bold">Created At: </span>
          <span>{` ${displayUnixTimestamp(record.created_at)}`}</span>
        </div>
        <div className="general-text-1 pb-4">
          <span className="font-weight-bold">Last Update At:</span>
          <span>{` ${displayUnixTimestamp(record.updated_at)}`}</span>
        </div>
        { !history?.location?.state?.mute &&
          <Link to={sessionLink}>
            <span className="general-text-4 text-primary">Show Sessions</span>
          </Link>
        }
      </React.Fragment>
    );
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

  renderFields () {
    const { history } = this.props;
    console.log('currentUserPermissions');
    console.log(this.props.currentUserPermissions);
    return renderFieldsWithGrid(
      history?.location?.state?.mute
        ? fieldsShowMute(this.props.currentUserPermissions)
        : fieldsShow(this.props.currentUserPermissions), 2, 6, { ...this.fieldProps(), errors: this.state.errors }
    );
  }

  renderForm () {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form
          getApi={this.setFormApi}
          initialValues={this.values()}
          className="p-4"
        >
          {this.renderFields()}
          {this.renderInformation()}
        </Form>
      </fieldset>
    );
  }

  render () {
    if (this.isFetching()) {
      return <Loader/>;
    }
    const { location, record, history } = this.props;
    const { inputChanged } = this.state;
    return (
      <div className="pb-4">
        <Breadcrumb
          title='Parking Slot Details'
          id={record.id}
          backPath={location.state?.backPath || ''}
        />
        {this.renderForm()}
        {inputChanged && !history?.location?.state?.mute && (this.renderSaveButton())}
      </div>
    );
  }
}

Show.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentUserPermissions: PropTypes.array,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.object,
  match: PropTypes.object,
  startFetching: PropTypes.func.isRequired
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectRecord(
  'parking_slot',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);
