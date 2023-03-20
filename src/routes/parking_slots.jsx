import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Show from 'components/pages/parking_slots/show';

function Routing (props) {
  const { match } = props;

  return (
    <React.Fragment>
      <Switch>
        <Route exact path={`${match.path}/:id`} component={Show} />
      </Switch>
    </React.Fragment>
  );
}

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
