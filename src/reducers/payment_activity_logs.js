import { PaymentActivityLogActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(PaymentActivityLogActions);

const PaymentActivityLogReducers = combineReducers({
  index,
  records
});

export default PaymentActivityLogReducers;
