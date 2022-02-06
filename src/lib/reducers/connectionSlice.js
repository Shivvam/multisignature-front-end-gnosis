import {createSlice} from '@reduxjs/toolkit'

let initialState = {
  isConnected: false,
  account : "",
  allsafe : [],
}

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    _connect(state, action) {
      state.isConnected = true,
      state.account = action.payload.account
     },
    _setallsafe(state, action) {
      state.isConnected = true,
      state.allsafe = action.payload.allsafe
    },
    _disconnect(state, action) {
      state.isConnected = false,
      state.account = "",
      state.allsafe = ""
    }
  }
})

export const { _connect, _disconnect , _setallsafe } = connectionSlice.actions

export default connectionSlice.reducer