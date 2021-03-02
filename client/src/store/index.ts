import { configureStore, combineReducers } from '@reduxjs/toolkit'
import selectedMap from '../slices/selectedMap'

const rootReducer = combineReducers({
  selectedMap
})

export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
  reducer: rootReducer,
})

export default store;