import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { isEmpty } from 'underscore';

/* Actions */
/* API */
import { resetPasswordRequest, checkPasswordToken } from 'api/users';
/* Base */
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { setErrorsMessages } from 'components/helpers/messages';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Password from 'components/helpers/form_fields/password';
/* Modules */
import RedirectIfAuthorized from 'components/modules/redirect_if_authorized';

class ResetPassword extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    messages: [],
    isFetching: false,
    passwordTokenInvalid: true
  }

  static contextType = AlertMessagesContext

  submitForm = (event) => {
    event.preventDefault();
    const resetPasswordToken = this.props.match.params.reset_password_token;
    if (this.state.password === this.state.passwordConfirmation) {
      this.setState({
        isFetching: true
      });
      return resetPasswordRequest(this.state.password, resetPasswordToken)
        .then(res => this.redirectToLogin('Your password was successfully changed'))
        .catch(error => {
          this.setState({
            isFetching: false,
            messages: setErrorsMessages(error)
          });
        });
    }
    this.setState({
      messages: setErrorsMessages('Your password and confirmation password do not match')
    });
  };

  redirectToLogin = (text) => {
    this.context.addAlertMessages([{
      type: 'Success',
      text
    }]);
    this.props.history.push('/login');
  }

  verifyToken = () => {
    const resetPasswordToken = this.props.match.params.reset_password_token;
    checkPasswordToken(resetPasswordToken)
      .then(res => {
        const { validToken } = res.data;
        if (validToken) {
          this.setState({ passwordTokenInvalid: false });
        } else {
          this.setState({
            messages: setErrorsMessages('This link is no longer valid')
          });
        }
      })
      .catch(() => {
        this.props.history.push('/login');
      });
  }

  componentDidMount () {
    this.verifyToken();
  }

  validInputs () {
    const { password, passwordConfirmation, passwordTokenInvalid } = this.state;
    if (passwordTokenInvalid) {
      return false;
    }

    return password ? passwordConfirmation === password : false;
  }

  render () {
    const { messages } = this.state;

    return (
      <AuthLayout>
        <CardLayout title="Reset Your Password" isFetching={this.state.isFetching} messages={messages}>
          <form onSubmit={this.submitForm}>
            <h1 className="h1-title-black mb-4 text-center">New password</h1>
            <div className="form-label-group">
              <label className="general-text-3" htmlFor="password">Password</label>
              <Password
                field={{
                  name: 'password'
                }}
                customAttr={{
                  onChange: e => this.setState({ [e.target.name]: e.target.value }),
                  className: `position-relative form-control-lg form-control ${!isEmpty(messages) ? 'input-error' : ''}`,
                  placeholder: 'Enter your password'
                }}
              />
            </div>

            <div className="form-label-group mt-2">
              <label className="general-text-3" htmlFor="passwordConfirmation">Password Confirmation</label>
              <Password
                field={{
                  name: 'passwordConfirmation'
                }}
                customAttr={{
                  onChange: e => this.setState({ [e.target.name]: e.target.value }),
                  className: `position-relative form-control-lg form-control ${!isEmpty(messages) ? 'input-error' : ''}`,
                  placeholder: 'Enter your password'
                }}
              />
            </div>

            <Button disabled={this.state.passwordTokenInvalid || this.state.isFetching} color={this.validInputs() ? 'primary-lg' : 'disabled-lg' } className="mt-4 p-3 text-uppercase btn-lg btn-block" type="submit">
              {this.state.isFetching ? btnSpinner({ className: 'spinner-border' }) : 'Save'}
            </Button>
          </form>
        </CardLayout>
      </AuthLayout>
    );
  }
}

ResetPassword.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default RedirectIfAuthorized(ResetPassword);
