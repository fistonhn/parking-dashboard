import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Button, Input } from 'reactstrap';
import { isEmpty } from 'underscore';
/* Actions */
import { setToken, setCurrentUserData } from 'actions/users';
/* API */
import { auth } from 'api/users';
/* Base */
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { setErrorsMessages } from 'components/helpers/messages';
import Password from 'components/helpers/form_fields/password';
/* Modules */
import RedirectIfAuthorized from 'components/modules/redirect_if_authorized';

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    messages: [],
    isFetching: false
  }

  submitForm = (event) => {
    event.preventDefault();
    this.setState({
      isFetching: true
    });

    auth(this.state.username, this.state.password)
      .then(res => this.setToken(res.data))
      .catch(error => {
        console.log('jjj', error);
        const errorMessage = !error.request.status ? 'Could not connect to the server now. Please try again later.' : error;
        this.setState({
          isFetching: false,
          messages: setErrorsMessages(errorMessage)
        });
      });
  };

  setCurrentUserData = () => {
    this.props.setCurrentUserData()
      .catch(error => {
        this.setState({
          isFetching: false,
          messages: setErrorsMessages(error)
        });
      });
  }

  setToken (data) {
    this.setState({
      isFetching: false,
      messages: []
    });

    this.props.setToken(data.token);
    this.setCurrentUserData();
    this.props.history.push('/dashboard');
  }

  validInputs () {
    const { username, password } = this.state;
    return username && password;
  }

  render () {
    const { messages } = this.state;
    return (
      <AuthLayout>
        <CardLayout isFetching={this.state.isFetching} messages={messages}>
          <form onSubmit={this.submitForm}>
            <h1 className="h1-title-primary mb-4 text-center">Log In</h1>
            <div className="form-label-group">
              <label className="general-text-3" htmlFor="password">Login</label>
              <Input
                id="email"
                type="text"
                value={this.state.username}
                name="username"
                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                className={`form-control-lg ${!isEmpty(messages) ? 'input-error' : ''}`}
                placeholder="Enter your email or username"
                required
                autoFocus
              />
            </div>

            <div className="form-label-group mt-2">
              <label className="general-text-3" htmlFor="password">Password</label>
              <Password
                field={{ name: 'password', filled: false }}
                customAttr={{
                  onChange: e => this.setState({ [e.target.name]: e.target.value }),
                  className: `position-relative form-control-lg form-control ${!isEmpty(messages) ? 'input-error' : ''}`,
                  placeholder: 'Enter your password'
                }}
              />
            </div>

            <Link to='/forgot_password' className="mr-1 mt-2 mb-5 d-block general-text-1">Forgot password?</Link>
            <Button color={this.validInputs() ? 'primary-lg' : 'disabled-lg' } className="mt-4 p-3 text-uppercase btn-lg btn-block" type="submit" disabled={this.state.isFetching}>
              {this.state.isFetching ? btnSpinner({ className: 'spinner-border' }) : 'Log In'}
            </Button>
          </form>
        </CardLayout>
      </AuthLayout>
    );
  }
}

function mapDispatch (dispatch) {
  return { ...bindActionCreators({ setToken, setCurrentUserData }, dispatch) };
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  setCurrentUserData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(
  null,
  mapDispatch
)(RedirectIfAuthorized(Login));
