import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'underscore';

/* Actions */
/* API */
import { sendResetPasswordInstructionsRequest } from 'api/users';
/* Base */
import CardLayout from 'components/base/layout/card';
import AuthLayout from 'components/base/layout/auth';
/* Helpers */
import { btnSpinner } from 'components/helpers';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { setErrorsMessages } from 'components/helpers/messages';
/* Modules */
import RedirectIfAuthorized from 'components/modules/redirect_if_authorized';

class SendResetPasswordInstructions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      messages: {}
    };
  }

  static contextType = AlertMessagesContext

  submitForm = (event) => {
    event.preventDefault();
    this.setState({
      isFetching: true
    });

    sendResetPasswordInstructionsRequest(this.state.username)
      .then(res => this.redirectToLogin())
      .catch(error => {
        this.setState({
          isFetching: false,
          messages: setErrorsMessages(error)
        });
      });
  };

  redirectToLogin = () => {
    this.context.addAlertMessages([
      {
        text: 'Reset link has been successfully sent to his email address',
        type: 'Success'
      }
    ]);
    return this.props.history.push('/login');
  }

  validInputs () {
    const { username } = this.state;
    return username;
  }

  render () {
    const { messages } = this.state;

    return (
      <AuthLayout>
        <CardLayout title="Forgot Password" isFetching={this.state.isFetching} messages={messages}>
          <form onSubmit={this.submitForm}>
            <h1 className="h1-title-black mb-4 text-center">
              <Link to='/login' className="mr-3 h5" >
                <FontAwesomeIcon icon={faChevronLeft}/>
              </Link>
              Forgot password
            </h1>
            <div className="form-label-group mb-5">
              <label className="general-text-3" htmlFor="inputEmail">E-mail</label>
              <Input
                type="text"
                value={this.state.username}
                name="username"
                className={`form-control-lg ${!isEmpty(messages) ? 'input-error' : ''}`}
                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>
            <Button color={this.validInputs() ? 'primary-lg' : 'disabled-lg' } className="p-3 text-uppercase btn-lg btn-block" type="submit" disabled={this.state.isFetching}>
              {this.state.isFetching ? btnSpinner({ className: 'spinner-border' }) : 'Reset Password'}
            </Button>
          </form>
        </CardLayout>
      </AuthLayout>
    );
  }
}

SendResetPasswordInstructions.propTypes = {
  history: PropTypes.object.isRequired
};

export default RedirectIfAuthorized(SendResetPasswordInstructions);
