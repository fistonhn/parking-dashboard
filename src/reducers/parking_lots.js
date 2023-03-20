import { ParkingLotActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ParkingLotActions);

const ParkingLotReducers = combineReducers({
  index,
  records
});

export default ParkingLotReducers;
