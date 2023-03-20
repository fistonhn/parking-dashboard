import React from 'react';
import PropTypes from 'prop-types';
import Index from 'components/pages/payments/index';
import Show from 'components/pages/payments/show/index';
import renderWithBackPath from 'components/modules/render_with_back_path';

import { Route, withRouter } from 'react-router';

const Routing = ({ match }) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index} />
    <Route exact path={`${match.path}/:id`} component={renderWithBackPath(Show, match.path)}/>
  </React.Fragment>
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
