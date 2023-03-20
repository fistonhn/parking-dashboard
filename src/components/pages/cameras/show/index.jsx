import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCableConsumer } from 'react-actioncable-provider';
import debounce from 'lodash/debounce';
import Holder from 'holderjs';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import permissions from 'config/permissions';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT, POP_LIST_ELEMENT } from 'actions/cameras';
import { invoke } from 'actions';
/* API */
import { show, update, destroy } from 'api/cameras';
import { show as parkingLotShow } from 'api/parking_lots';
/* Base */
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import CameraNotConnected from 'components/helpers/camera/not_connected';
import CameraNotAllowed from 'components/helpers/camera/not_allowed';
import Loader from 'components/helpers/loader';
import ConfirmationModal from 'components/helpers/modals/confirmation';
/* Modules */
import updateRecord from 'components/modules/form_actions/update_record';
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';
import ReactPlayer from 'react-player';

import styles from './show.module.sass';
import { ReactComponent as EditIcon } from 'assets/edit_icon.svg';
import { ReactComponent as TrashIcon } from 'assets/trash_icon.svg';

class Show extends React.Component {
  state = {
    currentWatchers: [],
    parkingLot: null,
    streamName: '',
    isConfirmationModalOpen: false,
    errors: {}
  }

  static contextType = AlertMessagesContext

  clockRef = React.createRef()

