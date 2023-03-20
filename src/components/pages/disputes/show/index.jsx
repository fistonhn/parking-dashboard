import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/disputes';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/disputes';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Breadcrumb from 'components/base/breadcrumb';
import CollapsableCard from 'components/base/collapsable_card';
import Button from 'components/base/button';
/* Helpers */
import { fieldImages, fieldVideos, fieldsShow } from 'components/helpers/fields/disputes';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Loader from 'components/helpers/loader';
import { displayUnixTimestamp } from 'components/helpers';
import { getValueByLabel } from 'components/helpers/forms';
/* Module */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
/* Pages */
import Comments from './comments';

class Show extends React.Component {
  state = {
    isDropdownFetching: false,
    isSaving: false,
    inputChanged: false,
    dropdowns: {
      parkingLots: [],
      statuses: [],
      types: []
    },
    errors: {}
  }

  static contextType = AlertMessagesContext

  isFetching = () => {
    return this.props.isResourceFetching || this.state.isDropdownFetching;
  }

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

  save = (values) => {
    const { backPath } = this.props;
    const parkingDispute = {
      status: values.status
    };
    updateRecord.bind(this, update, backPath)(
      parkingDispute
    );
  }

  values = () => {
    const { record } = this.props;
    const status = this.state.dropdowns.statuses.find((status) => status.label === record.status);
    const values = Object.assign({}, record);
    values.username = record.username || '';
    values.email = record.email || '';
    values.created_at = displayUnixTimestamp(record.created_at);
    values.parking_lot = record.parking_lot?.name || null;
    values.status = status?.value || null;
    values.dispute_type = record.dispute_type || null;

    return values;
  };

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

  renderFields () {
    const { currentUserPermissions, record } = this.props;
    const values = Object.assign({}, record);

    const { parkingLots, types, statuses } = this.state.dropdowns;
    return renderFieldsWithGrid(
      fieldsShow(parkingLots, types, statuses, values.status, currentUserPermissions),
      2,
      6,
      { ...this.fieldProps(), errors: this.state.errors });
  }

  renderForm () {
    const { isSaving, inputChanged } = this.state;
    const values = this.values();

    return (

      values.status !== '' && values.disputes_type !== '') && (
      <fieldset disabled={isSaving}>
        <Form
          getApi={this.setFormApi}
          initialValues={values}
          className="mt-4"
          onSubmit={this.save}
        >
          <div className="px-4">
            {this.renderFields()}
          </div>
          {inputChanged && this.renderSaveButton()}
        </Form>
      </fieldset>
    );
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  componentDidMount () {
    const { startFetching } = this.props;
    Promise.all([
      startFetching(dropdownsSearch('dispute_statuses_field'))
        .then(response => this.setDropdowns('statuses', response.data)),
      startFetching(dropdownsSearch('dispute_types_field'))
        .then(response => this.setDropdowns('types', response.data)),
      startFetching(dropdownsSearch('parking_lots_without_agency_list'))
        .then(response => this.setDropdowns('parkingLots', response.data))
    ])
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { backPath, record } = this.props;

    if (this.isFetching()) {
      return <Loader />;
    }
    return (
      <div className="pb-4">
        <Breadcrumb
          title="Dispute Details"
          id={record.id}
          backPath={backPath}
        />
        {!isArrayEmpty(this.state.dropdowns.types) && !isArrayEmpty(this.state.dropdowns.statuses) ? this.renderForm() : null}
        <Comments />
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
  'dispute',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

const isArrayEmpty = (array) => {
  if (!Array.isArray(array)) return true;

  return array.length === 0;
};
