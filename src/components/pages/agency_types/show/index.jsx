import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/agency_types';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/agency_types';
/* Base */
import { renderField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { fieldsShow } from 'components/helpers/fields/agency_type';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
import setEmptyFields from 'components/modules/set_empty_fields';

class Show extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSaving: false,
      inputChanged: false,
      errors: {}
    };
  }

  static contextType = AlertMessagesContext

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  setInputChanged = () => {
    this.setState({ inputChanged: true });
  }

  fieldProps = () => ({ lSize: 6, events: { onChange: this.setInputChanged } })

  save = () => {
    const { backPath } = this.props;
    const values = setEmptyFields(fieldsShow(), this.formApi);
    updateRecord.bind(this, update, backPath)(values);
  };

  values () {
    const { record } = this.props;
    const values = Object.assign({}, record);
    return values;
  }

  renderFields () {
    const { currentUserPermissions } = this.props;
    return renderField(
      fieldsShow(currentUserPermissions)[0],
      { ...this.fieldProps(), errors: this.state.errors }
    );
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
    const { removable } = this.props.record;
    return (
      <fieldset disabled={isSaving || !removable}>
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
    const { inputChanged } = this.state;
    const { isResourceFetching, backPath, record } = this.props;
    if (isResourceFetching) {
      return <Loader />;
    }
    return (
      <div className="pb-4">
        <Breadcrumb
          title='Agency Type'
          id={record.id}
          backPath={backPath}
        />
        {this.renderForm()}
        {inputChanged && this.renderSaveButton()}
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUserPermissions: PropTypes.array,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    removable: PropTypes.bool
  }),
  startFetching: PropTypes.func.isRequired
};

export default connectRecord(
  'agency_type',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);
