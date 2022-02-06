import { combineReducers } from 'redux'
 
import connection from './connectionslice'

const reducers = combineReducers({ 
  connection
})

export default reducers;