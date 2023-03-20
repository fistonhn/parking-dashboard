import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import permissions from 'config/permissions';
/* Actions */
import { SET_LIST } from 'actions/cameras';
import { SET_LIST_ELEMENT } from 'actions/parking_lots_camera';
/* API */
import { show, search } from 'api/parking_lots_camera';
import { filterFetcher } from 'api/parking_lots';
/* Helpers */
import CameraNotConnected from 'components/helpers/camera/not_connected';
import Loader from 'components/helpers/loader';
import CameraNotAllowed from 'components/helpers/camera/not_allowed';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';
import { Col, Row, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Modal, ModalBody, Button, ButtonToolbar, ButtonGroup } from 'reactstrap';
/* Font Awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSearch } from '@fortawesome/free-solid-svg-icons';
/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { invoke } from 'actions';
/* Style */
import styles from './index.module.sass';
import BasicListToolbar from '../../../base/basic_list_toolbar';
import debounce from 'lodash/debounce';
import PermissibleRender from 'components/modules/permissible_render';

class Index extends React.Component {
  state = {
    showDropdown: false,
    searchInput: '',
    isModalOpen: false,
    cameraModal: {},
    refresh: false,
    listFromState: null,
    search: false,
    parkingLot: {},
    loading: false

  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  // for show dropdown of single camera
  toggleDropdown = (e, name) => {
    if (name) {
      if (this.state.showDropdown[name]) {
        this.setState({ showDropdown: { ...this.state.showDropdown, [name]: !this.state.showDropdown[name] } });
      } else {
        this.setState({ showDropdown: { ...this.state.showDropdown, [name]: true } });
      }
    }
  }

  // for expand stream of single camera
  toggleModal = () => this.setState({ isModalOpen: false })

  componentDidMount () {
    const id = this.props.match.params.id;
    filterFetcher({
      filters: {
        id
      }
    })
      .then(response => {
        this.setState({
          parkingLot: response.data[0]
        });
      });
  }

  renderHeader () {
    const { backPath } = this.props;
    return (<Row className="p-4" >
      <Col md={12} >
        <BasicListToolbar showFilters={false} goBackPath={backPath} title={this.state.parkingLot.name} {...this.props} createRequiredPermission={permissions.CREATE_CAMERA} label="+ Add Camera" badgesFilter={null} extraButtons={() => {
          return (
            this.renderSearchRefresh()
          );
        }} />
      </Col>
    </Row>);
  }

  // show additional button serach and refresh
  renderSearchRefresh () {
    const id = this.props.match.params.id;
    return (
      <ButtonToolbar className="float-right">
        <ButtonGroup className={`mr-4 ${styles.search}`}>
          <input className="form-control" type="text" onChange={(e) => this.handleChange(e.target.value, id)} placeholder="Search by keyword" />
          <FontAwesomeIcon className={`${styles.magnifier}`} color="grey" icon={faSearch} />
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button color="primary-lg" className="btn-md px-4 text-uppercase " onClick={() => this.refresh(this.props.match.params.id)}>Refresh</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }

  // Search input
  handleChange = debounce((searchInput, id) => {
    this.setState({
      searchInput,
      loading: true
    }, () => this.search(id));
  }, 1000);

  search (id) {
    const { searchInput } = this.state;
    search({ name: searchInput, id: id })
      .then(response => {
        return this.setState({
          search: true,
          listFromState: response.data,
          loading: false
        });
      });
  }

  // Looking only stream
  refresh = (id) => {
    this.setState({
      loading: true
    });
    show({ id: id })
      .then(response => {
        return this.setState({
          refresh: true,
          loading: false,
          listFromState: response.data
        });
      });
  }

  renderRecord () {
    const { list, match } = this.props;
    const { refresh, search, listFromState } = this.state;
    const stateList = listFromState;
    const listToShow = refresh || search ? stateList : list;
    return (
      <Row >
        {
          !this.state.loading ? (
            listToShow.map((rec, idx) => (
              <Col key={idx} md={6} className={`${styles.cardAdjust}`} >
                <div className="card">
                  <p className={`${styles.cameraName}`}>
                    <Link className={`${styles.dropdownmenu}`} to={`${match.url}/cameras/${rec.id}`}>{rec.name}</Link>
                    <Dropdown className={`${styles.dropdown}`} direction="left" isOpen={this.state.showDropdown[rec.name]} toggle={(e) => this.toggleDropdown(e, rec.name)}>
                      <DropdownToggle color="none">
                        <FontAwesomeIcon color="grey" icon={faEllipsisH} />
                      </DropdownToggle>
                      <DropdownMenu >
                        <DropdownItem>
                          <Link className={`${styles.dropdownmenu}`} to={`/dashboard/live/parking_lots`}>Information</Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link className={`${styles.dropdownmenu}`} to={`/dashboard/live/parking_lots`}>Settings</Link>
                        </DropdownItem>
                        <DropdownItem onClick={() => this.setState({ cameraModal: rec, isModalOpen: true })}>
                          <p>Expand</p>
                        </DropdownItem>
                        <DropdownItem>
                          <Link className={`${styles.dropdownmenu}`} to={`/dashboard/live/parking_lots`}>Edit</Link>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </p>
                  {this.renderStream(rec.stream, rec.allowed)}
                </div>
              </Col>
            )
            )
          ) : (
            <Col md={12}>
              <Loader/>
            </Col>
          )
        }
      </Row>
    );
  }

  renderStream (stream, allowed) {
    const { currentUserPermissions } = this.props;
    const canPlay = ReactPlayer.canPlay(stream);

    return (
      <PermissibleRender
        userPermissions={currentUserPermissions}
        requiredPermission={allowed ? undefined : permissions.READ_CAMERA}
        renderOtherwise={<CameraNotAllowed/>}
      >
        {canPlay
          ? <div>
            <ReactPlayer className={`${styles.stream}`} url={stream} playing={true} width={'80 %'} />
            <p className={`${styles.live}`}>LIVE</p>
          </div>
          : <CameraNotConnected canPlay={canPlay} />
        }
      </PermissibleRender>
    );
  }

  render () {
    const { isModalOpen, cameraModal } = this.state;

    return this.isFetching() ? <Loader /> : (
      <React.Fragment >
        {this.renderHeader()}
        {this.renderRecord()}
        <Modal size="lg" style={{ maxWidth: 'none' }} isOpen={isModalOpen} toggle={this.toggleModal}>
          <ModalBody className={`${styles.modalBody}`}>
            {this.renderStream(cameraModal.stream, cameraModal.allowed)}
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  currentUserPermissions: PropTypes.array
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectList('camera', SET_LIST, resourceFetcher(show, 'parking_lot_camera'), connect(
  null,
  mapDispatch
)(
  withFetching(
    withCurrentUser(
      Index
    )
  )
));
