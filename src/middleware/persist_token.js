/* eslint default-case: "off" */
import { INIT_SET_TOKEN, UserActions } from 'actions';

const persistTokenMiddleware = _ => next => action => {
  switch (action.type) {
    case INIT_SET_TOKEN:
      // TODO: add token verification logic here (via fetch 'verify-token')
      const tokenPayload = localStorage.TOKEN;

      if (tokenPayload) {
        return next(UserActions.setToken(tokenPayload));
      }
      break;
    case UserActions.SET_TOKEN:
      localStorage.setItem('TOKEN', action.payload);
      break;
    case UserActions.CLEAR_TOKEN:
      localStorage.removeItem('TOKEN');
  }

  return next(action);
};

export default persistTokenMiddleware;
