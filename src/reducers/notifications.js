import { NotificationActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(NotificationActions);

const NotificationReducers = combineReducers({
  index,
  records
});

export default NotificationReducers;
