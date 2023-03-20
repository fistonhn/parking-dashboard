import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';
import { withRouter, Link, useHistory } from 'react-router-dom';
import withCurrentUser from 'components/modules/with_current_user';
import { ReactComponent as Logo } from 'assets/logo.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/menu_icons/arrow_down_icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import CurrentTime from 'components/pages/dashboard/current_time';
import styles from './header.module.sass';

function Header (props) {
  const history = useHistory();
  const { currentUser } = props;
  const [willLogOut, setWillLogOut] = useState(false);

  return (
    <Navbar sticky="top" color="primary" light expand className="shadow-sm">
      <Link
        to="/dashboard"
        className={`${styles.logoLink} d-flex align-items-center ml-4 btn-default text-light pointer`}
      >
        <Logo />
        <div className="ml-1">
          <div className={styles.title}>EASTON PARK SMART</div>
          <div className={`${styles.whiteText} general-text-2`}>
            ADMIN PANEL
          </div>
        </div>
      </Link>
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown
          nav
          inNavbar
          className="d-flex align-items-center"
        >
          <DropdownToggle nav className="text-light float-right">
            {currentUser ? (
              <span className={`${styles.dFlex} align-items-center`}>
                <img
                  src={
                    currentUser.avatar || 'https://i.stack.imgur.com/34AD2.jpg'
                  }
                  alt="profile"
                  className="rounded-circle mr-2"
                  width="40"
                  height="40"
                />
                <span className="d-none d-sm-inline">
                  <DropdownToggle nav className="float-right text-light pl-0">
                    <ArrowDownIcon className={styles.arrowDownIcon} />
                  </DropdownToggle>
                  <span className={`${styles.dFlex} ${styles.dFlexColumn}`}>
                    <span className={styles.username}>
                      {process.env.NODE_ENV !== 'production'
                        ? currentUser.role.name
                        : currentUser.name}
                    </span>
                    <CurrentTime className={styles.currentTime} />
                  </span>
                </span>
              </span>
            ) : (
              <span>Loading...</span>
            )}
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <Link className="nav-link menu-points" to="/dashboard/profile">
                <FontAwesomeIcon
                  size="xs"
                  icon={faPencilAlt}
                  className="mr-2"
                />
                Edit account
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link
                className="nav-link menu-points"
                onClick={() => setWillLogOut(!willLogOut)}
              >
                <FontAwesomeIcon
                  size="xs"
                  icon={faSignOutAlt}
                  className="mr-2"
                />
                Log out
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
      <Modal centered isOpen={willLogOut}>
        <ModalHeader>You&apos;re logging out!</ModalHeader>
        <ModalBody>Are you sure you want to log out?</ModalBody>
        <ModalFooter>
          <Button
            className={styles.logOutBtnYes}
            onClick={() => history.push('/sign_out')}
          >
            Yes
          </Button>{' '}
          <Button
            className={styles.logOutBtnNo}
            onClick={() => setWillLogOut(!willLogOut)}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>
    </Navbar>
  );
}

Header.propTypes = {
  currentUser: PropTypes.object
};

export default withRouter(withCurrentUser(Header, Header));
