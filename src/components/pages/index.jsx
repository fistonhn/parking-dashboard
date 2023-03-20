import React from 'react';
import PropTypes from 'prop-types';
import Login from './login';
import SendResetPasswordInstructions from './send_reset_password_instructions';
import ResetPassword from './reset_password';
import Dashboard from './frame';
import PrivateRoute from 'routes/private_route';
import Layout from 'components/base/layout';
import Cookies from 'js-cookie';

import { Redirect, Route } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AlertMessages } from 'components/helpers/alert_messages';
import { ActionCableProvider } from 'react-actioncable-provider';
import env from '.env';

/* Actions */
import { logOut, setToken, setCurrentUserData } from 'actions/users';

class App extends React.Component {
  componentWillMount () {
    const tokenFromCookies = Cookies.get('_session_auth_token');

    if (tokenFromCookies) {
      this.props.setToken(tokenFromCookies);
      this.props.setCurrentUserData();
    }
  }

  componentDidMount () {
    const { location, history } = this.props;

    if (location.pathname === '/') {
      history.push('/dashboard');
    }
  }

  render () {
    const { serverError, serverErrorCritical } = this.props;
    if (serverError && serverErrorCritical) {
      throw new Error(serverError.message);
    }

    return (
      <React.Fragment>
        <ActionCableProvider url={env.backend_cable}>
          <AlertMessages>
            <Layout>
              <Route path='/sign_out' render={() => {
                RemoveData.call(this);
                return <Redirect to='/login' />;
              }} />
              <PrivateRoute path='/dashboard' component={Dashboard} />
            </Layout>
            <Route path="/login" component={Login}/>
            <Route path="/forgot_password" component={SendResetPasswordInstructions}/>
            <Route path="/reset_password/:reset_password_token" component={ResetPassword}/>
          </AlertMessages>
        </ActionCableProvider>
      </React.Fragment>
    );
  }
}

function RemoveData () {
  removeFilters();
  this.props.logOut();
}

const removeFilters = () => {
  Object.keys(localStorage).forEach(function (key) {
    if (/^FILTERS_/.test(key)) {
      localStorage.removeItem(key);
    }
  });
};

App.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  serverError: PropTypes.object,
  serverErrorCritical: PropTypes.bool,
  setToken: PropTypes.func.isRequired,
  setCurrentUserData: PropTypes.func.isRequired
};

const mapState = state => {
  const { server } = state;
  const { error = {} } = server;
  return { serverError: error.payload, serverErrorCritical: error.critical };
};

function mapDispatch (dispatch) {
  return { ...bindActionCreators({ logOut, setToken, setCurrentUserData }, dispatch) };
}

export default connect(mapState, mapDispatch)(App);
