import { combineReducers } from 'redux'
import spatialReducer from './spatialReducer'

export default combineReducers({
  spatials: spatialReducer,
})
