import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './date_input.module.sass';
import Input from 'components/base/input';
import DateModal from 'components/base/date_modal';
import { ReactComponent as CalendarIcon } from 'assets/calendar_icon.svg';
import { ReactComponent as ClearIcon } from 'assets/clear_icon.svg';
import { displayDateRange } from 'components/helpers';

class DateInput extends Component {
  state = {
    isModalOpen: false
  }

  handleDateButtonClick = () => {
    this.setState({ isModalOpen: true });
  }

  handleDateClear = () => {
    this.props.onChange();
  }

  handleDateChange = (from, to) => {
    this.setState({ isModalOpen: false });
    this.props.onChange(from, to);
  }

  handleModalToggle = () => {
    this.setState({ isModalOpen: false });
  }

  render () {
    const { from, to, modalTitle, ...otherProps } = this.props;
    const { isModalOpen } = this.state;
    const dateRangeStr = displayDateRange(from, to);
    const icons = (
      <React.Fragment>
        {!!dateRangeStr &&
          <ClearIcon className={styles.clearBtn} onClick={this.handleDateClear} />
        }
        <CalendarIcon onClick={this.handleDateButtonClick} />
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Input
          value={dateRangeStr}
          onClick={this.handleDateButtonClick}
          icon={icons}
          viewOnly
          {...otherProps}
        />
        <DateModal
          {...this.props}
          title={modalTitle}
          isOpen={isModalOpen}
          apply={this.handleDateChange}
          toggleModal={this.handleModalToggle}
        />
      </React.Fragment>
    );
  }
};

DateInput.propTypes = {
  modalTitle: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default DateInput;
