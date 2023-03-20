import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, isAuthorized, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthorized ? (<Component {...props} />) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

function mapState (state) {
  const { isAuthorized } = state.user.auth;
  return { isAuthorized };
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  location: PropTypes.object
};

export default connect(
  mapState
)(PrivateRoute);
