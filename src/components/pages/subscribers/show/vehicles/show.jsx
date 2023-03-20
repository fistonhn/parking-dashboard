import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import permissions from 'config/permissions';
import { Form } from 'informed';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/subscriber_vehicles';
import { invoke } from 'actions';
import { show, update } from 'api/subscriber_vehicles';
import { search as dropdownsSearch } from 'api/dropdowns';
import { searchV1 as dropdownsSearchV1 } from 'api/dropdowns';
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import setEmptyFields from 'components/modules/set_empty_fields';
import Breadcrumb from 'components/base/breadcrumb';
import Toggle from 'components/base/toggle';

import { fieldImages, fieldsShow } from 'components/helpers/fields/subscriber_vehicles';

import Button from 'components/base/button';
import ConfirmationModal from 'components/helpers/modals/confirmation';

import { AlertMessagesContext } from 'components/helpers/alert_messages';

import { displayUnixTimestamp } from 'components/helpers';
import Loader from 'components/helpers/loader';
import PermissibleRender from 'components/modules/permissible_render';
/* Module */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import ParkingHistoryLogs from './parking_history_logs';
import { Row } from 'reactstrap';
import styles from './show.module.sass';
import { tr } from 'faker/lib/locales';

class Show extends React.Component {
    state = {
      isDropdownFetching: false,
      isSaving: false,
      inputChanged: false,
      dropdowns: {
        statuses: [],
        manufacturers: []
      },
      errors: {},
      selectedVehicle: null,
      toggle: null
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

    save = () => {
      const { backPath } = this.props;
      const subscriberId = this.props.match.params.subscriberId;
      const updatedBackPath = `${backPath}/${subscriberId}`;

      const values = setEmptyFields(fieldsShow(), this.formApi);
      console.log('values from form API', values);
      updateRecord.bind(this, update, updatedBackPath)({
        vehicle: values
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

    values = () => {
      const { record } = this.props;
      const status = this.state.dropdowns.statuses.find((status) => status.label === record.status);
      // const manufacturer = this.state.dropdowns.manufacturers.find((manufacturer) => manufacturer.label === record.manufacturer.label);
      const values = Object.assign({}, record);
      values.created_at = displayUnixTimestamp(record.created_at);
      values.updated_at = displayUnixTimestamp(record.updated_at);
      values.plate_number = record.plate_number ? record.plate_number : null;
      values.manufacturer_id = record.manufacturer?.id || null;
      values.email = record.user ? record.user.email : null;
      values.first_name = record.user ? record.user.first_name : null;
      values.last_name = record.user ? record.user.first_name : null;
      values.status = record.status;
      values.images = record.registration_card ? [record.registration_card] : ['https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png'];
      // values.exempted = exempted?.value;

      return values;
    };

    onStatusChange = record => (_, event) => {
      event.stopPropagation();
      this.setState({ selectedVehicle: record, toggle: this.state.toggle !== true });
    }

    handleModalAccept = () => {
      const { setListElement, setRecord } = this.props;
      const { selectedVehicle, toggle } = this.state;
      const data = {
        vehicle: {
          plate_number: selectedVehicle.plate_number,
          model: selectedVehicle.model,
          manufacturer_id: selectedVehicle.manufacturer.id,
          validated: toggle === true
        }
      };
      this.setState({ isSaving: true });
      update({ id: selectedVehicle.id, data })
        .then((res) => {
          setListElement(res.data);
          setRecord(res.data);
        })
        .catch(() => {
          this.context.addAlertMessages([{
            type: 'Error',
            text: 'Something went wrong. Please try again.'
          }]);
          this.setState({ toggle: !this.state.toggle });
        })
        .finally(() => {
          this.setState({ selectedVehicle: null, isSaving: false });
        });
    }

    handleModalCancel = () => {
      this.setState({ selectedVehicle: null, toggle: !this.state.toggle });
    }

    renderFields () {
      const { currentUserPermissions, record } = this.props;
      const { statuses, manufacturers } = this.state.dropdowns;
      const { manufacturer } = record;

      return renderFieldsWithGrid(
        fieldsShow(currentUserPermissions, manufacturers, { label: manufacturer?.name, value: manufacturer?.id }),
        2,
        6,
        { ...this.fieldProps(), errors: this.state.errors });
    }

    renderForm () {
      const { isSaving, inputChanged } = this.state;
      const values = this.values();
      const { currentUserPermissions, record } = this.props;

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
                  <p className={styles.card_label}>Vehicle Registration Card</p>
                  {this.renderVideoImage()}
                </Row>
                }
              </div>
              <div className={styles.validated}>
                <p>Validated</p>
                <PermissibleRender
                  userPermissions={currentUserPermissions}
                  requiredPermission={permissions.UPDATE_VEHICLE}
                >
                  <Toggle
                    onChange={this.onStatusChange(record)}
                    value={this.state.toggle === true}
                  />
                </PermissibleRender>
              </div>

              {inputChanged && this.renderSaveButton()}
            </Form>
          </fieldset>
        ));
    }

    componentDidMount () {
      const { startFetching, record } = this.props;
      Promise.all([
        startFetching(dropdownsSearch('vehicle_statuses_field'))
          .then(response => this.setDropdowns('statuses', response.data)),
        startFetching(dropdownsSearchV1('manufacturers_list'))
          .then(response => this.setDropdowns('manufacturers', response.data))
      ])
        .finally(() => this.setState({ isDropdownFetching: false, toggle: record?.validated }));
    }

    componentWillUnmount () {
      window.location.reload();
    }

    render () {
      const { backPath, record } = this.props;
      const subscriberId = this.props.match.params.subscriberId;
      const selectedVehicle = this.state.selectedVehicle;

      if (this.isFetching()) {
        return <Loader />;
      }
      return (
        <div className="pb-4">
          <Breadcrumb
            title="Vehicles Details"
            id={record.id}
            backPath={`${backPath}/${subscriberId}`}
          />
          {!isArrayEmpty(this.state.dropdowns.statuses) && !isArrayEmpty(this.state.dropdowns.manufacturers) ? this.renderForm() : null}
          <ParkingHistoryLogs backPath={this.props.backPath} />
          <ConfirmationModal
            text={
              selectedVehicle
                ? `Are you sure that you want to ${this.state.toggle === false ? 'Non-validate' : 'Validate'} vehicle with ID ${selectedVehicle.id}?`
                : ''
            }
            accept={this.handleModalAccept}
            cancel={this.handleModalCancel}
            isOpen={!!selectedVehicle}
          />
          {/* <FullscreenLoader isLoading={isSaving} /> */}
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
  'subscriber_vehicle',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

const isArrayEmpty = (array) => {
  if (!Array.isArray(array)) return true;

  return array.length === 0;
};
