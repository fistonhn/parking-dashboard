import { SubscriberActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(SubscriberActions);

const SubscriberReducers = combineReducers({
  index,
  records
});

export default SubscriberReducers;
