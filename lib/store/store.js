import {configureStore} from '@reduxjs/toolkit'
import rootReducers from '../reducers/rootreducer.js'

export const initializeStore = () => {
  return configureStore({
    reducer: rootReducers
  })
}