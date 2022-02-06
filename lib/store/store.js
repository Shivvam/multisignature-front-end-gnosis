import {configureStore} from '@reduxjs/toolkit'
import rootReducers from '../reducers/rootReducer'

export const initializeStore = () => {
  return configureStore({
    reducer: rootReducers
  })
}