  clockInterval = 0

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { parkingLot } = this.state;
    return isResourceFetching || !parkingLot;
  }

  toggleConfirmationModal = () => this.setState({ isConfirmationModalOpen: !this.state.isConfirmationModalOpen })

  deleteCamera = () => {
    const { popListElement, history, backPath, record } = this.props;
    destroy({
      id: record.id
    })
      .then(() => {
        popListElement(record.id);
        history.push(backPath);
      })
      .catch(() => {

      });
  }

  changeAllowStatus = () => {
    const { match, record } = this.props;
    const values = {
      camera: {
        allowed: record.allowed ? 0 : 1
      }
    };
    updateRecord.bind(this, update, match.url)(values);
  }

  changeStreamName = (e) => {
    const re = /^[a-z0-9A-Z ]+$/g;

    if (e.target.value === '' || !re.test(e.target.value)) {
      e.preventDefault();
      return;
    }
    this.setState({ streamName: e.target.value });
    this.debounceChangeStreamName(e.target.value);
  }

  // Send request after 1 second has passed since the user stop typing
  debounceChangeStreamName = debounce(
    (name) => {
      const { match } = this.props;
      const values = {
        camera: {
          name
        }
      };
      updateRecord.bind(this, update, match.url)(values);
    }, 1000)

  handleReceived = (currentWatchers) => {
    this.setState({
      currentWatchers
    });
  }

  onConnected = () => {
    this.refs.watcherRoom.cable.perform('watchers');
  }

  renderWatchers = () => {
    const { currentWatchers } = this.state;

    return (
      <React.Fragment>
        <div className="px-5 py-4 bg-dark text-white">
          Who is watching now ({currentWatchers.length}):
        </div>
        <ul>
          {
            currentWatchers.map((watcher, index) => {
              return (
                <li className="py-3" key={index}>
                  <img
                    alt="avatar"
                    width="40"
                    height="40"
                    src={watcher.avatar || 'https://i.stack.imgur.com/34AD2.jpg'}
                    className="rounded-circle mr-4"
                    ref={ref => Holder.run({ images: ref })} />
                  {watcher.name}
                </li>
              );
            })
          }
        </ul>
      </React.Fragment>
    );
  }

  renderCameraHeaderDetails = () => {
    const { record, currentUserPermissions } = this.props;
    const { streamName, errors } = this.state;

    return (
      <Row>
        <Col xs={12} md={4} className="text-center d-flex justify-content-center align-items-center">
          <PermissibleRender
            userPermissions={currentUserPermissions}
            requiredPermission={permissions.UPDATE_CAMERA}
            renderOtherwise={
              <React.Fragment>
                <span className="general-text-3 mr-1">Stream name:</span> <strong className="general-text-1">{record.name}</strong>
              </React.Fragment>
            }
          >
            <span className={`${errors['name'] && 'general-error'} general-text-3 mr-1`}>Stream name:</span>
            <Input className={` pr-4 ${errors['name'] && 'input-error'}`} onChange={this.changeStreamName} value={streamName || record.name}/>
            <div className={`position-relative input-error`}>
              <div className="text-left general-error general-text-1 pt-1">
                {errors['name']}
              </div>
            </div>
            <EditIcon width="22" height="22" className={`svg-dark position-relative ${styles.pencil}`}/>
          </PermissibleRender>
        </Col>
        <Col xs={12} md={3} className="text-center d-flex justify-content-center align-items-center">
          <span className="general-text-3 mr-1">Current status: </span> <strong className={`general-text-1 ${record.status === 'active' ? 'text-green' : 'general-error'}`}>{record.status}</strong>
        </Col>
        <PermissibleRender
          userPermissions={currentUserPermissions}
          requiredPermission={permissions.UPDATE_CAMERA}
        >
          <Col xs={12} md={4} className="text-center d-flex justify-content-center align-items-center">
            <span className="general-text-3 mr-1">Stream permission:</span> <strong className={`general-text-1`}>{record.allowed ? 'Allowed' : 'Disallowed'}</strong>
            <Button onClick={() => this.changeAllowStatus()} size="sm" outline color="primary" className="general-text-1 py-2 px-5 ml-3 ">
              <span className="">{record.allowed ? 'Disallow' : 'Allow'}</span>
            </Button>
          </Col>
        </PermissibleRender>
      </Row>
    );
  }

  renderCameraFooterDetails = () => {
    const { record } = this.props;
    return (
      <div className="pl-4">
        <p>
          More information:
        </p>
        <p>
          URL: { record.stream }
        </p>
        <p>
          {
            record.other_information
          }
        </p>
      </div>
    );
  }

  renderCamera = () => {
    const { record, currentUserPermissions } = this.props;
    const { parkingLot } = this.state;
    const canPlay = ReactPlayer.canPlay(record.stream);
    return (
      <React.Fragment>
        {this.renderCameraHeaderDetails()}
        <Row>
          <PermissibleRender
            userPermissions={currentUserPermissions}
            requiredPermission={record.allowed ? undefined : permissions.READ_CAMERA}
            renderOtherwise={<CameraNotAllowed/>}
          >
            {canPlay
              ? <Col xs={12}>
                <ReactPlayer className={`${styles.stream}`} url={record.stream} playing={true} width={'80 %'} />
                <p className={`${styles.live}`}>LIVE</p>
                <p className={`${styles.timestamp}`}>
                  <p>{record.name}</p>
                  <p>{ moment().utcOffset(parkingLot.time_zone.offset).format('MMM Do, YYYY')}</p>
                  <p ref={this.clockRef}></p>
                </p>
              </Col>
              : <CameraNotConnected canPlay={canPlay} />
            }
          </PermissibleRender>
        </Row>
        {this.renderCameraFooterDetails()}
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
    const { backPath, currentUserPermissions } = this.props;
    const { parkingLot } = this.state;

    return (
      <React.Fragment>
        <Link to={backPath} className="mr-2" >
          <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
        </Link>
        {parkingLot.name}
        <PermissibleRender
          userPermissions={currentUserPermissions}
          requiredPermission={permissions.DELETE_CAMERA}
        >
          <Button color="danger" onClick={this.toggleConfirmationModal} className={`mb-3 ml-4 float-right`}>
            <TrashIcon className="svg-white" />
          </Button>
        </PermissibleRender>
      </React.Fragment>
    );
  }

  renderLayout () {
    const { currentUser, record, history, backPath } = this.props;
    const { isConfirmationModalOpen } = this.state;

    if (!record) {
      // In case user access to a direct URL on a camera that he is not allowed to watch
      history.push(backPath);
      return null;
    }

    return (
      <React.Fragment>
        <ActionCableConsumer
          ref='watcherRoom'
          channel={{
            channel: 'FootageWatchersChannel',
            camera_id: record.id,
            current_user_id: currentUser.id
          }}
          onConnected={this.onConnected}
          onReceived={this.handleReceived}
        />
        <Row>
          <Col xs={12} className="px-5 py-4">
            {this.renderHeader()}
          </Col>
          <Col xs={12} md={9}>
            {this.renderCamera()}
          </Col>
          <Col xs={12} md={3}>
            {this.renderWatchers()}
          </Col>
          <ConfirmationModal
            text={'Are you sure you want to delete this stream footage?'}
            accept={this.deleteCamera}
            cancel={this.toggleConfirmationModal}
            isOpen={isConfirmationModalOpen}
          />
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
    this.clockInterval = setInterval(() => {
      const { record } = this.props;
      const canPlay = ReactPlayer.canPlay(record.stream);
      if (canPlay) {
        this.updateClock();
      } else {
        clearInterval(this.clockInterval);
      }
    }, 1000);
  }

  render () {
    return this.isFetching() ? <Loader /> : this.renderLayout();
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  currentUserPermissions: PropTypes.array
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT), popListElement: invoke(POP_LIST_ELEMENT) }, dispatch);
}

export default connectRecord(
  'camera',
  SET_RECORD,
  resourceFetcher(show),
  connect(null, mapDispatch)(
    withCurrentUser(Show)
  )
);
