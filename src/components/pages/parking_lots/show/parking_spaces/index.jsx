import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { isEmpty, isMatch } from 'underscore';
import {
  isUserInsideEditingZone
} from './mouse_events';
import permissions from 'config/permissions';

import ParkingPlanEditableZone from './parking_plan_editable_zone';
import FileLayoutModal from './file_layout_modal';
import SessionRecordModal from './session_record_modal';
import UpperPanel from './upper_panel';
import SlotPane from './slot_pane';

/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { index as indexParkingSlot } from 'api/parking_slots';
import { show, createParkingPlan, deleteParkingPlan, updateParkingPlan } from 'api/parking_lots';
/* Base */
import Button from 'components/base/button';
/* Helpers */
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import ConfirmationModal from 'components/helpers/modals/confirmation';
/* Modules */
import withFetching from 'components/modules/with_fetching';
import resourceFetcher from 'components/modules/resource_fetcher';
import connectRecord from 'components/modules/connect_record';
import withCurrentUser from 'components/modules/with_current_user';
import doesUserHasPermission from 'components/modules/does_user_has_permission';
/* Assets */
import styles from './parking_plans.module.sass';
import Header from '../../shared/header';
import { tr } from 'faker/lib/locales';

/**
  * @state (Bool)  isEditing indicate if the user is in editing mode
  * @state (Bool) isInsideEditingZone indicate if the user pointer is inside the layout parking space
  * @state (Bool) isMovingExistingSlot indicate if the user is moving a circle that was already on parking space
  * @state (Bool) isRefreshingData indicate if the suer pressed the reload button on the parking slot pane
  * @state (Array) drawedSlotContainer contains circle drawed on top of the parking space
  * @state (Array) tmpDrawedSlotContainer contains the initial data of drawedSlotContainer variable to check if the data was changed when the user tries to turn off the edit mode
  * @state (Array) list contains a list of parking slot and its state
  * @state (Array) parkingPlans contains a list of images associated to Parking Lot
  * @state (Integer) slotIdClicked contains the ID of the slot selected on 'Edit mode'
  * @state (Integer) selectedIndexParkingPlan contains the index of the current parking space where the user is working on
  * @state (Object) newCircleInfo store temporaly the information about the new circle that will be created
  * @state (Integer) slotIdToBeDeleted store temporaly the slot id to wait user deletion confirmation
*/

export const ParkingPlanContext = React.createContext();

class ParkingPlans extends Component {
  state = {
    /* Modal */
    showCircleConfirmationModal: false,
    showParkingPlanDeleteConfirmationModal: false,
    showUnsavedChangesModal: false,
    showFileLayoutModal: false,
    showLocateSlotModalConfirmation: false,
    showParkingSessionRecords: false,
    /* Loader State */
    isRefreshingData: false,
    isSavingCoordinates: false,
    isSavingParkingPlan: false,
    isListFetching: true,

    currentSessionRecord: {},
    fileLayoutModalShouldUpdate: false,
    list: [],
    parkingPlans: [],
    selectedIndexParkingPlan: 0,
    slotIdToBeDeleted: null,
    errors: {},
    isEditing: false,
    isInsideEditingZone: false,
    isMovingExistingSlot: false,
    isChangingIdToExistingSlot: false,
    slotIdClicked: null,
    locateSlotId: null,
    newCircleInfo: {},
    drawedSlotContainer: [],
    tmpDrawedSlotContainer: []
    // overlaps: [],
    // tmpSlotNodes: []
  }

  static contextType = AlertMessagesContext

  mapRef = React.createRef();

