import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import { Modal, ModalBody, Col, Row, Alert } from 'reactstrap';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import styles from './permit_type_model.module.sass';
import { ReactComponent as ClearIcon } from 'assets/clear_icon.svg';
/* Base */
import Breadcrumb from 'components/base/breadcrumb';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fieldsNew } from 'components/helpers/fields/create_permit_type';

/* API */
import { search as dropdownsSearch } from 'api/dropdowns';

import saveRecord from 'components/modules/form_actions/save_record';
import { create } from 'api/permit_types';

class DateModal extends React.Component {
    state = {
      isSaving: false,
      isDropdownFetching: true,
      status: null,
      validity: '',
      payment_type: '',
      all_parking_lots: '',
      parking_hour_from: ''
    }

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
        const { backPath } = this.props;
        saveRecord.call(this, create, backPath, values);
      };

      renderFields () {
        const validity = this.state.validity;
        const all_parking_lots = this.state.all_parking_lots;
        const payment_type = this.state.payment_type;
        const parking_hour_from = this.state.parking_hour_from;

        return renderFieldsWithGrid(fieldsNew(validity, all_parking_lots, payment_type, parking_hour_from), 1, 12, { ...this.fieldProps(), errors: this.state.errors });
      }

      renderSaveButton = (toggleModal) => {
        const { isSaving, status, permit_type_name } = this.state;
        return (
          <div>
            {status === 201 && (
              <Alert color="success">
                {`The ${permit_type_name} permit type has been created`}
              </Alert>
            )}
            <div className="d-flex justify-content-center pt-2 pr-4">
              <div className="mr-3">
                <Button
                  size="sm"
                  status="primary"
                  onClick={this.save}
                  isLoading={isSaving}
                >
                        Create
                </Button>
              </div>
              <div className="pr-3">
                <Button
                  size="sm"
                  status="secondary"
                  onClick={toggleModal}
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
        return (
          <fieldset disabled={isSaving}>
            <Form getApi={this.setFormApi} >
              {this.renderFields()}
            </Form>
          </fieldset>
        );
      }

      render () {
        const { isOpen, toggleModal, title, backPath } = this.props;

        return (
          <Modal centered={true} isOpen={isOpen} toggle={toggleModal}>
            <ModalBody className="p-5">
              {!!title &&
          <Row>
            <Col className={styles.titleWrapper}>
              <span>{title}</span>
              <ClearIcon className={styles.closeBtn} onClick={toggleModal} />
            </Col>
          </Row>
              }

              <div >
                <Breadcrumb
                  title=' '
                  backPath={backPath}
                />
                {this.renderForm()}
                {this.renderSaveButton(toggleModal)}
              </div>

            </ModalBody>
          </Modal>
        );
      }
};

DateModal.propTypes = {
  apply: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  maxDate: PropTypes.instanceOf(Date),
  title: PropTypes.string
};

export default DateModal;
