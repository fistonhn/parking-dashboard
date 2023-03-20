import { ServerErrorActions } from 'actions';
import { combineReducers } from 'redux';

const error = (state = { payload: null, critical: false }, action) => {
  switch (action.type) {
    case ServerErrorActions.CRITICAL:
      return Object.assign({}, state, {
        payload: action.payload,
        critical: true
      });
    case ServerErrorActions.NOT_FOUND:
      return Object.assign({}, state, {
        payload: action.payload,
        critical: false
      });
    case ServerErrorActions.INTERNAL:
      return Object.assign({}, state, {
        payload: action.payload,
        critical: false
      });
    case ServerErrorActions.CLEAR_ERRORS:
      return Object.assign({}, state, {
        payload: null,
        critical: false
      });
    default:
      return state;
  }
};

const ServerErrorReducers = combineReducers({
  error
});

export default ServerErrorReducers;
