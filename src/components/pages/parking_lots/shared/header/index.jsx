import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
/* Styles/Assets */
import styles from './header.module.sass';
import { ReactComponent as ArrowBackIcon } from 'assets/arrow_back_icon.svg';

const LINKS = [
  {
    to: '',
    name: 'Information'
  },
  {
    to: '/voi',
    name: 'VOI'
  },
  {
    to: '/rules',
    name: 'Parking Rules'
  },
  {
    to: '/spaces',
    name: 'Parking Spaces'
  }
];

const Header = ({ record, backPath, parentPath, history }) => {
  const currentPath = useLocation().pathname;
  const backPathUse = history?.location?.state?.backPath ? history.location.state.backPath : backPath;
  return (
    <Row className={`${styles.header} no-gutters`}>
      <Col xs={12} lg={6} className={styles.titleWrapper}>
        <Link to={backPathUse}>
          <ArrowBackIcon />
          <span className="general-text-1">Parking Lot Details</span>
        </Link>
        <span className="general-text-2">
          ID: {record.id}
        </span>
      </Col>
      { !history?.location?.state?.mute &&
        <Col xs={12} lg={6} className={styles.linkWrapper}>
          {LINKS.map((link, i) => {
            const linkTo = `${parentPath}${link.to}`;
            return (
              <Link
                key={i}
                to={linkTo}
                className={`${currentPath === linkTo ? styles.active : ''} general-text-2`}
              >
                {link.name}
              </Link>
            );
          })}
        </Col>
      }
    </Row>
  );
};

Header.propTypes = {
  record: PropTypes.object.isRequired,
  backPath: PropTypes.string,
  parentPath: PropTypes.string
};

export default Header;
