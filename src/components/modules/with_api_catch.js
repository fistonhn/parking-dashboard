import store from 'index';
import * as Sentry from '@sentry/browser';
import { clearToken } from 'actions/users';
import { notFound, internal, critical } from 'actions/server_errors';

const withApiCatch = (promise, isCritical = false) => {
  return promise.catch(error => {
    const { response } = error;
    if (response.status === 401) {
      store.dispatch(clearToken);
      return;
    }

    if (isCritical) {
      Sentry.captureException(error);
      store.dispatch(critical(error));
      return;
    }

    switch (response.status) {
      case 404:
        store.dispatch(notFound(error));
        break;
      case 422:
        throw error;
      case 500:
        Sentry.captureException(error);
        store.dispatch(internal(error));
        break;
      default:
        console.error(error.toJSON());
    }
  });
};

export default withApiCatch;
