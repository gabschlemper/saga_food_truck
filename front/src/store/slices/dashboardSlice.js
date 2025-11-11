import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { apiRequest } from '../../config/api'

// Mock data - replace with real API calls later
const mockDashboardData = {
  todaySales: {
    value: 850.50,
    change: '+12%',
    changeText: 'em relação a ontem'
  },
  todayOrders: {
    value: 23,
    change: '+3',
    changeText: 'pedidos desde ontem'
  },
  totalProducts: {
    value: 15,
    change: '',
    changeText: 'produtos cadastrados'
  },
  lowStock: {
    value: 3,
    change: '',
    changeText: 'produtos precisam reposição'
  },
  recentActivity: [
    {
      id: 1,
      type: 'order',
      title: 'Novo Pedido',
      customerName: 'João Silva',
      items: [
        { name: 'Hambúrguer Artesanal', quantity: 2 },
        { name: 'Batata Frita', quantity: 1 }
      ],
      total: 45.00,
      time: '2 min atrás',
      status: 'received'
    },
    {
      id: 2,
      type: 'stock',
      title: 'Alerta de Estoque',
      productName: 'Hambúrguer Artesanal',
      currentStock: 2,
      minimumStock: 5,
      time: '15 min atrás',
      status: 'warning'
    },
    {
      id: 3,
      type: 'order_completed',
      title: 'Pedido Concluído',
      customerName: 'Maria Santos',
      items: [
        { name: 'Hot Dog Completo', quantity: 1 },
        { name: 'Refrigerante', quantity: 1 }
      ],
      total: 16.50,
      time: '45 min atrás',
      status: 'completed'
    },
    {
      id: 4,
      type: 'product_added',
      title: 'Produto Adicionado',
      productName: 'Suco Natural de Laranja',
      addedBy: 'Admin',
      time: '1 hora atrás',
      status: 'info'
    }
  ]
}

// Async thunks for API calls
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    // TODO: Replace with real API call
    // const response = await apiRequest('/api/dashboard/stats')
    // return response.data
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockDashboardData
  }
)

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async () => {
    // TODO: Replace with real API call
    // const response = await apiRequest('/api/dashboard/activity')
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDashboardData.recentActivity
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      todaySales: { value: 0, change: '', changeText: '' },
      todayOrders: { value: 0, change: '', changeText: '' },
      totalProducts: { value: 0, change: '', changeText: '' },
      lowStock: { value: 0, change: '', changeText: '' }
    },
    recentActivity: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = {
          todaySales: action.payload.todaySales,
          todayOrders: action.payload.todayOrders,
          totalProducts: action.payload.totalProducts,
          lowStock: action.payload.lowStock
        }
        state.recentActivity = action.payload.recentActivity
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch recent activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload
      })
  }
})

export const { clearError, updateStats } = dashboardSlice.actions
export default dashboardSlice.reducer
