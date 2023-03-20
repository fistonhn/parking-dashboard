import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const RedirectIfAuthorized = (Component) => {
  const HOC = class extends React.Component {
    componentDidMount () {
      const { history, isAuthorized } = this.props;

      if (isAuthorized) {
        history.push('/dashboard');
      }
    }

    render () {
      return <Component {...this.props}/>;
    }
  };
  return connect(
    mapState,
    null
  )(HOC);
};

function mapState (state) {
  const { isAuthorized } = state.user.auth;
  return { isAuthorized };
}

RedirectIfAuthorized.propTypes = {
  history: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired
};

export default RedirectIfAuthorized;
