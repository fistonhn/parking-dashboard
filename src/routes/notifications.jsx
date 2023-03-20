import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/notifications/index';
import Show from 'components/pages/notifications/show';
import New from 'components/pages/notifications/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({ match }) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index} />
    <Switch>
      <Route exact path={`${match.path}/new`} render={renderWithBackPath(New, match.path)} />
      <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)} />
    </Switch>
  </React.Fragment>
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
