import React from 'react';
import PropTypes from 'prop-types';
import AlertErrors from './alert_errors';
import { withRouter } from 'react-router-dom';
import { clearErrors } from 'actions/server_errors';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends React.Component {
  state = {
    appErrors: {
      response: {},
      message: ''
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.dispatch(clearErrors);
      this.setState({
        appErrors: {
          response: {},
          message: ''
        }
      });
    }
  }

  componentDidCatch (error, info) {
    Sentry.withScope((scope) => {
      scope.setExtras(info);
      Sentry.captureException(error);
      this.setState({
        appErrors: {
          response: info,
          message: error.message
        }
      });
    });
  }

  render () {
    const { serverError } = this.props;
    const { appErrors } = this.state;

    if (serverError) {
      const { url } = serverError.config;
      const { response } = serverError;
      return <AlertErrors response={serverError} message={`Request to ${url} returned ${response.status} status code`} />;
    }

    if (appErrors.message) {
      return <AlertErrors {...appErrors} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  location: PropTypes.object.isRequired,
  serverError: PropTypes.bool
};

export default connect()(withRouter(ErrorBoundary));
