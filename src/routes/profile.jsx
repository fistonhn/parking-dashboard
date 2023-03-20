import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import Index from 'components/pages/profile/index';

const Routing = ({ match }) => (
  <Route exact path={match.path} component={Index} />
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
