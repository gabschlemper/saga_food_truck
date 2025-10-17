import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import productsReducer from './slices/productsSlice'
import dashboardReducer from './slices/dashboardSlice'
import ordersReducer from './slices/ordersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    dashboard: dashboardReducer,
    orders: ordersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})