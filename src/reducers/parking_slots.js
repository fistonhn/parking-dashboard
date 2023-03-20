import { ParkingSlotActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ParkingSlotActions);

const ParkingSlotReducers = combineReducers({
  index,
  records
});

export default ParkingSlotReducers;
