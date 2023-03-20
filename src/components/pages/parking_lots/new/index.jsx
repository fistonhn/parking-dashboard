import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Form } from 'informed';
import { isEmpty } from 'underscore';
import { cloneDeep } from 'lodash';
import LocationForm from '../shared/location/form';
import SettingSection from '../shared/setting_section';
import Rules from './rules';
import Header from './header';
/* Actions */
import { invoke } from 'actions';
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/parking_lots';
/* API */
import { create } from 'api/parking_lots';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import {
  renderFieldsWithGrid,
  renderImageField
} from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fieldsNew, exampleData } from 'components/helpers/fields/parking_lots';
import Loader from 'components/helpers/loader';
import { exampleData as exampleLocationData } from 'components/helpers/fields/location';
import { FieldType } from 'components/helpers/form_fields';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import setEmptyFields from 'components/modules/set_empty_fields';
import styles from './new.module.sass';

class New extends React.Component {
  state = {
    isSaving: false,
    isDropdownFetching: true,
    currentLocation: exampleLocationData(),
    inputChanged: false,
    showParkingRulesSection: false,
    dropdowns: {},
    errors: {}
  };

  static contextType = AlertMessagesContext;

  isFetching = () => {
    const { isDropdownFetching } = this.state;
    return isDropdownFetching;
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

  backParkingRule = () => {
    this.setState({ showParkingRulesSection: false });
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

  save = (rules = []) => {
    const { backPath } = this.props;
    this.setState({ isSaving: true });

    const values = setEmptyFields(fieldsNew(), this.formApi);
    const { values: settingValues } = this.settingFormApi.getState();
    values.setting = settingValues;
    values.location = cloneDeep(this.state.currentLocation);
    values.avatar = this.formApi.getValue('avatar');
    values.rules = rules;
    values.allow_save = isEmpty(rules) ? 0 : 1;

    saveRecord
      .call(this, create, isEmpty(rules) ? null : backPath, values)
      .then(() => {
        if (isEmpty(rules)) {
          this.setState({
            showParkingRulesSection: true,
            agencyId: values.agency_id
          });
        }
      });
  };

  renderFields () {
    const { dropdowns } = this.state;

    return renderFieldsWithGrid(
      fieldsNew(
        dropdowns.townManagers,
        dropdowns.parkingAdmins,
        dropdowns.agencies,
        this.renderLocationModal.bind(this)
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

  renderSetting () {
    const defaultData = {
      overtime: 900,
      parked: 1800,
      period: 1800,
      rate: 0.25,
      incremental_rate: 60
    };
    return (
      <SettingSection
        fieldProps={this.fieldProps()}
        isSaving={this.state.isSaving}
        setFormApi={this.setSettingFormApi}
        record={defaultData}
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
            onClick={() => this.save()}
            className={styles.btnSave}
            size="md"
            isLoading={isSaving}
          >
            {'Next >'}
          </Button>
        </Col>
      </Row>
    );
  };

  renderForm () {
    const { isSaving } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form
          getApi={this.setFormApi}
          initialValues={exampleData()}
          className={styles.form}
        >
          <Row>
            <Col xs={3}>
              {renderImageField(
                { name: 'avatar', label: '', type: FieldType.FILE_FIELD },
                this.fieldProps()
              )}
            </Col>
            <Col xs={9} className={styles.formFields}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderRulesForm () {
    return <fieldset></fieldset>;
  }

  componentDidMount () {
    const { startFetching } = this.props;
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
    const { backPath } = this.props;
    const { showParkingRulesSection, errors, isSaving, agencyId } = this.state;

    if (this.isFetching()) {
      return <Loader />;
    }

    return (
      <div className={styles.container}>
        <Header
          backPath={backPath}
          showParkingRulesSection={showParkingRulesSection}
        />
        {showParkingRulesSection && (
          <Rules
            {...this.props}
            save={this.save}
            isSaving={isSaving}
            backParkingRule={this.backParkingRule}
            errors={errors}
            agencyId={agencyId}
          />
        )}
        <div className={showParkingRulesSection ? 'd-none' : ''}>
          <div className={`${styles.hint} bg-grey-light`}>
            <p className="general-text-2 m-0">
              Fields marked with an asterisk (*) are mandatory.
            </p>
          </div>
          {this.renderForm()}
          {this.renderSetting()}
          <div className="mt-1" />
          {this.renderSaveButton()}
        </div>
      </div>
    );
  }
}

function mapDispatch (dispatch) {
  return {
    ...bindActionCreators(
      {
        setRecord: invoke(SET_RECORD),
        setListElement: invoke(SET_LIST_ELEMENT)
      },
      dispatch
    )
  };
}

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

export default connect(null, mapDispatch)(withFetching(withCurrentUser(New)));
