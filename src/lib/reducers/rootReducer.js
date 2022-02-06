import { combineReducers } from 'redux'
 
import connection from './connectionSlice'

const reducers = combineReducers({ 
  connection
})

export default reducers;