  multiSelectContainerRef = React.createRef();

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isListFetching } = this.state;
    return isResourceFetching || isListFetching;
  }

  resetData = () => {
    this.setState({
      slotIdToBeDeleted: null,
      showCircleConfirmationModal: false,
      isInsideEditingZone: false,
      isMovingExistingSlot: false,
      newCircleInfo: {},
      slotIdClicked: null,
      isEditing: false,
      isChangingIdToExistingSlot: false
    });
  }

  resetUnsavedChanges = () => {
    const { tmpDrawedSlotContainer } = this.state;
    this.toggleUnsavedChangesModal();
    this.resetData();
    this.setState({
      drawedSlotContainer: tmpDrawedSlotContainer,
      tmpDrawedSlotContainer: []
    });
  }

  clearLocateSlotId = () => this.setState({ locateSlotId: null })

  setSessionRecords = (currentSessionRecord) => this.setState({ showParkingSessionRecords: true, currentSessionRecord })

  hideSessionRecordModal = () => this.setState({ showParkingSessionRecords: false })

  toggleFileLayoutModal = () => this.setState({ showFileLayoutModal: !this.state.showFileLayoutModal })

  toggleUnsavedChangesModal = () => this.setState((state) => ({ showUnsavedChangesModal: !state.showUnsavedChangesModal }))

  toggleParkingPlanDeleteConfirmationModal = () => this.setState((state) => ({ showParkingPlanDeleteConfirmationModal: !state.showParkingPlanDeleteConfirmationModal }))

  hideConfirmationLocateSlotModal = () => this.setState({ showLocateSlotModalConfirmation: false, tmplocateSlotId: null })

  toggleCircleConfirmationModal = (slotId) => {
    this.setState({
      slotIdToBeDeleted: slotId,
      showCircleConfirmationModal: true
    });
  }

  cancelParkingSlotCircleDeletion = () => {
    this.setState({
      slotIdToBeDeleted: null,
      slotIdClicked: null,
      showCircleConfirmationModal: false
    });
  }

  willDataBeErased = () => {
    const { drawedSlotContainer, tmpDrawedSlotContainer } = this.state;
    const willErase = drawedSlotContainer.length !== tmpDrawedSlotContainer.length ? false
      : drawedSlotContainer.every((slot, index) => {
        return isMatch(slot, tmpDrawedSlotContainer[index]);
      });

    return !willErase;
  }

  toggleEdit = () => {
    const { drawedSlotContainer, parkingPlans, selectedIndexParkingPlan, isEditing } = this.state;
    if (parkingPlans[selectedIndexParkingPlan]) {
      if (isEditing && this.willDataBeErased()) {
        this.toggleUnsavedChangesModal();
        return;
      }
      const copyDrawedSlotContainer = drawedSlotContainer;

      this.setState({
        tmpDrawedSlotContainer: [...copyDrawedSlotContainer],
        slotIdToBeDeleted: null,
        showCircleConfirmationModal: false,
        isInsideEditingZone: false,
        isMovingExistingSlot: false,
        newCircleInfo: {},
        slotIdClicked: null,
        isEditing: !isEditing
      });
    }
  }

  refreshData = () => {
    const { record, startFetching } = this.props;
    const { list } = this.state;
    this.setState({ isRefreshingData: true });
    return startFetching(
      indexParkingSlot({
        parkingLotId: record.id,
        full: true
      }))
      .then(response => {
        const newList = list.map(slot => {
          return response.data.find(dataSlot => dataSlot.id === slot.id);
        });
        this.setState({
          list: newList
        });
        return response;
      })
      .finally(() => this.setState({ isRefreshingData: false }));
  }

  // Sync Parking Slot marked on the map
  syncSlotContainerOnMap = () => {
    const { parkingPlans, selectedIndexParkingPlan, isEditing, list } = this.state;
    let drawedSlotContainer = [];
    if (!isEmpty(parkingPlans)) {
      const parkingPlanId = parkingPlans[selectedIndexParkingPlan || 0].id;
      const setSlotList = list.filter(slot => slot.coordinate_parking_plan);

      if (setSlotList) {
        const slotList = setSlotList.filter(slot => slot.coordinate_parking_plan.image_id === parkingPlanId);
        drawedSlotContainer = slotList.map(slot => slot.coordinate_parking_plan);
      }
    }

    this.setState({
      drawedSlotContainer,
      tmpDrawedSlotContainer: isEditing ? drawedSlotContainer : []
    });
  }

  // Change parking space
  selectIndexParkingPlan = (index) => {
    this.resetData();
    this.setState({
      selectedIndexParkingPlan: index
    }, this.syncSlotContainerOnMap);
  }

  // Cancel when user selects on the parking space in editing mode
  cancelMarkingSlotOnParkingPlan = () => {
    this.setState({
      newCircleInfo: {},
      isChangingIdToExistingSlot: false,
      slotIdClicked: null
    });
  }

  // Add new point on the parking space after select parking slot on dropdown
  applyMarkingSlotOnParkingPlan = (selectedOptions) => {
    const { isChangingIdToExistingSlot } = this.state;
    if (isChangingIdToExistingSlot) {
      this.changeIdToSlotOnParkingPlan(selectedOptions);
      return;
    }

    const newCircleInfo = this.state.newCircleInfo;
    newCircleInfo.parking_slot_id = selectedOptions.value;

    this.setState({
      newCircleInfo: {},
      drawedSlotContainer: [
        ...this.state.drawedSlotContainer,
        newCircleInfo
      ]
    });
  }

  changeIdToSlotOnParkingPlan = (selectedOptions) => {
    const { slotIdClicked } = this.state;
    const drawedSlotContainer = [...this.state.drawedSlotContainer];
    let replacementIndex;
    const newSlot = drawedSlotContainer.find((slot, index) => {
      if (slot.parking_slot_id === slotIdClicked) {
        replacementIndex = index;
        return true;
      }
      return false;
    });
    newSlot.parking_slot_id = selectedOptions.value;
    drawedSlotContainer.splice(replacementIndex, 1);
    this.setState({
      newCircleInfo: {},
      isChangingIdToExistingSlot: false,
      drawedSlotContainer: [
        newSlot,
        ...drawedSlotContainer
      ]
    });
  }

  getSlotNodes = () => {
    const plotChildNodes = this.mapRef.current.childNodes;
    const slots = [];
    for (let i = 0; i < plotChildNodes.length; i++) {
      const slot = plotChildNodes[i].childNodes[0];
      if (slot && slot.id.includes('Slot')) {
        slots.push({
          id: slot.id,
          x: parseFloat(slot.style.left.slice(0, slot.style.left.length - 2)),
          y: parseFloat(slot.style.top.slice(0, slot.style.top.length - 2)) });
      }
    }
    return slots;
  }

  onMouseDownOnSlotCircle = (id) => {
    const { isEditing, list } = this.state;

    if (isEditing) {
      this.setState({
        slotIdClicked: id
      });
    } else {
      const slot = list.find(slot => slot.id === id);
      this.setSessionRecords(slot.active_parking_session);
    }
  }

  onMouseDragOnSlotCircle = () => this.setState({ isMovingExistingSlot: true })

  checkOverlap = (tmpSlotNodes) => {
    const overlaps = [];
    const width = 30;
    const height = 30;
    for (let i = 0; i < tmpSlotNodes.length; i++) {
      for (let j = i + 1; j < tmpSlotNodes.length; j++) {
        const xCheck = Math.abs(tmpSlotNodes[i].x - tmpSlotNodes[j].x) <= (3 / 4 * width);
        const yCheck = Math.abs(tmpSlotNodes[i].y - tmpSlotNodes[j].y) <= (3 / 4 * height);
        if (xCheck == true && yCheck === true) {
          overlaps.push(`${tmpSlotNodes[i].id || tmpSlotNodes[i].parking_slot_id}-${tmpSlotNodes[j].id || tmpSlotNodes[j].parking_slot_id}`);
        }
      }
    }
    return overlaps;
  }

  onMouseUpOnSlotCircle = (e) => {
    const { isMovingExistingSlot, isEditing, slotIdClicked } = this.state;

    if (isEditing && isMovingExistingSlot) {
      const target = e.target.tagName.toLowerCase() === 'p' ? e.target.parentElement : e.target;
      const leftTarget = target.getBoundingClientRect().left;
      const topTarget = target.getBoundingClientRect().top;

      const offsetX = leftTarget - this.mapRef.current.getBoundingClientRect().left;
      const offsetY = topTarget - this.mapRef.current.getBoundingClientRect().top;

      const drawedSlotContainer = [...this.state.drawedSlotContainer];
      const slotToDelete = drawedSlotContainer.findIndex(drawedSlot => drawedSlot.parking_slot_id === slotIdClicked);
      drawedSlotContainer.splice(slotToDelete, 1);

      this.setState({
        newCircleInfo: {},
        slotIdClicked: null,
        isMovingExistingSlot: false,
        drawedSlotContainer: [
          ...drawedSlotContainer,
          {
            x: offsetX,
            y: offsetY,
            parking_slot_id: slotIdClicked
          }
        ]
      });
    }

    // alert(this.state.tmpSlotNodes[this.state.tmpSlotNodes.length - 1].x)
    this.setState({
      slotIdClicked: isMovingExistingSlot ? null : slotIdClicked,
      isMovingExistingSlot: false
    });
  }

  editParkingSlotCircle = () => this.setState({ isChangingIdToExistingSlot: true })

  // Show info of the clicked circle
  showCircleDrawSlowInfo = (id) => {
    this.setState({
      slotIdClicked: id,
      isChangingIdToExistingSlot: false, // To reset SlotAssignmentBar in case decide to click another one while editing ID
      newCircleInfo: {}
    });
  }

  // Locate the parking slot on any pakring space
  locateSlotOnParkingPlan = (id) => {
    const { list, parkingPlans, tmplocateSlotId, selectedIndexParkingPlan, isEditing } = this.state;
    const slot = list.find(slot => slot.id === (tmplocateSlotId || id));
    const newSelectedIndexParkingPlan = parkingPlans.findIndex(parkingPlan => parkingPlan.id === slot.coordinate_parking_plan.image_id);

    if (!tmplocateSlotId && newSelectedIndexParkingPlan !== selectedIndexParkingPlan && isEditing && this.willDataBeErased()) {
      this.setState({
        showLocateSlotModalConfirmation: true,
        tmplocateSlotId: id
      });
      return;
    }

    this.setState({
      locateSlotId: id,
      showLocateSlotModalConfirmation: false,
      tmplocateSlotId: null,
      selectedIndexParkingPlan: newSelectedIndexParkingPlan
    }, newSelectedIndexParkingPlan !== selectedIndexParkingPlan ? this.syncSlotContainerOnMap : null);
  }

  /**
    DELETE ACTIONS
  */

  deleteParkingSlotCircle = (id) => {
    const drawedSlotContainer = [...this.state.drawedSlotContainer];
    const slotToDelete = drawedSlotContainer.findIndex(drawedSlot => drawedSlot.parking_slot_id === id);
    drawedSlotContainer.splice(slotToDelete, 1);
    this.setState({
      showCircleConfirmationModal: false,
      slotIdClicked: null,
      slotIdToBeDeleted: null,
      drawedSlotContainer
    });
  }

  deleteParkingPlanFile = () => {
    const { record, startFetching } = this.props;
    const { selectedIndexParkingPlan, parkingPlans } = this.state;
    this.setState({
      showParkingPlanDeleteConfirmationModal: false,
      isSavingParkingPlan: true
    });

    startFetching(deleteParkingPlan({
      parkingLotId: record.id,
      parkingPlanId: parkingPlans[selectedIndexParkingPlan].id
    }))
      .then(responseDeleteParkingPlan => {
        this.refreshData()
          .then(response => {
            this.resetData();
            this.setState({
              selectedIndexParkingPlan: 0,
              parkingPlans: responseDeleteParkingPlan.data.parking_plans,
              list: response.data
            }, this.syncSlotContainerOnMap);
          })
          .catch(() => {
            this.renderErrorMessage();
          })
          .finally(() => this.setState({ isSavingParkingPlan: false }));
      })
      .catch((err) => {
        this.renderErrorMessage();
        console.error(err);
        this.setState({ isSavingParkingPlan: false });
      });
  }

  /**
    SAVE ACTIONS
  */

  saveCoordinateCircles = () => {
    const overLaps = this.checkOverlap(this.state.drawedSlotContainer);

    if (overLaps.length > 0) {
      this.context.addAlertMessages([{
        type: 'Failure',
        text: `There are overlapping parking slots: ${overLaps.join(', ')}`
      }]);
      this.setState({ isSavingCoordinates: false });
      return;
    }

    const { startFetching, record } = this.props;
    const { selectedIndexParkingPlan, parkingPlans, drawedSlotContainer } = this.state;

    this.setState({ isSavingCoordinates: true });

    startFetching(
      updateParkingPlan({
        parkingLotId: record.id,
        parkingPlanCoordinates: drawedSlotContainer,
        parkingPlanId: parkingPlans[selectedIndexParkingPlan].id
      })
    ).then(() => {
      this.refreshData()
        .then(response => {
          this.setState({
            tmpDrawedSlotContainer: drawedSlotContainer
          });
          this.context.addAlertMessages([{
            type: 'Success',
            text: 'Parking Space data saved succesfully'
          }]);
        })
        .catch(() => {
          this.renderErrorMessage();
        })
        .finally(() => this.setState({ isSavingCoordinates: false }));
    });
  };

  updateParkingPlanFile = (file, fileName) => {
    const { parkingPlans, selectedIndexParkingPlan } = this.state;
    const { startFetching, record } = this.props;
    const base64 = file ? file.base64 : '';
    this.setState({
      fileLayoutModalShouldUpdate: false,
      isSavingParkingPlan: true
    });

    startFetching(
      updateParkingPlan({
        parkingLotId: record.id,
        name: fileName,
        parkingPlanImage: base64,
        parkingPlanId: parkingPlans[selectedIndexParkingPlan].id
      })
    )
      .then((response) => this.setState({ parkingPlans: response.data.parking_plans }))
      .finally(() => this.setState({ isSavingParkingPlan: false }));
  }

  saveParkingPlanFile = (file, fileName) => {
    if (this.state.fileLayoutModalShouldUpdate) {
      this.updateParkingPlanFile(file, fileName);
      return;
    }

    if (file) {
      const { record, startFetching } = this.props;
      this.setState({ isSavingParkingPlan: true });
      startFetching(
        createParkingPlan({
          parkingLotId: record.id,
          parkingPlanImage: file.base64,
          name: fileName
        }))
        .then(response => {
          this.resetData();
          // Show the map previously uploaded and update parking spaces layout
          this.setState({
            selectedIndexParkingPlan: response.data.parking_plans.length - 1,
            parkingPlans: response.data.parking_plans
          }, this.syncSlotContainerOnMap);
        })
        .catch((err) => {
          this.renderErrorMessage();
          console.error(err);
        })
        .finally(() => this.setState({ isSavingParkingPlan: false }));
    }
  }

  addNewMap = () => {
    this.toggleFileLayoutModal();
    this.setState({
      fileLayoutModalShouldUpdate: false
    });
  }

  editCurrentMap = () => {
    this.toggleFileLayoutModal();
    this.setState({
      fileLayoutModalShouldUpdate: true
    });
  }

  /**
    RENDER ACTIONS
  */

  renderErrorMessage = () => {
    this.context.addAlertMessages([{
      type: 'Error',
      text: 'An error has occurred'
    }]);
  }

  renderEmptyParkingPlan = () => {
    return (
      <React.Fragment>
        <div className={`${styles.emptyImageMap} d-flex justify-content-center align-items-center`}>
          <p className="general-text-1">
              This parking lot account doesn't have any parking spaces.
          </p>
          <p className="general-text-1">
              For creating it, please upload parking lot plan (*PNG or *JPEG)
          </p>
        </div>
      </React.Fragment>
    );
  }

  renderParkingPlan = (parkingPlanImageURL) => {
    if (!parkingPlanImageURL) {
      return this.renderEmptyParkingPlan();
    }

    return <ParkingPlanEditableZone
      parkingPlanImageURL={parkingPlanImageURL}
    />;
  }

  renderSaveButton = () => {
    const { isEditing, isSavingCoordinates } = this.state;
    if (!isEditing) return null;
    return (
      <Button
        status="success"
        className="mt-4 float-right"
        onClick={this.saveCoordinateCircles}
        size="md"
        isLoading={isSavingCoordinates}
      >
        Save Changes
      </Button>
    );
  }

  renderForm () {
    const { isSavingParkingPlan, parkingPlans, selectedIndexParkingPlan } = this.state;
    const { history, parentPath, currentUserPermissions } = this.props;
    const disabledUpperPanel = !doesUserHasPermission(currentUserPermissions, permissions.UPDATE_PARKINGLOT);
    return (
      <Row onMouseMove={isUserInsideEditingZone.bind(this)} className="no-gutters">
        <Col className={`${styles.slotPaneWrapper} col-auto`}>
          <div className={styles.slotPaneTitle}>
            <span>Parking Spaces</span>
            <FontAwesomeIcon icon={faSync} className="pointer" onClick={this.refreshData}/>
          </div>
          <SlotPane />
        </Col>
        <Col className={styles.layoutPane}>
          <UpperPanel
            history={history}
            parentPath={parentPath}
            disabled={disabledUpperPanel}
          />
          <div className={styles.mapContainer}>
            {isSavingParkingPlan
              ? <Loader/>
              : this.renderParkingPlan(
                parkingPlans[selectedIndexParkingPlan]
                  ? parkingPlans[selectedIndexParkingPlan].url
                  : null
              )
            }
          </div>
          {this.renderSaveButton()}
        </Col>
      </Row>
    );
  }

  renderModals = () => {
    const {
      showFileLayoutModal,
      slotIdToBeDeleted,
      fileLayoutModalShouldUpdate,
      parkingPlans,
      selectedIndexParkingPlan,
      showCircleConfirmationModal,
      showParkingPlanDeleteConfirmationModal,
      showUnsavedChangesModal,
      showLocateSlotModalConfirmation,
      showParkingSessionRecords,
      currentSessionRecord
    } = this.state;

    return (
      <React.Fragment>
        <SessionRecordModal
          timeOffset ={this.props?.record?.time_zone?.offset}
          currentSessionRecord={currentSessionRecord}
          toggleModal={this.hideSessionRecordModal}
          isOpen={showParkingSessionRecords}
        />
        <FileLayoutModal
          defaultName={fileLayoutModalShouldUpdate ? parkingPlans[selectedIndexParkingPlan].name : ''}
          defaultURL={fileLayoutModalShouldUpdate ? parkingPlans[selectedIndexParkingPlan].url : ''}
          isOpen={showFileLayoutModal}
          toggleModal={this.toggleFileLayoutModal}
          saveParkingPlanFile={this.saveParkingPlanFile}
        />
        <ConfirmationModal
          text={'There are unsaved changes, are you sure you want to disable edit mode?'}
          accept={this.resetUnsavedChanges}
          cancel={this.toggleUnsavedChangesModal}
          isOpen={showUnsavedChangesModal}
        />
        <ConfirmationModal
          text={"The parking slot you are trying to locate is in another plan, the changes won't be saved if you proceed, are you sure do you want ot proceed?"}
          accept={this.locateSlotOnParkingPlan}
          cancel={this.hideConfirmationLocateSlotModal}
          isOpen={showLocateSlotModalConfirmation}
        />
        <ConfirmationModal
          text={'Delete this markup?'}
          accept={this.deleteParkingPlanFile}
          cancel={this.toggleParkingPlanDeleteConfirmationModal}
          isOpen={showParkingPlanDeleteConfirmationModal}
        />
        <ConfirmationModal
          text={'Delete this parking space?'}
          accept={() => this.deleteParkingSlotCircle(slotIdToBeDeleted)}
          cancel={this.cancelParkingSlotCircleDeletion}
          isOpen={showCircleConfirmationModal}
        />
      </React.Fragment>
    );
  }

  handleReceived = (data) => {
    const { list } = this.state;
    this.setState({
      list: list.map(slot => {
        if (slot.id === data.id) {
          return data;
        }
        return slot;
      })
    }, this.syncSlotContainerOnMap);
  }

  renderRecord () {
    const { record } = this.props;
    return (
      <ParkingPlanContext.Provider value={{
        state: { ...this.state },
        func: this
      }}>
        <Header {...this.props} />
        <ActionCableConsumer
          ref='parkingSpaceRoom'
          channel={{
            channel: 'ParkingSpacesChannel',
            parking_lot_id: record.id
          }}
          onConnected={() => console.log('Websocket connection established')}
          onReceived={this.handleReceived}
        />
        {this.renderForm()}
        {this.renderModals()}
      </ParkingPlanContext.Provider>
    );
  }

  fetchData = (record) => {
    const { startFetching } = this.props;

    if (record) {
      startFetching(
        indexParkingSlot({
          parkingLotId: record.id
        })
      )
        .then(response => {
          const updateDrawedSlotContainer = response.data.length > 0 ? this.syncSlotContainerOnMap : null;
          this.setState({
            isListFetching: false,
            list: response.data,
            parkingPlans: record.parking_plans
          }, updateDrawedSlotContainer);
        });
    }
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.record && !this.props.record) {
      this.fetchData(nextProps.record);
    }
  }

  // Update record on the redux store when leaving
  componentWillUnmount () {
    const { record, setRecord } = this.props;
    if (record) {
      show({ id: record.id })
        .then((res) => {
          setRecord(res.data);
        })
        .catch((err) => {
          console.log(err);
          console.log('Error while fetching parking lot');
        });
    }
  }

  componentDidMount () {
    const { record } = this.props;
    this.fetchData(record);
  }

  render () {
    return this.isFetching() ? <Loader/> : this.renderRecord();
  }
}

ParkingPlans.propTypes = {
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  currentUserPermissions: PropTypes.array
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(
    withCurrentUser(ParkingPlans)
  )
);
