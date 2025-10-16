import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { apiRequest } from '../../config/api'

// Mock data - replace with real API calls later
const mockProducts = [
  {
    id: 1,
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer com carne 150g, queijo, alface e tomate',
    price: 18.50,
    stock: 2,
    minimumStock: 5,
    status: 'Estoque Baixo'
  },
  {
    id: 2,
    name: 'Batata Frita',
    description: 'Porção de batata frita crocante (200g)',
    price: 8.00,
    stock: 0,
    minimumStock: 3,
    status: 'Sem Estoque'
  },
  {
    id: 3,
    name: 'Refrigerante Lata',
    description: 'Refrigerante em lata 350ml',
    price: 4.50,
    stock: 1,
    minimumStock: 10,
    status: 'Estoque Baixo'
  },
  {
    id: 4,
    name: 'Hot Dog Completo',
    description: 'Hot dog com salsicha, queijo, batata palha e molhos',
    price: 12.00,
    stock: 8,
    minimumStock: 5,
    status: 'Disponível'
  },
  {
    id: 5,
    name: 'Suco Natural',
    description: 'Suco natural de laranja 300ml',
    price: 6.00,
    stock: 15,
    minimumStock: 8,
    status: 'Disponível'
  }
]

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    // TODO: Replace with real API call
    // const response = await apiRequest('/api/products')
    // return response.data
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockProducts
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => {
    // TODO: Replace with real API call
    // const response = await apiRequest('/api/products', {
    //   method: 'POST',
    //   body: JSON.stringify(productData)
    // })
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return { ...productData, id: Date.now() }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }) => {
    // TODO: Replace with real API call
    // const response = await apiRequest(`/api/products/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data)
    // })
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return { id, ...data }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    // TODO: Replace with real API call
    // await apiRequest(`/api/products/${id}`, {
    //   method: 'DELETE'
    // })
    
    await new Promise(resolve => setTimeout(resolve, 300))
    return id
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload)
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload)
      })
  }
})

export const { setProducts, clearError } = productsSlice.actions
export default productsSlice.reducer
