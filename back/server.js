import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', apiRoutes);
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log('🚚 Saga Food Truck Backend');
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});
