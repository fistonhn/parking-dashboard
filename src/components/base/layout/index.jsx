import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import Header from 'components/base/header';
import { connect } from 'react-redux';

class Layout extends React.Component {
  render () {
    return (
      <React.Fragment>
        {this.props.isAuthorized ? <Header /> : null}
        <Container fluid className="p-0">
          {this.props.children}
        </Container>
      </React.Fragment>
    );
  }
}

const mapState = state => {
  const { isAuthorized } = state.user.auth;
  return { isAuthorized };
};

Layout.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapState)(Layout);
