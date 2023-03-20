import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Popover, PopoverBody } from 'reactstrap';

import styles from './configuration.module.sass';
import DateInput from 'components/base/date_input';
import Dropdown from 'components/base/dropdown';
import { ReactComponent as InfoIcon } from 'assets/info_icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

class Configuration extends React.Component {
  state = {
    parkingLot: [],
    selectedParkingLot: [this.props.parkingLots],
    tileInfoOpen: false
  }

  handleParkingLotChange = (selectedParkingLots, selectAllChecked) => {
    const isUserCheckedParkingLot = selectedParkingLots.some((parkingLot) => parkingLot.value === 0);

    const filteredSelectedParkingLots = selectedParkingLots.filter(
      (parkingLot) => parkingLot.value !== 0
    );
    const selectedParkingLotsValues = filteredSelectedParkingLots.map(
      (selectedParkingLot) => selectedParkingLot.value
    );
    this.setState({ selectedParkingLot: selectAllChecked ? (isUserCheckedParkingLot ? this.props.parkingLots : []) : filteredSelectedParkingLots });
    this.props.onConfigChange(this.props.name, { parking_lot_ids: this.state.parkingLot.value === 0 ? [] : [this.state.parkingLot.value] });
  };

  handleDateChange = (from, to) => {
    this.props.onConfigChange(this.props.name, { range: { from, to } });
  };

  toggleTileInfo = () => {
    this.setState({ tileInfoOpen: !this.state.tileInfoOpen });
  };

  componentDidUpdate (prevProps) {
    const { reload, stopRefreshing } = this.props;
    if (reload) {
      stopRefreshing();
    }

    if (prevProps.parkingLots !== this.props.parkingLots) {
      this.setState({ selectedParkingLot: this.props.parkingLots });
    }
  }

  render () {
    const type = this.props.type.split(' ')[0] + '_details';
    const info = 'Pie chart displays data based on the date range and selected parking lot configurations';
    return (
      <Col xs="12" className="col-lg">
        <Row className={styles.configLabelWrapper}>
          <Col className="d-flex align-items-center">
            <span className={`general-text-1 ${styles.configLabel}`}>
              {this.props.title}
            </span>
            {info ? (
              <React.Fragment>
                <button
                  className="ml-2 border-0 bg-white text-primary"
                  id={type}
                >
                  <FontAwesomeIcon
                    color="primary"
                    icon={faQuestionCircle}
                  />
                </button>
                <Popover
                  placement="bottom"
                  isOpen={this.state.tileInfoOpen}
                  target={type}
                  toggle={this.toggleTileInfo}
                  trigger="click hover focus"
                >
                  <PopoverBody>{info}</PopoverBody>
                </Popover>
              </React.Fragment>
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row className="no-gutters">
          <Col>
            <DateInput
              className={styles.configDatePicker}
              from={this.props.config.range.from}
              to={this.props.config.range.to}
              onChange={this.handleDateChange}
            />
            <span className={`general-text-2 ${styles.configNote}`}>
            *Maximum of 10
            </span>
          </Col>
          <Col className={`${styles.configSplitter} col-auto`} />
          <Col>
            <Dropdown
              multiple
              coveringText={() => `Selected(${this.state.selectedParkingLot.length})`}
              options={this.props.parkingLots}
              value={this.state.selectedParkingLot}
              onChange={this.handleParkingLotChange}
              size="sm"headlessheadless
            />
          </Col>
        </Row>
      </Col>
    );
  }
};

Configuration.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired,
  parkingLots: PropTypes.array,
  defaultParkingLot: PropTypes.object
};

export default Configuration;
