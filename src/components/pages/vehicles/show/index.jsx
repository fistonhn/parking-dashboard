import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import { SET_RECORD, SET_LIST_ELEMENT, POP_LIST_ELEMENT } from 'actions/vehicles';
import { invoke } from 'actions';
import { show, update } from 'api/vehicles';
import { search as dropdownsSearch } from 'api/dropdowns';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Breadcrumb from 'components/base/breadcrumb';

import { fieldImages, fieldsShow, fieldsShowMuted } from 'components/helpers/fields/vehicles';

import Button from 'components/base/button';

import { AlertMessagesContext } from 'components/helpers/alert_messages';
import ConfirmationModal from 'components/helpers/modals/confirmation';

import { displayUnixTimestamp } from 'components/helpers';
import Loader from 'components/helpers/loader';
/* Module */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import { Row } from 'reactstrap';
import styles from './show.module.sass';

class Show extends React.Component {
    state = {
      isDropdownFetching: false,
      isSaving: false,
      inputChanged: false,
      dropdowns: {
        statuses: []
      },
      errors: {},
      isModalOpen: false
    }

    static contextType = AlertMessagesContext

    isFetching = () => {
      return this.props.isResourceFetching || this.state.isDropdownFetching;
    }

    setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

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

    handleSubmit = (values) => {
      const { status } = values;
      status === 'deleted' ? this.handleDeleteVehicle(values) : this.save(values);
    }

    save = (values) => {
      const { backPath } = this.props;
      updateRecord.bind(this, update, backPath)({
        status: values.status
      });
    }

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

    fieldPropsVideoImage = (type) => ({
      events: {},
      hideInput: true,
      ref: type === 'image' ? this.imageRef : this.videoRef,
      type,
      multipleFiles: false,
      isMaximized: true
    })

    renderVideoImage () {
      const { images } = this.formApi ? this.formApi.getValues() : {};
      return (
        renderImageField(
          fieldImages,
          this.fieldPropsVideoImage('image')
        )
      );
    }

    handleDeleteVehicle = (values) => {
      this.getValues = values;
      this.setState({ isModalOpen: true });
    }

    handleModalAccept = () => {
      this.setState({ isModalOpen: false });
      this.save(this.getValues);
    }

    handleModalCancel = () => {
      this.setState({ isModalOpen: false });
    }

    values = () => {
      const { record } = this.props;
      const status = this.state.dropdowns.statuses.find((status) => status.label === record.status);
      const values = Object.assign({}, record);
      values.created_at = displayUnixTimestamp(record.created_at);
      values.plate_number = record.plate_number ? record.plate_number : null;
      values.manufacturer = record.manufacturer?.name || null;
      values.email = record.user ? record.user.email : null;
      values.first_name = record.user ? record.user.first_name : null;
      values.last_name = record.user ? record.user.last_name : null;
      values.status = status?.value;
      values.images = record.registration_card ? [record.registration_card] : ['https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png'];
      // values.exempted = exempted?.value;
      return values;
    };

    renderFields () {
      const { currentUserPermissions, history } = this.props;
      const { statuses } = this.state.dropdowns;
      return renderFieldsWithGrid(
        history?.location?.state?.mute === true ? fieldsShowMuted(statuses, currentUserPermissions) : fieldsShow(statuses, currentUserPermissions),
        2,
        6,
        { ...this.fieldProps(), errors: this.state.errors });
    }

    renderForm () {
      const { isSaving, inputChanged } = this.state;
      const values = this.values();
      const { history } = this.props;

      return (
        values.status !== '' && (
          <fieldset disabled={isSaving}>
            <Form
              getApi={this.setFormApi}
              initialValues={values}
              className="mt-4"
              onSubmit={this.save}
            >
              <div className="px-4">
                {this.renderFields()}
                {values.images.length > 0 &&
                <Row>
                  <p className={styles.card_label}>Vechicle Registration Card</p>
                  {this.renderVideoImage()}
                </Row>
                }
              </div>
              {inputChanged && !history?.location?.state?.mute && this.renderSaveButton()}
            </Form>
          </fieldset>
        ));
    }

    componentDidMount () {
      const { startFetching, hi } = this.props;
      Promise.all([
        startFetching(dropdownsSearch('vehicle_statuses_field'))
          .then(response => this.setDropdowns('statuses', response.data))
      ])
        .finally(() => this.setState({ isDropdownFetching: false }));
    }

    componentWillUnmount () {
      window.location.reload();
    }

    render () {
      const { record, history, backPath } = this.props;
      const backPathUse = history?.location?.state?.backPath ? history.location.state.backPath : backPath;
      if (this.isFetching()) {
        return <Loader />;
      }
      return (
        <div className="pb-4">
          <Breadcrumb
            title="Vehicles Details"
            id={record.id ? record.id : ''}
            backPath={backPathUse}
          />
          {!isArrayEmpty(this.state.dropdowns.statuses) ? this.renderForm() : null}
          <ConfirmationModal
            text="Are you sure you would want to Delete the vehicle? Changing the status to Deleted will permanently remove the vehicle from the list and you will no longer be able to access it in the future"
            accept={this.handleModalAccept}
            cancel={this.handleModalCancel}
            isOpen={this.state.isModalOpen}
            cancelText={'Cancel'}
          />
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
  return bindActionCreators(
    { setListElement: invoke(SET_LIST_ELEMENT), popListElement: invoke(POP_LIST_ELEMENT) },
    dispatch
  );
}

export default connectRecord(
  'vehicles',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

const isArrayEmpty = (array) => {
  if (!Array.isArray(array)) return true;

  return array.length === 0;
};
