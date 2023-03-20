import { list as selectList } from 'selectors/list';
import fetchData from './fetch_data';
import listFetchCondition from './fetch_list_condition';

const defaultProcessor = res => selectList(res);
const defaultMapper = entity => state => state[entity].index;

const connectList = (entity, actionType, fetcher, Component, props = {}) => {
  const {
    prop = 'list',
    action = 'setList',
    mapState = defaultMapper(entity),
    mapDispatch,
    processResponse = defaultProcessor,
    fetchCondition = listFetchCondition
  } = props;

  return fetchData(
    {
      Component,
      fetcher,
      mapState,
      mapDispatch,
      actionType,
      prop,
      action,
      processResponse,
      fetchCondition
    }
  );
};

export default connectList;
