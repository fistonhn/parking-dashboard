import { RoleActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(RoleActions);

const RoleReducers = combineReducers({
  index,
  records
});

export default RoleReducers;
