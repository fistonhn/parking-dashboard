import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/tickets';
import Show from 'components/pages/tickets/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = (props) => {
  const { match } = props;
  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Switch>
        <Route exact path={`${match.path}/:id`} component={renderWithBackPath(Show, match.path)}/>
      </Switch>
    </React.Fragment>
  );
};

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
