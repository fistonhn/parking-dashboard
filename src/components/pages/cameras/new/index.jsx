import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'informed';

/* Actions */
import { SET_LIST_ELEMENT, SET_RECORD } from 'actions/cameras';
import { invoke } from 'actions';
/* API */
import { create } from 'api/cameras';
import { show as parkingLotShow } from 'api/parking_lots';
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fields, exampleData } from 'components/helpers/fields/cameras';
import CameraNotConnected from 'components/helpers/camera/not_connected';
import CameraConnecting from 'components/helpers/camera/connecting';
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
/* Modules */
import saveRecord from 'components/modules/form_actions/save_record';
import withCurrentUser from 'components/modules/with_current_user';
import ReactPlayer from 'react-player';

import styles from './new.module.sass';
import { ReactComponent as Info } from 'assets/info_icon.svg';
import CameraView from 'assets/CameraConnected.png';

class New extends React.Component {
  state = {
    isSaving: false,
    parkingLot: null,
    isConfirmationModalOpen: false,
    cameraConnectionSuccessful: false,
    loadingCameraConnection: false
  }

  static contextType = AlertMessagesContext

  clockRef = React.createRef()

  clockInterval = 0

  isFetching = () => {
    const { parkingLot } = this.state;
    return !parkingLot;
  }

  save = () => {
    const { parkingLot } = this.state;
    const { backPath } = this.props;
    const { values } = this.formApi.getState();
    values.parking_lot_id = parkingLot.id;
    saveRecord.call(this, create, backPath, values);
  };

  toggleConfirmationModal = () => this.setState({ isConfirmationModalOpen: !this.state.isConfirmationModalOpen })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  fieldProps = () => ({
    lSize: 4,
    iSize: 8,
    events: {
      onChange: (e) => {
        if (e.target.name === 'stream') {
          clearInterval(this.clockInterval);
          this.setState({
            cameraConnectionSuccessful: false
          });
        }
      }
    }
  })

  connectCamera = () => {
    const { values } = this.formApi.getState();
    if (values.stream) {
      this.clockInterval = setInterval(() => {
        this.updateClock();
      }, 1000);
      this.setState({
        loadingCameraConnection: true
      });
      setTimeout(() => {
        this.setState({
          cameraConnectionSuccessful: true,
          loadingCameraConnection: false
        });
      }, 1500);
    }
  }

  renderFields () {
    return renderFieldsWithGrid(fields(), 2, 12, { ...this.fieldProps(), errors: this.state.errors });
  }

  renderSaveButton = () => {
    const { isSaving, cameraConnectionSuccessful } = this.state;
    return (
      <Col className="mx-4">
        <Button
          size="md"
          status="success"
          className={`${cameraConnectionSuccessful ? '' : 'not-allowed'} px-5 py-2 mb-4 float-right`}
          onClick={this.save}
          isLoading={isSaving}
          disabled={!cameraConnectionSuccessful}
        >
          Save Changes
        </Button>
      </Col>
    );
  }

  renderForm = () => {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={exampleData()}>
          <Row>
            <Col sm={12} md={9}>
              {this.renderFields()}
            </Col>
          </Row>
        </Form>
      </fieldset>
    );
  }

  renderCameraFooterDetails = () => {
    return (
      <div className="pl-4 bg-grey-med-dark p-5 ">
        <p className="highlight-text-1">
          <Info width="18" height="18" className="mr-3"/>
          How to add a stream?
        </p>
        <Row className="mt-4">
          <Col xs={12} md={2}>
            <div className="mb-5 highlight-text-1">
              <strong>
                1.
              </strong>
              <p className="m-0 mt-2">
                SUPPLY
              </p>
              <p className="m-0">
              required information
              </p>
            </div>
          </Col>
          <Col xs={12} md={2}>
            <div className="mb-5 highlight-text-1">
              <strong>
                2.
              </strong>
              <p className="m-0 mt-2">
                CONNECT
              </p>
              <p className="m-0">
                to the camera
              </p>
            </div>
          </Col>
          <Col xs={12} md={2}>
            <div className="mb-5 highlight-text-1">
              <strong>
                3.
              </strong>
              <p className="m-0 mt-2">
                SAVE
              </p>
              <p className="m-0">
                the stream
              </p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderCamera = () => {
    const { parkingLot, cameraConnectionSuccessful, loadingCameraConnection } = this.state;
    const canPlay = ReactPlayer.canPlay('');
    return (
      <React.Fragment>
        <Row>
          <Col xs={12} md={6} className="text-center  row">
            <Col xs={12} className="ml-5 mt-2 ">
              <p className="text-left general-text-2">
                Please enter the following information to connect to the camera and add itto your live footage
              </p>
              {this.renderForm()}
            </Col>
          </Col>
          <Col xs={12} md={6} className="text-center d-flex justify-content-center align-items-center row">
            <Col xs={12} className="ml-5 text-center d-flex justify-content-between align-items-center px-5 ">
              <div className="general-text-1">
                Current Status:
                {
                  cameraConnectionSuccessful ? (
                    <span className='text-green'> Connected successfully</span>
                  ) : (
                    <span className='general-error'> Not yet connected</span>
                  )
                }
              </div>
              <div>
                <Button onClick={this.connectCamera} size="sm" outline color="primary" className="general-text-1 py-2 px-5 ml-3 ">
                  <span className="">Connect to camera</span>
                </Button>
              </div>
            </Col>
            <Col xs={12} className="ml-5 text-center d-flex justify-content-center align-items-center row">

              {
                loadingCameraConnection ? (
                  <CameraConnecting/>
                ) : (
                  cameraConnectionSuccessful ? (
                    <React.Fragment>
                      <Col xs={12} className={styles.stream} style={{ backgroundImage: `url(${CameraView})` }}>
                        <p className={`${styles.live}`}>LIVE</p>
                        <p className={`${styles.timestamp}`}>
                          <p></p>
                          <p>{ moment().utcOffset(parkingLot.time_zone.offset).format('MMM Do, YYYY')}</p>
                          <p ref={this.clockRef}></p>
                        </p>
                      </Col>
                    </React.Fragment>
                  ) : (
                    <CameraNotConnected canPlay={canPlay} />
                  )
                )
              }
              {this.renderSaveButton()}
            </Col>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  updateClock = () => {
    const { parkingLot } = this.state;
    if (parkingLot && this.clockRef.current) {
      return this.clockRef.current.innerText = moment().utcOffset(parkingLot.time_zone.offset).format('H:mm:ss');
    }
  }

  renderHeader () {
    const { backPath } = this.props;

    return (
      <React.Fragment>
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
        </Link>
        Add a stream
      </React.Fragment>
    );
  }

  renderLayout () {
    return (
      <React.Fragment>
        <Row>
          <Col xs={12} className="px-5 py-4">
            {this.renderHeader()}
          </Col>
          <Col xs={12}>
            {this.renderCamera()}
          </Col>
          <Col xs={12}>
            {this.renderCameraFooterDetails()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  componentWillUnmount () {
    clearInterval(this.clockInterval);
  }

  componentDidMount () {
    const { match } = this.props;
    parkingLotShow({ id: match.params.parking_lot_id })
      .then(res => {
        this.setState({
          parkingLot: res.data
        });
      });
  }

  render () {
    return this.isFetching() ? <Loader /> : this.renderLayout();
  }
}

New.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setRecord: invoke(SET_RECORD), setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connect(
  null,
  mapDispatch
)(withCurrentUser(New));
