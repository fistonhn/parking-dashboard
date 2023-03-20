/* eslint default-case: "off" */
import { INIT_SET_CURRENT_USER, UserActions } from 'actions';

const persistCurrentUserMiddleware = _ => next => action => {
  switch (action.type) {
    case INIT_SET_CURRENT_USER:
      // TODO: add token verification logic here (via fetch 'verify-token')
      const tokenPayload = localStorage.TOKEN;

      if (tokenPayload) {
        return next(UserActions.setCurrentUserData());
      }
      break;
  }

  return next(action);
};

export default persistCurrentUserMiddleware;
