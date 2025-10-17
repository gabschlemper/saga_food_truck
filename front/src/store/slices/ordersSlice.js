import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRequest } from '../../config/api'

// Async thunks for API calls
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const response = await apiRequest(`/api/orders${params ? `?${params}` : ''}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao carregar pedidos')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao criar pedido')
    }
  }
)

export const updateOrder = createAsyncThunk(
  'orders/update',
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Erro ao atualizar pedido')
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
          console.log("pending action:");
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        console.log("fulfilled action:", action);
        state.loading = false
        state.orders = action.payload
    })
    .addCase(fetchOrders.rejected, (state, action) => {
        console.log("rejected action:", action);
        state.loading = false
        state.error = action.payload
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = ordersSlice.actions
export default ordersSlice.reducer
