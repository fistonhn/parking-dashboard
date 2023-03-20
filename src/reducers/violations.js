import { ViolationActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ViolationActions);

const ViolationReducers = combineReducers({
  index,
  records
});

export default ViolationReducers;
