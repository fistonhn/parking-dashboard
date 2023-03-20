import { ReportActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index } = reduceEntity(ReportActions);

const ReportReducers = combineReducers({
  index
});

export default ReportReducers;
