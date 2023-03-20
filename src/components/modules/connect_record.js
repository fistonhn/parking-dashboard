import fetchData from './fetch_data';

const defaultMapper = (entity, prop) => (state, ownProps) => {
  const { params } = ownProps.match;
  const { records } = state[entity];
  return { [prop]: records[params.id] };
};

const connectRecord = (entity, actionType, fetcher, Component, props = {}) => {
  const {
    prop = 'record',
    action = 'setRecord',
    mapState = defaultMapper(entity, prop)
  } = props;

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      prop,
      actionType,
      action
    }
  );
};

export default connectRecord;
