import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { isEmpty } from 'underscore';
import { Col, Row } from 'reactstrap';
import { Form } from 'informed';
import LocationForm from '../shared/location/form';
import SettingSection from '../shared/setting_section';
import NearbyPlaces from '../shared/nearby_places';
import Header from '../shared/header';
import { cloneDeep } from 'lodash';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
import { invoke } from 'actions';
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { show, update, getNearbyPlaces } from 'api/parking_lots';
/* Base */
import {
  renderFieldsWithGrid,
  renderImageField
} from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
import { fieldsShow, fieldsShowMute } from 'components/helpers/fields/parking_lots';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import withCurrentUser from 'components/modules/with_current_user';
/* Styles/Assets */
import styles from './show.module.sass';
import doesUserHasPermission from 'components/modules/does_user_has_permission';
import permissions from 'config/permissions';

class Show extends React.Component {
  state = {
    isSaving: false,
    currentLocation: null,
    isDropdownFetching: true,
    isPlacesFetching: true,
    inputChanged: false,
    dropdowns: {},
    errors: {},
    nearbyPlaces: []
  };

  static contextType = AlertMessagesContext;

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { dropdowns, currentLocation } = this.state;
    return isResourceFetching || !currentLocation || isEmpty(dropdowns);
  };

  setDropdowns = (key, data) =>
    this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } });

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  setSettingFormApi = (formApi) => {
    this.settingFormApi = formApi;
  };

  setInputChanged = () => {
    this.setState({ inputChanged: true });
  };

  fieldProps = () => ({
    lSize: 4,
    iSize: 8,
    events: {
      onChange: () => this.setInputChanged()
    }
  });

  setCurrentLocation = (currentLocation) => {
    this.setState({
      inputChanged: true,
      currentLocation
    });
  };

  save = () => {
    const values = setEmptyFields(fieldsShow(), this.formApi);
    const { values: settingValues } = this.settingFormApi.getState();
    values.setting = settingValues;
    values.location = cloneDeep(this.state.currentLocation);
    values.avatar = this.formApi.getValue('avatar');

    updateRecord.bind(this, update, '/dashboard/parking_lots')(values);
  };

  fetchNearbyPlaces = async () => {
    const { match, startFetching } = this.props;
    try {
      const { data } = await startFetching(
        getNearbyPlaces({ parkingLotId: match.params.id })
      );
      this.setState({ nearbyPlaces: data.places[0] || [] });
    } finally {
      this.setState({ isPlacesFetching: false });
    }
  };

  renderFields () {
    const { dropdowns } = this.state;
    const { currentUserPermissions, history } = this.props;

    return renderFieldsWithGrid(
      history?.location?.state?.mute ? fieldsShowMute(
        dropdowns.townManagers,
        dropdowns.parkingAdmins,
        dropdowns.agencies,
        this.renderLocationModal.bind(this),
        currentUserPermissions
      )
        : fieldsShow(
          dropdowns.townManagers,
          dropdowns.parkingAdmins,
          dropdowns.agencies,
          this.renderLocationModal.bind(this),
          currentUserPermissions
        ),
      2,
      6,
      { ...this.fieldProps(), errors: this.state.errors }
    );
  }

  values () {
    const { record } = this.props;
    const values = Object.assign({}, record);

    values.town_manager_id = record.town_manager
      ? record.town_manager.id
      : null;
    values.parking_admin_id = record.parking_admin
      ? record.parking_admin.id
      : null;
    values.agency_id = record.agency
      ? record.agency.id
      : null;
    return values;
  }

  renderLocationModal (field, props) {
    const { currentUserPermissions } = this.props;
    return (
      <LocationForm
        errors={props.errors}
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
        disabled={
          !doesUserHasPermission(
            currentUserPermissions,
            permissions.UPDATE_PARKINGLOT
          )
        }
      />
    );
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            status="success"
            onClick={this.save}
            className={styles.btnSave}
            size="md"
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    );
  };

  renderForm () {
    const { isSaving } = this.state;
    const { record, currentUserPermissions, history } = this.props;
    const disabledAvatar = !doesUserHasPermission(
      currentUserPermissions,
      permissions.UPDATE_PARKINGLOT
    );

    return (
      <fieldset disabled={isSaving}>
        <Form
          getApi={this.setFormApi}
          initialValues={this.values()}
          className={styles.form}
        >
          <Row>
            <Col xs={3}>
              {renderImageField(
                {
                  name: 'avatar',
                  label: '',
                  type: FieldType.FILE_FIELD,
                  disabled: disabledAvatar
                },
                this.fieldProps()
              )}
            </Col>
            <Col xs={9} className={styles.formFields}>
              {this.renderFields()}
              <NavLink
                className={`highlight-text-1
                ${styles.numberOfSpaces}`}
                to={`/dashboard/parking_lots/${record.id}/parking_slots`}
              >
                { !history?.location?.state?.mute && `Numbers of Parking Spaces: ${record.spaces_count}` }
              </NavLink>
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderSetting () {
    const { record, currentUserPermissions } = this.props;
    return (
      <SettingSection
        fieldProps={this.fieldProps()}
        isSaving={this.state.isSaving}
        setFormApi={this.setSettingFormApi}
        record={record.setting}
        errors={this.state.errors}
        disabled={
          !doesUserHasPermission(
            currentUserPermissions,
            permissions.UPDATE_PARKINGLOT
          )
        }
      />
    );
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.record) {
      this.setState({ currentLocation: nextProps.record.location });
    }
  }

  componentDidMount () {
    const { startFetching, record } = this.props;
    if (record) {
      this.setState({ currentLocation: record.location });
    }
    this.fetchNearbyPlaces();
    Promise.all([
      startFetching(
        dropdownsSearch('admins_by_role-town_manager')
      ).then((response) => this.setDropdowns('townManagers', response.data)),
      startFetching(
        dropdownsSearch('admins_by_role-parking_admin')
      ).then((response) => this.setDropdowns('parkingAdmins', response.data))
    ]).finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { record, history } = this.props;
    const { inputChanged, isPlacesFetching, nearbyPlaces } = this.state;
    if (this.isFetching()) {
      return <Loader />;
    }

    const parkingLotLocation = {
      lat: record.location.ltd,
      lng: record.location.lng,
      name: record.name
    };
    return (
      <div className={styles.container}>
        <Header {...this.props} parentPath={this.props.match.url} />
        <div className={`${styles.hint} bg-grey-light`}>
          <p className="general-text-2 m-0">
            Fields marked with an asterisk (*) are mandatory.
          </p>
        </div>
        {this.renderForm()}
        <div className="p-3" />
        {!history?.location?.state?.mute && this.renderSetting()}
        <div className="mt-1" />
        <NearbyPlaces
          isLoading={isPlacesFetching}
          parkingLotLocation={parkingLotLocation}
          places={nearbyPlaces}
        />
        {inputChanged && !history?.location?.state?.mute && this.renderSaveButton()}
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return bindActionCreators(
    { setListElement: invoke(SET_LIST_ELEMENT) },
    dispatch
  );
}

Show.propTypes = {
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  location: PropTypes.object,
  record: PropTypes.object,
  currentUserPermissions: PropTypes.array,
  startFetching: PropTypes.func.isRequired
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);
