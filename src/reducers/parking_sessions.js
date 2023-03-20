import { ParkingSessionActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ParkingSessionActions);

const ParkingLotReducers = combineReducers({
  index,
  records
});

export default ParkingLotReducers;
