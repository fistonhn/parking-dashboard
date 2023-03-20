import { AdminActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(AdminActions);

const AdminReducers = combineReducers({
  index,
  records
});

export default AdminReducers;
