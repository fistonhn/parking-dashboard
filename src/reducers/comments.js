import { CommentActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(CommentActions);

const CommentReducers = combineReducers({
  index,
  records
});

export default CommentReducers;
