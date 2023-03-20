import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, ModalBody, Col, Row } from 'reactstrap';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import styles from './date_modal.module.sass';
import { displayDateRange } from 'components/helpers';
import { ReactComponent as CalendarIcon } from 'assets/calendar_icon.svg';
import { ReactComponent as ClearIcon } from 'assets/clear_icon.svg';
import Button from 'components/base/button';

const defaultSelectionRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

const rangeOptions = [
  {
    name: 'Today',
    getStartDate: () => moment(),
    getEndDate: () => moment()
  },
  {
    name: 'Yesterday',
    getStartDate: () => moment().subtract(1, 'days'),
    getEndDate: () => moment().subtract(1, 'days')
  },
  {
    name: 'Last 7 Days',
    getStartDate: () => moment().subtract(6, 'days'),
    getEndDate: () => moment()
  },
  {
    name: 'Last Week',
    getStartDate: () => moment().subtract(1, 'weeks').startOf('week'),
    getEndDate: () => moment().subtract(1, 'weeks').endOf('week')
  },
  {
    name: 'Last 2 Week',
    getStartDate: () => moment().subtract(2, 'weeks').startOf('week'),
    getEndDate: () => moment().subtract(1, 'weeks').endOf('week')
  },
  {
    name: 'This Month',
    getStartDate: () => moment().startOf('month'),
    getEndDate: () => moment().endOf('month')
  },
  {
    name: 'Last Month',
    getStartDate: () => moment().subtract(1, 'months').startOf('month'),
    getEndDate: () => moment().subtract(1, 'months').endOf('month')
  },
  {
    name: 'Custom Range'
  }
];

const DateModal = (props) => {
  const { isOpen, toggleModal, apply, maxDate, title } = props;
  const [selectionRange, setSelectionRange] = useState(defaultSelectionRange);
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);

  const maxRangeDate = maxDate || moment().endOf('month').toDate();

  React.useEffect(() => {
    setSelectionRange(defaultSelectionRange);
    setSelectedRangeIndex(0);
  }, [props.toggleReset]);

  const getMinDate = (date1, date2) => {
    if (date1 > date2) {
      return date2;
    }
    return date1;
  };

  const handleBuiltinRangeSelect = (rangeOption, i) => {
    if (!rangeOption.getStartDate || !rangeOption.getEndDate) {
      return;
    }
    const startDate = rangeOption.getStartDate().toDate();
    const endDate = getMinDate(rangeOption.getEndDate().toDate(), maxRangeDate);
    setSelectedRangeIndex(i);
    setSelectionRange({
      ...defaultSelectionRange,
      startDate,
      endDate
    });
  };

  const handleApply = () => {
    const from = moment(selectionRange.startDate).format('YYYY-MM-DD');
    const to = moment(selectionRange.endDate).format('YYYY-MM-DD');
    apply(from, to);
  };

  const handleDateChange = (ranges) => {
    setSelectedRangeIndex(rangeOptions.length - 1);
    setSelectionRange(ranges.selection);
  };

  return (
    <Modal className={styles.dateModal} centered={true} isOpen={isOpen} toggle={toggleModal}>
      <ModalBody className="p-0">
        {!!title &&
          <Row>
            <Col className={styles.titleWrapper}>
              <span>{title}</span>
              <ClearIcon className={styles.closeBtn} onClick={toggleModal} />
            </Col>
          </Row>
        }
        <Row className={`${styles.dateModalContent} m-0`}>
          <Col className={styles.rangeBtnWrapper}>
            {rangeOptions.map((rangeOption, i) => (
              <button
                key={i}
                className={`${styles.rangeBtn} ${selectedRangeIndex === i ? styles.selected : ''} ${rangeOption.getStartDate ? '' : styles.disabled}`}
                onClick={() => handleBuiltinRangeSelect(rangeOption, i)}
              >
                <span className="general-text-2">{rangeOption.name}</span>
              </button>
            ))}
          </Col>
          <Col>
            <Row>
              <Col className={styles.displayDateWrapper}>
                <span className={`general-text-2 ${styles.displayDate}`}>
                  {displayDateRange(selectionRange.startDate, selectionRange.endDate)}
                </span>
                <CalendarIcon />
              </Col>
            </Row>
            <Row className={styles.datePickerWrapper}>
              <Col>
                <DateRangePicker
                  className={styles.datePicker}
                  color="#3A9CED"
                  rangeColors={['#3A9CED']}
                  ranges={[selectionRange]}
                  maxDate={maxRangeDate}
                  onChange={handleDateChange}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className={`${styles.btnWrapper} d-flex justify-content-end`}>
            <Button onClick={toggleModal} status="secondary">CANCEL</Button>
            <Button onClick={handleApply} status="success">APPLY</Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

DateModal.propTypes = {
  apply: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  maxDate: PropTypes.instanceOf(Date),
  title: PropTypes.string
};

export default DateModal;
