import { SubscriberVehicleActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(SubscriberVehicleActions);

const SubscriberVehicleReducers = combineReducers({
  index,
  records
});

export default SubscriberVehicleReducers;
