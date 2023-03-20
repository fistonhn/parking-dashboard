import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Button from 'components/base/button';
import Input from 'components/base/input';
import DateInput from 'components/base/date_input';
import { ReactComponent as SearchIcon } from 'assets/search_icon.svg';
import { ReactComponent as RefreshIcon } from 'assets/refresh_icon.svg';

import styles from './toolbar.module.sass';

class Toolbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      toggleReset: false
    };
  }

  handleDateFilterChange = (from, to) => {
    const { filter, resetFilter } = this.props;
    if (!from || !to) {
      resetFilter();
      this.setState(({ toggleReset: !this.state.toggleReset }));
      return;
    }
    filter(from, to);
  }

  render () {
    const { dateRange, search, refresh } = this.props;
    const { from, to } = dateRange;

    return (
      <Row className={`${styles.toolBar} w-100 align-items-center m-0`} sm="12">
        <Col className={`${styles.title} col-auto align-items-center d-flex px-0`}>
          <span className="text-nowrap d-inline-block">
            Dashboard
          </span>
          <Button
            onClick={refresh}
            status="primary-outline"
            className={styles.btnRefresh}
            icon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Col>
        <Col className="col-auto ml-auto d-flex px-0">
          <Input
            onChange={search}
            placeholder="Search by keyword"
            icon={<SearchIcon />}
          />
          <DateInput
            toggleReset={this.state.toggleReset}
            modalTitle="All Reports"
            from={from}
            to={to}
            onChange={this.handleDateFilterChange}
            className={styles.inputDate}
          />
        </Col>
      </Row>
    );
  }
}

Toolbar.propTypes = {
  dateRange: PropTypes.object.isRequired,
  filter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired
};

export default Toolbar;
