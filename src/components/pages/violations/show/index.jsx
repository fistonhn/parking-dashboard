import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/violations';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/violations';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Breadcrumb from 'components/base/breadcrumb';
import CollapsableCard from 'components/base/collapsable_card';
import Button from 'components/base/button';
/* Helpers */
import { fieldImages, fieldVideos, fieldsShow } from 'components/helpers/fields/violations';
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
import ActivityLogs from './activity_logs';

class Show extends React.Component {
  state = {
    isDropdownFetching: false,
    isSaving: false,
    inputChanged: false,
    dropdowns: {
      officers: [],
      statuses: [],
      types: []
    },
    errors: {}
  }

  imageRef = React.createRef();

  videoRef = React.createRef();

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
    const parkingViolation = {
      status: values.status,
      admin_id: values.admin_id === 'Unassigned' ? null : values.admin_id,
      violation_type: values.violation_type
    };
    updateRecord.bind(this, update, backPath)({
      parking_violation: parkingViolation
    });
  }

  values = () => {
    const { record } = this.props;
    const status = this.state.dropdowns.statuses.find((status) => status.label === record.status);
    const violationType = this.state.dropdowns.types.find((violationType) => violationType.label === record.violation_type);
    const values = Object.assign({}, record);
    const lastLog = record.history_logs.length > 0 ? record.history_logs[record.history_logs.length - 1] : null;
    values.created_at = displayUnixTimestamp(record.created_at);
    values.parking_lot = record.parking_lot?.name || '';
    values.agency = record.agency?.name || '';
    values.admin_id = record.officer ? record.officer.id : null;
    values.updated_at = lastLog ? displayUnixTimestamp(lastLog.created_at) : '';
    values.updated_by = lastLog?.user || '';
    values.images = record.violation_photos ? record.violation_photos.map(image => image.url) : [];
    values.videos = record.videos ? record.videos.map(video => video.url) : [];
    values.status = status?.value;
    values.violation_type = violationType?.value;

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

  fieldPropsVideoImage = (type) => ({
    events: {},
    hideInput: true,
    ref: type === 'image' ? this.imageRef : this.videoRef,
    type,
    multipleFiles: false,
    isMaximized: true
  })

  renderVideoImage () {
    const { images, videos } = this.formApi ? this.formApi.getValues() : {};
    return (
      <React.Fragment>
        <CollapsableCard
          header={`Video (${videos?.length || this.values().videos?.length || '0'})`}
          className="mt-1"
        >
          {renderImageField(
            fieldVideos,
            this.fieldPropsVideoImage('video')
          )}
        </CollapsableCard>
        <CollapsableCard
          header={`Images (${images?.length || this.values().images?.length || '0'})`}
          className="mt-1"
        >
          {renderImageField(
            fieldImages,
            this.fieldPropsVideoImage('image')
          )}
        </CollapsableCard>
      </React.Fragment>
    );
  }

  renderFields () {
    const { currentUserPermissions } = this.props;
    const { officers, types, statuses } = this.state.dropdowns;
    return renderFieldsWithGrid(
      fieldsShow(officers, types, statuses, currentUserPermissions),
      2,
      6,
      { ...this.fieldProps(), errors: this.state.errors });
  }

  renderForm () {
    const { isSaving, inputChanged } = this.state;
    const values = this.values();

    return (

      values.status !== '' && values.violation_type !== '') && (
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
          {this.renderVideoImage()}
        </Form>
      </fieldset>
    );
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  loadOfficers = () => {
    const { startFetching, record } = this.props;
    startFetching(dropdownsSearch('agency_officers_list', { agency_id: record?.agency?.id }))
      .then(response => this.setDropdowns('officers', response.data));
  }

  componentDidMount () {
    const { startFetching } = this.props;
    Promise.all([
      startFetching(dropdownsSearch('tickets_statuses_field'))
        .then(response => this.setDropdowns('statuses', response.data)),
      startFetching(dropdownsSearch('tickets_types_field'))
        .then(response => this.setDropdowns('types', response.data))
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
          title="Violation Details"
          id={record.id}
          backPath={backPath}
        />
        {!isArrayEmpty(this.state.dropdowns.types) && !isArrayEmpty(this.state.dropdowns.statuses) ? this.renderForm() : null}
        <ActivityLogs />
        <Comments agencyId={record?.agency?.id} />
        <DelayedAction check={record} action={this.loadOfficers} />
      </div>
    );
  }
}

const DelayedAction = ({ check, action }) => {
  useEffect(() => {
    if (check) {
      action();
    }
  }, [check, action]);
  return null;
};

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
  'violation',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

const isArrayEmpty = (array) => {
  if (!Array.isArray(array)) return true;

  return array.length === 0;
};
