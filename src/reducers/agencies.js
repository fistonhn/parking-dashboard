import { AgencyActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(AgencyActions);

const AgencyReducers = combineReducers({
  index,
  records
});

export default AgencyReducers;
