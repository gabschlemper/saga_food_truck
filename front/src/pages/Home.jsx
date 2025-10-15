// src/pages/Home.jsx

import { useState } from 'react'
import { apiRequest } from '../config/api.js' // Ajuste o caminho de importação!
// import '../App.css' // Não precisamos do CSS aqui, ele pode ficar em App.jsx ou no index.css

function Home() {
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiRequest('/api/test')
      setApiResponse(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testRootAPI = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiRequest('/')
      setApiResponse(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>🚚 Saga Food Truck</h1>
      <h2>Teste de Comunicação Frontend ↔ Backend</h2>

      <div style={{ margin: '20px 0' }}>
        <button onClick={testRootAPI} disabled={loading}>
          Testar API Root (/)
        </button>
        <button onClick={testAPI} disabled={loading} style={{ marginLeft: '10px' }}>
          Testar API Test (/api/test)
        </button>
      </div>

      {loading && <p>🔄 Carregando...</p>}

      {error && (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', margin: '10px 0' }}>
          ❌ Erro: {error}
          <br />
          <small>Verifique se o backend está rodando em http://localhost:3002</small> 
          {/* Ajustei a porta para 3002, conforme seu setup! */}
        </div>
      )}

      {apiResponse && (
        <div style={{ color: 'green', padding: '10px', border: '1px solid green', margin: '10px 0', backgroundColor: '#f0f8f0' }}>
          ✅ Sucesso! Resposta da API:
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Home