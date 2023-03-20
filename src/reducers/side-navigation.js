import { SideNavActions } from 'actions';

export default (state = { openedTitle: false }, action) => {
  switch (action.type) {
    case SideNavActions.TOGGLE_NAV_ITEM:
      return {
        ...state,
        openedTitle: state.openedTitle === action.title
          ? false
          : action.title
      };
    default: return state;
  }
};
