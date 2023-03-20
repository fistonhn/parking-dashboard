import { ActivityLogActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ActivityLogActions);

const ActivityLogReducers = combineReducers({
  index,
  records
});

export default ActivityLogReducers;
