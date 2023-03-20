import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';

/* Actions */
import { SET_LIST_ELEMENT, SET_RECORD } from 'actions/agency_types';
import { invoke } from 'actions';
/* API */
import { create } from 'api/agency_types';
/* Base */
import { renderField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import { fieldsNew, exampleData } from 'components/helpers/fields/agency_type';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';

class New extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSaving: false,
      errors: {}
    };
  }

  static contextType = AlertMessagesContext

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  fieldProps = () => ({ lSize: 6, iSize: 8, events: {} });

  save = () => {
    const { backPath } = this.props;
    const values = setEmptyFields(fieldsNew, this.formApi);
    saveRecord.call(this, create, backPath, values);
  };

  renderFields () {
    return renderField(fieldsNew[0], { ...this.fieldProps(), errors: this.state.errors });
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <div className="d-flex justify-content-end pt-2 pr-4">
        <Button
          color="success"
          onClick={this.save}
          size="md"
          isLoading={isSaving}
        >
          Submit
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
          initialValues={exampleData()}
          className="mt-4 px-4"
        >
          {this.renderFields()}
        </Form>
      </fieldset>
    );
  }

  render () {
    const { backPath } = this.props;
    return (
      <div className="pb-4">
        <Breadcrumb
          title='Create a new Law Enforcement Agency Type'
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
  backPath: PropTypes.string.isRequired
};

export default connect(null, mapDispatch)(withFetching(withCurrentUser(New)));
