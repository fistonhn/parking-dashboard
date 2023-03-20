import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Input from 'components/base/input';
import { ReactComponent as SearchIcon } from 'assets/search_icon.svg';
import { Button } from 'reactstrap';
import PermitTypeModal from 'components/base/permit_type_model';

import styles from './toolbar.module.sass';

class Toolbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      toggleReset: false,
      isModalOpen: false
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

  handleCreateTypeButtonClick = () => {
    this.setState({ isModalOpen: true });
  }

  handleModalToggle = () => {
    this.setState({ isModalOpen: false });
  }

  render () {
    const { search } = this.props;
    const { isModalOpen } = this.state;

    return (
      <Row className={`${styles.toolBar} w-100 m-0`} sm="12">
        <Col className="ml-auto d-flex">
          <Input
            onChange={search}
            placeholder="Search by keyword"
            icon={<SearchIcon />}
          />
        </Col>
        <Col className="col-auto d-flex">
          <Button className={styles.btn} color="primary" onClick={this.handleCreateTypeButtonClick}>
            Create New Permit Type
          </Button>
          <PermitTypeModal
            {...this.props}
            title="Create New Permit Type"
            isOpen={isModalOpen}
            apply={this.handleDateChange}
            toggleModal={this.handleModalToggle}
          />

        </Col>
      </Row>
    );
  }
}

Toolbar.propTypes = {
  filter: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired
};

export default Toolbar;
