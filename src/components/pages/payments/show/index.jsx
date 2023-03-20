import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/payments';
import { invoke } from 'actions';
/* API */
import { show, update } from 'api/payments';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Breadcrumb from 'components/base/breadcrumb';
import CollapsableCard from 'components/base/collapsable_card';
import Button from 'components/base/button';
/* Helpers */
import { fieldImages, fieldVideos, fieldsShow } from 'components/helpers/fields/payments';
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
// import Comments from './comments';
import ActivityLogs from './activity_logs';

class Show extends React.Component {
  state = {
    isDropdownFetching: false,
    isSaving: false,
    inputChanged: false,
    dropdowns: {
      statuses: []
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
    const paymentSession = {
      status: values.status,
      admin_id: values.admin_id === 'Unassigned' ? null : values.admin_id
    };
    updateRecord.bind(this, update, backPath)(
      paymentSession
    );
  }

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    values.parking_session = record.parking_session?.id || '';
    values.uuid = record.parking_session?.uuid || '';
    values.check_in = record.parking_session?.check_in || null;
    values.check_out = record.parking_session?.check_out || null;
    values.parking_lot = record.parking_session?.parking_lot?.name || '';
    values.parking_slot = record.parking_session?.parking_slot?.name || '';
    values.plate_number = record.parking_session?.vehicle?.plate_number || '';
    values.images = record.session_images ? record.session_images.map(image => image.url) : [];
    // values.videos = record.videos ? record.videos.map(video => video.url) : [];
    values.status = record.status?.value;

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
    const { currentUserPermissions, record } = this.props;
    const values = Object.assign({}, record);

    return renderFieldsWithGrid(
      fieldsShow(currentUserPermissions, values.status),
      2,
      6,
      { ...this.fieldProps(), errors: this.state.errors });
  }

  renderForm () {
    const { isSaving, inputChanged } = this.state;
    const values = this.values();

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
            </div>
            {inputChanged && this.renderSaveButton()}
            {this.renderVideoImage()}
          </Form>
        </fieldset>
      ));
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  componentDidMount () {
    const { startFetching } = this.props;
  }

  render () {
    const { backPath, record } = this.props;

    if (this.isFetching()) {
      return <Loader />;
    }
    return (
      <div className="pb-4">
        <Breadcrumb
          title="Session Details"
          id={record.id}
          backPath={backPath}
        />
        { this.renderForm() }
        {/* <ActivityLogs /> */}
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
  'payments',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(withFetching(withCurrentUser(Show)))
);

const isArrayEmpty = (array) => {
  if (!Array.isArray(array)) return true;

  return array.length === 0;
};
