import { PermitsActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(PermitsActions);

const ParkingLotReducers = combineReducers({
  index,
  records
});

export default ParkingLotReducers;
