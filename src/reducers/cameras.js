import { CameraActions } from 'actions';
import { combineReducers } from 'redux';
import reduceEntity from './entities';

const { index, records } = reduceEntity(CameraActions);

const CameraReducers = combineReducers({
  index,
  records
});

export default CameraReducers;
