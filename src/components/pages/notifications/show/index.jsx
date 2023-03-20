import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/notifications';
import { invoke } from 'actions';
/* API */
import { show, update, filterFetcher, fetchNotiTypes } from 'api/notifications';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Breadcrumb from 'components/base/breadcrumb';
import CollapsableCard from 'components/base/collapsable_card';
import Button from 'components/base/button';
/* Helpers */
import { fieldImages, fieldVideos, fieldsShow } from 'components/helpers/fields/notifications';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Loader from 'components/helpers/loader';
import { displayUnixTimestamp } from 'components/helpers';
import { getValueByLabel } from 'components/helpers/forms';
/* Module */
import setEmptyFields from 'components/modules/set_empty_fields';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
/* Pages */

class Show extends React.Component {
  state = {
    isDropdownFetching: false,
    isSaving: false,
    inputChanged: false,
    errors: {}
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    return this.props.isResourceFetching || this.state.isDropdownFetching;
  }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  fieldProps = () => ({
    lSize: 4,
    iSize: 8,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  save = () => {
    const { backPath } = this.props;
    const values = setEmptyFields(fieldsShow(), this.formApi);
    updateRecord.bind(this, update, backPath)({ notification_message: values });
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.key = record.key || '';
    values.value = record.value || '';
    values.predefinedParams = ['username', 'plate_number', 'parking_lot', 'parking_space', 'violation_number', 'citation_number'];

    return values;
  };

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <div className="d-flex justify-content-end py-2 pr-4">
        <Button
          size="md"
          status="success"
          type="submit"
          isLoading={isSaving}
        >
            Save Changes
        </Button>
      </div>
    );
  }

  renderFields () {
    const values = this.values();
    const { currentUserPermissions } = this.props;
    return renderFieldsWithGrid(
      fieldsShow(currentUserPermissions),
      2,
      6,
      { ...this.fieldProps(), values: values, errors: this.state.errors });
  }

  renderForm () {
    const { isSaving, inputChanged } = this.state;
    const values = this.values();

    return (

      values.notification_type !== '' && (
        <fieldset disabled={isSaving}>
          <Form
            getApi={this.setFormApi}
            initialValues={values}
            className="mt-4"
            onSubmit={this.save}
          >
            <div className="px-4">
              {this.renderFields()}
            </div>
            {inputChanged && this.renderSaveButton()}
          </Form>
        </fieldset>
      ));
  }

  componentDidMount () {
    const { startFetching } = this.props;
    startFetching(fetchNotiTypes())
      .then(response => this.setState({ filterNotiField: response.data }))
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { backPath, record } = this.props;

    if (this.isFetching()) {
      return <Loader />;
    }
    return (
      <div className="pb-4">
        <Breadcrumb
          title="Notification Configurations Details"
          id={record.id}
          backPath={backPath}
        />
        { this.renderForm() }
      </div>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  startFetching: PropTypes.func.isRequired,
  currentUserPermissions: PropTypes.array,
  record: PropTypes.object
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectRecord(
  'notification',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

const isArrayEmpty = (array) => {
  if (!Array.isArray(array)) return true;

  return array.length === 0;
};
