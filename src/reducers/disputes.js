import { DisputeActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(DisputeActions);

const DisputeReducers = combineReducers({
  index,
  records
});

export default DisputeReducers;
