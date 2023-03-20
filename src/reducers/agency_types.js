import { AgencyTypesActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(AgencyTypesActions);

const AgencyTypeReducers = combineReducers({
  index,
  records
});

export default AgencyTypeReducers;
