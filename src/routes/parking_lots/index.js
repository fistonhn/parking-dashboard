import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router';
import Index from 'components/pages/parking_lots/index';
import Rules from 'components/pages/parking_lots/show/rules';
import ParkingSessionsIndex from 'components/pages/parking_lots/show/parking_sessions/index';
import ParkingSessionsShow from 'components/pages/parking_lots/show/parking_sessions/show';
import ParkingSlotsIndex from 'components/pages/parking_lots/show/parking_slots';
import Voi from 'components/pages/parking_lots/show/voi';
import renderWithBackPath from 'components/modules/render_with_back_path';
import renderWithParentPath from 'components/modules/render_with_parent_path';
import { ParkingSpaces, ParkingLotsNew as New, ParkingLotsShow as Show } from '../../asyncComponents';

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
            <Route exact path={`${props.match.path}/rules`} render={renderWithParentPath(renderWithBackPath(Rules, `${match.url}/`), props.match.url)} />
            <Route exact path={`${props.match.path}/spaces`} render={renderWithParentPath(renderWithBackPath(ParkingSpaces, `${match.url}/`), props.match.url)}/>
            <Route exact path={`${props.match.path}/voi`} render={renderWithParentPath(renderWithBackPath(Voi, `${match.url}/`), props.match.url)}/>
            <Route exact path={`${props.match.path}/parking_sessions`} render={renderWithBackPath(ParkingSessionsIndex, `${props.match.url}/spaces`)}/>
            <Route
              exact
              path={`${props.match.path.replace(':id', ':parking_lot_id')}/parking_sessions/:id`}
              render={renderWithBackPath(ParkingSessionsShow, `${props.match.url}/parking_sessions`)}
            />
            <Route
              exact path={`${props.match.path}/parking_slots`}
              component={ParkingSlotsIndex}
            />
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
