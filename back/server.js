require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('🚀 Rota raiz acessada!');
  res.json({ 
    message: 'Saga Food Truck API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  console.log('✅ Rota de teste acessada!');
  res.json({ 
    status: 'success',
    message: 'Backend está rodando perfeitamente!'
  });
});

app.listen(PORT, () => {
  console.log('🚚 Saga Food Truck Backend');
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});
