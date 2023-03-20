import { PaymentsActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(PaymentsActions);

const ParkingLotReducers = combineReducers({
  index,
  records
});

export default ParkingLotReducers;
