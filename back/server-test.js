import 'dotenv/config';
import express from 'express';
import { testConnection, pool } from './config/database.js';

const app = express();
const PORT = 3001;

app.use(express.json());

// Test simple route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM products');
    res.json({ 
      success: true, 
      count: result.rows[0].total,
      message: 'Database OK' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, async () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`Test: http://localhost:${PORT}/health`);
  console.log(`Test DB: http://localhost:${PORT}/test-db`);
  await testConnection();
});
