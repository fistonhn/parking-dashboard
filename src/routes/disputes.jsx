import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import Index from 'components/pages/disputes/index';
import Show from 'components/pages/disputes/show';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = (props) => {
  const { match } = props;
  return (
    <React.Fragment>
      <Route exact path={match.path} component={Index} />
      <Route exact path={`${match.path}/:id`} render={renderWithBackPath(Show, match.path)} />
    </React.Fragment>
  );
};

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
