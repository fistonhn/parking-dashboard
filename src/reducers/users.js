import { UserActions } from 'actions';
import { combineReducers } from 'redux';
import * as Sentry from '@sentry/browser';

function auth (state = { isAuthorized: false }, action) {
  switch (action.type) {
    case UserActions.SET_TOKEN:
      return Object.assign({}, state, {
        isAuthorized: true,
        token: action.payload
      });
    case UserActions.CLEAR_TOKEN:
      return Object.assign({}, state, {
        isAuthorized: false,
        token: null
      });
    case UserActions.LOG_OUT:
      localStorage.removeItem('TOKEN');
      return Object.assign({}, state, {
        isAuthorized: false,
        token: null
      });
    default:
      return state;
  }
}

function data (state = null, action) {
  switch (action.type) {
    case UserActions.SET_CURRENT_USER_DATA:
      Sentry.configureScope((scope) => {
        scope.setUser(action.payload);
      });
      return Object.assign({}, state, {
        ...action.payload
      });
    // case UserActions.CLEAR_CURRENT_USER_DATA:
    //   Sentry.configureScope((scope) => {
    //     scope.setUser({});
    //   });
    //   return {};
    default:
      return state;
  }
}

const UserReducers = combineReducers({
  auth,
  data
});

export default UserReducers;
