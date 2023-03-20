import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, NavItem, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { toggleNavItem } from 'actions/side_navigation';
import styles from './side-navigation.module.sass';

function DropdownNavigation ({ location, children, title, icon }) {
  const dispatch = useDispatch();
  const { openedTitle } = useSelector(({ side_nav }) => side_nav);

  React.useEffect(() => {
    if (openedTitle) {
      dispatch(toggleNavItem(false));
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  let isActive = false;
  React.Children.forEach(children, (element) => {
    if (!element) return;
    if (element.props.className.includes('selected-nav-point')) {
      isActive = true;
    }
  });

  return (
    <Navbar className="p-0">
      <div
        className={`${openedTitle === title ? styles.svgWhiteMobile : ''}
        ${isActive ? 'selected-nav-point' : ''} menu-points`}
        onClick={() => {
          dispatch(toggleNavItem(title));
        } }
      >
        <div className={styles.flexing}>
          {icon}
          <span className="d-none d-xl-block flex-1">{title}</span>
        </div>
        <FontAwesomeIcon
          className="ml-1 d-xl-block"
          icon={openedTitle === title ? faAngleUp : faAngleDown}
        />
      </div>
      <div
        className={`${openedTitle === title ? styles.activeNavbar : ''}
        ${
    styles.transitionWidth
    } d-flex d-xl-none h-100 align-items-center position-absolute`}
      >
        <span className="mr-3 float-right">
          {title}
          <ul className="shadow-sm bg-white p-0">
            {React.Children.map(children, (element) => {
              if (!element) return null;
              return (
                <NavItem className="ml-5 text-center" key={element.props.to}>
                  {element}
                </NavItem>
              );
            })}
          </ul>
        </span>
      </div>
      <Collapse isOpen={openedTitle === title}>
        {React.Children.map(children, (element) => {
          if (!element) return null;
          return (
            <NavItem
              className={`${
                location.pathname === element.props.to
                  ? styles.selectedSubPoint
                  : ''
              }
              ml-3 d-none d-xl-block`}
              key={element.props.to}
            >
              {element}
            </NavItem>
          );
        })}
      </Collapse>
    </Navbar>
  );
}

DropdownNavigation.propTypes = {
  location: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  side_nav: PropTypes.object,
  children: PropTypes.array
};

export default withRouter(DropdownNavigation);
