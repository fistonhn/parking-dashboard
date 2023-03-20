import { VehiclesActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(VehiclesActions);

const AgencyReducers = combineReducers({
  index,
  records
});

export default AgencyReducers;
