import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import Index from 'components/pages/vehicles/index';
import Show from 'components/pages/vehicles/show/index';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({ match }) => (
  <React.Fragment>
    <Route
      exact
      path={match.path}
      component={Index}
    />
    <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)} />
  </React.Fragment>
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
