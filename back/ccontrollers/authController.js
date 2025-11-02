export const login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email e senha são obrigatórios' 
    });
  }

  const validUsers = [
    { name: "admin teste", email: 'admin@sagafoodtruck.com', password: '123456', role: 'admin' },
    { name: "atendente teste", email: 'atendente@sagafoodtruck.com', password: '123456', role: 'atendente' }
  ];

  const user = validUsers.find(u => u.email === email && u.password === password && u.name);

  if (!user) {
    return res.status(401).json({ 
      error: 'Email ou senha incorretos' 
    });
  }

  const token = `token-${user.role}-${Date.now()}`;

  console.log(`✅ Login realizado: ${user.email} (${user.role})`);
  
  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};