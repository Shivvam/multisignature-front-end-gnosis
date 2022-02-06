import {configureStore} from '@reduxjs/toolkit'
import rootReducers from '../reducers/rootreducer'

export const initializeStore = () => {
  return configureStore({
    reducer: rootReducers
  })
}