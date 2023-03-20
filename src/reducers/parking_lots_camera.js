import { ParkingLotCameraActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ParkingLotCameraActions);

const ParkingLotCameraReducers = combineReducers({
  index,
  records
});

export default ParkingLotCameraReducers;
