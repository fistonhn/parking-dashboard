import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import { generatePath } from 'react-router';
import LocationForm from '../location/form';
import { cloneDeep } from 'lodash';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/agencies';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/agencies';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import {
  renderFieldsWithGrid,
  renderImageField
} from 'components/base/forms/common_form';
import Button from 'components/base/button';
import Breadcrumb from 'components/base/breadcrumb';
/* Helpers */
import { fieldsShow } from 'components/helpers/fields/agencies';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import updateRecord from 'components/modules/form_actions/update_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import setEmptyFields from 'components/modules/set_empty_fields';
import withFetching from 'components/modules/with_fetching';
import Loader from 'components/helpers/loader';
import withCurrentUser from 'components/modules/with_current_user';

import { REQUIRED_FIELD_ERROR } from 'lang/en';

class Show extends React.Component {
  state = {
    isSaving: false,
    collapse: false,
    inputChanged: false,
    isDropdownFetching: true,
    currentLocation: null,
    dropdowns: {
      officers: [],
      managers: [],
      agencyTypes: [],
      parkingLots: []
    },
    errors: {}
  };

  static contextType = AlertMessagesContext;

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { currentLocation, isDropdownFetching } = this.state;
    return isResourceFetching || !currentLocation || isDropdownFetching;
  };

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  });

  setDropdowns = (key, data) =>
    this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } });

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  setCurrentLocation = (currentLocation) => {
    this.setState({
      inputChanged: true,
      currentLocation
    });
  };

  save = () => {
    const values = setEmptyFields(fieldsShow([], [], [], []), this.formApi);

    if (isArrayEmpty(values.officer_ids)) {
      this.setState({
        errors: {
          ...this.state.errors,
          officer_ids: [REQUIRED_FIELD_ERROR.OFFICER_FIELD_ERROR_MSG]
        }
      });

      return this.context.addAlertMessages([
        {
          type: 'Error',
          text: [REQUIRED_FIELD_ERROR.OFFICER_FIELD_ERROR_MSG]
        }
      ]);
    }

    values.avatar = this.formApi.getValue('avatar');
    values.location = cloneDeep(this.state.currentLocation);
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)({ agency: values });
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.manager_id = record.manager ? record.manager.id : null;
    values.agency_type_id = record.agency_type ? record.agency_type.id : null;
    values.officer_ids = record.officers
      ? record.officers.map((officer) => officer.id)
      : null;
    values.parking_lot_ids = record.parking_lots
      ? record.parking_lots.map((parking_lot) => parking_lot.id)
      : null;
    return values;
  };

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
  };

  renderFields () {
    const { currentUserPermissions, record } = this.props;
    const {
      officers,
      managers,
      parkingLots,
      agencyTypes
    } = this.state.dropdowns;
    const parkingLotsChose = record.parking_lots.map((parkingLot) => ({
      value: parkingLot.id,
      label: parkingLot.name
    }));
    return renderFieldsWithGrid(
      fieldsShow(
        officers,
        managers,
        agencyTypes,
        [...(parkingLotsChose || []), ...parkingLots],
        this.renderLocationModal.bind(this),
        currentUserPermissions
      ),
      2,
      6,
      { ...this.fieldProps(), errors: this.state.errors }
    );
  }

  renderLocationModal (field, props) {
    return (
      <LocationForm
        errors={props.errors}
        setCurrentLocation={this.setCurrentLocation}
        currentLocation={this.state.currentLocation}
      />
    );
  }

  renderForm () {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row className="no-gutters px-2">
            <Col sm={12} md={3}>
              {renderImageField(
                { name: 'avatar', label: '', type: FieldType.FILE_FIELD },
                this.fieldProps()
              )}
            </Col>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  componentDidMount () {
    const { startFetching, record } = this.props;
    if (record) {
      this.setState({ currentLocation: record.location });
    }
    Promise.all([
      startFetching(dropdownsSearch('agency_type')).then((response) =>
        this.setDropdowns('agencyTypes', response.data)
      ),
      startFetching(
        dropdownsSearch('admins_by_role-officer')
      ).then((response) => this.setDropdowns('officers', response.data)),
      startFetching(
        dropdownsSearch('admins_by_role-manager')
      ).then((response) => this.setDropdowns('managers', response.data)),
      startFetching(
        dropdownsSearch('parking_lots_without_agency_list')
      ).then((response) => this.setDropdowns('parkingLots', response.data))
    ]).finally(() => this.setState({ isDropdownFetching: false }));
  }

  componentDidUpdate (prevProps) {
    const { record } = this.props;
    if (!prevProps.record && record) {
      this.setState({ currentLocation: record.location });
    }
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { backPath, record } = this.props;
    const { inputChanged } = this.state;
    return (
      <div className="pb-4">
        <Breadcrumb
          title={record.name}
          id={record.id}
          customIdTitle="Agency ID:"
          backPath={backPath}
        />
        {this.renderForm()}
        {inputChanged && this.renderSaveButton()}
      </div>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    town_manager: PropTypes.object,
    manager: PropTypes.object,
    officers: PropTypes.arrayOf(PropTypes.object),
    parking_lots: PropTypes.arrayOf(PropTypes.object)
  }),
  currentUserPermissions: PropTypes.array
};

function mapDispatch (dispatch) {
  return bindActionCreators(
    { setListElement: invoke(SET_LIST_ELEMENT) },
    dispatch
  );
}

export default connectRecord(
  'agency',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

function isArrayEmpty (array) {
  return Array.isArray(array) ? array.length === 0 : true;
}
