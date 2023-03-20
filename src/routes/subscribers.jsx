import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import Index from 'components/pages/subscribers/index';
import Show from 'components/pages/subscribers/show';
import vehiclesShow from 'components/pages/subscribers/show/vehicles/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = (props) => {
  const { match } = props;
  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index}/>
      <Route exact path={`${match.path}/:id`} component={renderWithBackPath(Show, match.path)}/>
      <Route exact path={`${match.path}/:subscriberId/vehicles/:id`} component={renderWithBackPath(vehiclesShow, match.path)}/>
    </React.Fragment>
  );
};

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
