import { PermitTypesActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(PermitTypesActions);

const PermitTypesReducers = combineReducers({
  index,
  records
});

export default PermitTypesReducers;
