import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import { withRouter } from 'react-router';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
/* Actions */
import { SET_RECORD } from 'actions/comments';
import { invoke } from 'actions';
/* API */
import { create } from 'api/comments';
/* Base */
import Button from 'components/base/button';
import { renderField } from 'components/base/forms/common_form';
/* Helpers */
import { fieldsNew } from 'components/helpers/fields/comments';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import FullscreenLoader from 'components/helpers/fullscreen_loader';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';

class CreateForm extends React.Component {
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

  handleModalToggle = () => {
    const { isOpen, setIsOpen } = this.props;
    setIsOpen(!isOpen);
  }

  save = () => {
    const { match, fetchList } = this.props;
    const values = setEmptyFields(fieldsNew, this.formApi);
    values.subject_id = match.params.id;
    values.subject_type = 'Parking::Violation';
    saveRecord.call(this, create, '', { comment: values })
      .then(() => {
        fetchList();
        this.handleModalToggle();
      });
  };

  renderFields () {
    return renderField(fieldsNew[0], { ...this.fieldProps(), errors: this.state.errors });
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <div className="d-flex justify-content-end pt-2 pr-4">
        <Button
          status="danger"
          className="mr-4"
          onClick={this.handleModalToggle}
          size="md"
        >
          CANCEL
        </Button>
        <Button
          color="success"
          onClick={this.save}
          size="md"
          isLoading={isSaving}
        >
          ADD
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
          className="mt-4 px-4"
        >
          {this.renderFields()}
        </Form>
      </fieldset>
    );
  }

  render () {
    const { isOpen } = this.props;
    const { isSaving } = this.state;
    return (
      <Modal
        isOpen={isOpen}
        toggle={this.handleModalToggle}
        size="md"
      >
        <ModalHeader className="mx-auto border-0">Add Comment</ModalHeader>
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter className="justify-content-center border-0 pb-4">
          {this.renderSaveButton()}
        </ModalFooter>
        <FullscreenLoader isLoading={isSaving} />
      </Modal>
    );
  }
}

function mapDispatch (dispatch) {
  return {
    ...bindActionCreators({ setRecord: invoke(SET_RECORD) }, dispatch)
  };
}

CreateForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(
  connect(null, mapDispatch)(
    withFetching(withCurrentUser(CreateForm))
  )
);
