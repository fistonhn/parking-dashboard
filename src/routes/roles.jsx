import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Show from 'components/pages/roles/show';
import New from 'components/pages/roles/new';
import Index from 'components/pages/roles/index';
import renderWithBackPath from 'components/modules/render_with_back_path';

function Routing (props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index} />
      <Switch>
        <Route exact path={`${match.path}/new/`} render={renderWithBackPath(New, `${match.url}/`)} />
        <Route path={`${match.path}/:id`} render={(props) => (
          <React.Fragment>
            <Route exact path={`${props.match.path}`} component={renderWithBackPath(Show, `${match.url}/`)} />
          </React.Fragment>
        )} />
      </Switch>
    </React.Fragment>
  );
}

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
