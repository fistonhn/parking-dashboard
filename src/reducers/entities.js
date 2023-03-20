const reduceEntity = actions => {
  const index = (state = { list: [], total: 0, perPage: 10, page: 1 }, action) => {
    switch (action.type) {
      case actions.SET_LIST:
        return {
          ...state,
          ...action.payload
        };
      case actions.SET_LIST_ELEMENT:
        const updatedList = state.list.map(element => (
          action.payload.id !== element.id ? element : action.payload
        ));
        return {
          ...state,
          list: updatedList
        };
      case actions.POP_LIST_ELEMENT:
        const poppedList = state.list.filter(element => (
          action.payload.id !== element.id
        ));
        return {
          ...state,
          total: state.total - 1,
          list: poppedList
        };
      default:
        return state;
    }
  };

  const records = (state = {}, action) => {
    switch (action.type) {
      case actions.SET_RECORD:
        return {
          ...state,
          [action.payload.id]: action.payload
        };
      default:
        return state;
    }
  };

  return { index, records };
};

export default reduceEntity;
