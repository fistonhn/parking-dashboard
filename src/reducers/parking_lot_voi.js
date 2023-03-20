import { ParkingLotVoiActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(ParkingLotVoiActions);

const ParkingLotVoiReducers = combineReducers({
  index,
  records
});

export default ParkingLotVoiReducers;
