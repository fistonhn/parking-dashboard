import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots_camera/index';
import CameraIndex from 'components/pages/cameras/index';
import CameraShow from 'components/pages/cameras/show';
import CameraNew from 'components/pages/cameras/new';
import renderWithBackPath from 'components/modules/render_with_back_path';

const Routing = ({ match }) => (
  <React.Fragment>
    <Route exact path={match.path} component={Index} />
    <Switch>
      <Route path={`${match.path}/:id`} render={(props) => (
        <React.Fragment>
          <Route exact path={`${props.match.path}`} render={renderWithBackPath(CameraIndex, `${match.url}`)} />
          <Route exact path={`${props.match.path.replace(':id', ':parking_lot_id')}/new`} render={renderWithBackPath(CameraNew, `${props.match.url}`)} />
          <Route exact path={`${props.match.path.replace(':id', ':parking_lot_id')}/cameras/:id`} render={renderWithBackPath(CameraShow, `${props.match.url}`)}/>
        </React.Fragment>
      )} />
    </Switch>
  </React.Fragment>
);

Routing.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(Routing);
