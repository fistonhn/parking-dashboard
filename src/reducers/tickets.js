import { TicketActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(TicketActions);

const TicketReducers = combineReducers({
  index,
  records
});

export default TicketReducers;
