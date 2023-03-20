import env from '.env';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import Root from 'routes';
import thunkMiddleware from 'redux-thunk';
import persistTokenMiddleware from 'middleware/persist_token';
import persistCurrentUserMiddleware from 'middleware/persist_current_user';
import { createLogger } from 'redux-logger';
import * as serviceWorker from 'serviceWorker';
import * as Sentry from '@sentry/browser';
import reducers from 'reducers';
import { init_set_token, init_set_current_user } from 'actions';
import 'config/axios';
import 'config/generate_unique_tracker_id';
import 'bootstrap/dist/css/bootstrap.css';
import 'styles/global.sass';

const loggerMiddleware = createLogger();

const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      persistTokenMiddleware,
      persistCurrentUserMiddleware,
      thunkMiddleware,
      loggerMiddleware

    )
  )

);

Sentry.init({
  dsn: env.sentry_dns,
  environment: env.sentry_current_env
});

store.dispatch(init_set_token);
store.dispatch(init_set_current_user);

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default store;
