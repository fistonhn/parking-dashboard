import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import { Modal, ModalBody, ModalHeader, Col, Row, Alert } from 'reactstrap';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { generatePath } from 'react-router';
/* Base */
import Breadcrumb from 'components/base/breadcrumb';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fieldsNew, selectedData } from 'components/helpers/fields/update_permit_type';
import { AlertMessagesContext } from 'components/helpers/alert_messages';

/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import updateRecordWithModel from 'components/modules/form_actions/update_record_with_model';
import { update } from 'api/permit_types';

class DateModal extends React.Component {
    state = {
      isSaving: false,
      isDropdownFetching: true,
      validity: '',
      payment_type: '',
      all_parking_lots: '',
      parking_hour_from: ''
    }

    static contextType = AlertMessagesContext;

    componentDidMount () {
      Promise.all([
        dropdownsSearch('parking_lot_list').then((response) => this.setState({ all_parking_lots: response.data }))
      ]).finally(() => this.setState({ isDropdownFetching: false }));
    }

    isFetching () {
      const { isDropdownFetching } = this.state;
      return isDropdownFetching;
    }

      fieldProps = () => ({
        lSize: 6,
        events: {
          onChange: this.handleInputChange
        }
      })

      handleInputChange = (event) => {
        const { name, value } = event?.target || {};

        const { values } = this.formApi.getState();

        const { parking_hour_from } = values;

        if (name === 'validity') {
          this.setState(({ validity: value }));
        }

        if (name === 'name') {
          this.setState(({ permit_type_name: value }));
        }

        if (name === 'payment_type') {
          this.setState(({ payment_type: value }));
        }

        if (parking_hour_from) {
          this.setState(({ parking_hour_from: parking_hour_from }));
        }
      }

      setFormApi = formApi => {
        this.formApi = formApi;
      };

      save = () => {
        const { values } = this.formApi.getState();
        const { backPath, record } = this.props;
        const path = generatePath(backPath, { id: record.id });
        updateRecordWithModel.call(this, update, path, values);
      };

      renderFields () {
        const { all_parking_lots, validity, payment_type, parking_hour_from } = this.state;
        const { record } = this.props;

        return renderFieldsWithGrid(fieldsNew(validity, all_parking_lots, payment_type, parking_hour_from, record), 1, 12, { ...this.fieldProps(), errors: this.state.errors });
      }

      renderSaveButton = (cancel) => {
        const { isSaving, status, permit_type_name } = this.state;
        return (
          <div>
            <div className="d-flex justify-content-center pt-2 pr-4">
              <div className="mr-3">
                <Button
                  size="sm"
                  status="primary"
                  onClick={this.save}
                  isLoading={isSaving}
                >
                        Save
                </Button>
              </div>
              <div className="pr-3">
                <Button
                  size="sm"
                  status="secondary"
                  onClick={cancel}
                >
                        Cancel
                </Button>
              </div>
            </div>
          </div>

        );
      }

      renderForm () {
        const { isSaving } = this.state;
        const { record } = this.props;

        return (
          <fieldset disabled={isSaving}>
            <Form
              getApi={this.setFormApi}
              initialValues={selectedData(record)}
            >
              {this.renderFields()}
            </Form>
          </fieldset>
        );
      }

      render () {
        const { isOpen, cancel, title, backPath } = this.props;

        return (
          <Modal centered={true} isOpen={isOpen} toggle={cancel}>
            <ModalBody className="p-5">
              <ModalHeader toggle={cancel} className=" h2-title justify-content-center">
                {!!title &&
                <Row>
                  <Col>{title}
                  </Col>
                </Row>
                }
              </ModalHeader>
              <div >
                <Breadcrumb
                  title=' '
                  backPath={backPath}
                />
                {this.renderForm()}
                {this.renderSaveButton(cancel)}
              </div>

            </ModalBody>
          </Modal>
        );
      }
};

DateModal.propTypes = {
  apply: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  maxDate: PropTypes.instanceOf(Date),
  title: PropTypes.string
};

export default DateModal;
