import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
/* Styles/Assets */
import styles from './header.module.sass';
import { ReactComponent as ArrowBackIcon } from 'assets/arrow_back_icon.svg';

const Header = ({ backPath, showParkingRulesSection }) => {
  return (
    <Row className={`${styles.header} no-gutters`}>
      <Col xs={6} className={styles.titleWrapper}>
        <Link to={backPath}>
          <ArrowBackIcon />
          <span className="general-text-1">
            Create a new parking lot account
          </span>
        </Link>
      </Col>
      <Col xs={6} className={styles.sectionWrapper}>
        <div className={`${showParkingRulesSection ? '' : 'text-green'} mr-4`}>
          <span>1</span>Information
        </div>
        <div className={`${showParkingRulesSection ? 'text-green' : ''}`}>
          <span>2</span>Parking rules
        </div>
      </Col>
    </Row>
  );
};

Header.propTypes = {
  backPath: PropTypes.string,
  showParkingRulesSection: PropTypes.bool
};

export default Header;
