import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRequest } from '../../config/api.js'

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Load user from localStorage on app start
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      return {
        token,
        user: JSON.parse(userData),
        isAuthenticated: true
      }
    }
  } catch {
    // Clear corrupted data
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }
  
  return {
    token: null,
    user: null,
    isAuthenticated: false
  }
}

const initialState = {
  ...loadUserFromStorage(),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        
        // Persist to localStorage
        localStorage.setItem('authToken', action.payload.token)
        localStorage.setItem('userData', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.token = null
        state.user = null
        state.isAuthenticated = false
      })
  }
})

export const { clearError, logout } = authSlice.actions
export default authSlice.reducer