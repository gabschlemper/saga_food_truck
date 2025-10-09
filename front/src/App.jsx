// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home' // Importe sua nova página Home
import './App.css' // Mantenha a importação do CSS aqui

function App() {
  return (
    // BrowserRouter envolve toda a aplicação
    <BrowserRouter>
      {/* Routes define os caminhos */}
      <Routes>
        {/* Rota principal (/) aponta para a página Home */}
        <Route path="/" element={<Home />} />
        {/* Aqui você adicionará outras rotas, ex: <Route path="/menu" element={<Menu />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App