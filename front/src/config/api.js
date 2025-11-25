const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  const config = { 
    ...defaultOptions, 
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      if (response.status === 401) {
        if (token && window.location.pathname !== '/login') {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
      }
      
      throw new Error(errorMessage);
    }

    // 🔥 Correção mínima: se for GET no login, só retorna ok
    if (endpoint === '/api/auth/login' && (!options.method || options.method === 'GET')) {
      return { ok: true };
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
