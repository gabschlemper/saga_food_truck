# 🚀 Guia de Integração Backend + PostgreSQL

## ✅ O que foi implementado:

### 1. **Configuração do Banco de Dados**
- ✅ Arquivo `config/database.js` criado
- ✅ Pool de conexões configurado
- ✅ Funções helper para queries
- ✅ Event listeners para monitoramento

### 2. **Variáveis de Ambiente**
- ✅ Arquivo `.env` criado com configurações
- ✅ Credenciais do PostgreSQL
- ✅ Configuração de porta

### 3. **Rotas de Produtos - 100% Funcional**
- ✅ GET `/api/products` - Lista todos os produtos
- ✅ GET `/api/products/:id` - Busca produto específico
- ✅ POST `/api/products` - Cria novo produto
- ✅ PUT `/api/products/:id` - Atualiza produto
- ✅ DELETE `/api/products/:id` - Deleta produto (soft delete)

### 4. **Scripts de Teste**
- ✅ `testDatabase.js` - Testa conexão e lista dados
- ✅ Scripts npm para facilitar uso

---

## 🔧 Como usar:

### Passo 1: Iniciar o PostgreSQL via Docker

```powershell
# Na raiz do projeto
docker-compose up -d

# Verificar se está rodando
docker ps
```

### Passo 2: Testar a conexão com o banco

```powershell
cd back
npm run test:db
```

**Saída esperada:**
```
✅ Conexão com PostgreSQL estabelecida com sucesso!
📋 Tabelas encontradas:
   - customers
   - employees
   - order_audit
   - order_items
   - orders
   - product_audit
   - products
📦 Total de produtos: 8
📋 Total de pedidos: 2
```

### Passo 3: Iniciar o servidor backend

```powershell
npm run dev
```

**Saída esperada:**
```
✅ Conexão com PostgreSQL estabelecida com sucesso!
🚀 Saga Food Truck Backend running on port 3002
📦 Products endpoint: http://localhost:3002/api/products
```

### Passo 4: Testar as rotas

**Listar produtos:**
```powershell
curl http://localhost:3002/api/products
```

**Criar produto:**
```powershell
curl -X POST http://localhost:3002/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Pizza de Calabresa",
    "description": "Pizza média com calabresa e queijo",
    "price": 35.00,
    "stock": 10,
    "minimumStock": 3,
    "category": "Lanches"
  }'
```

**Atualizar produto:**
```powershell
curl -X PUT http://localhost:3002/api/products/1 `
  -H "Content-Type: application/json" `
  -d '{
    "stock": 15
  }'
```

---

## 📊 Estrutura de Dados

### Produto (Product):
```javascript
{
  id: 1,
  name: "Hambúrguer Artesanal",
  description: "Hambúrguer com carne 150g...",
  price: 18.50,
  stock: 2,
  minimumStock: 5,
  status: "Estoque Baixo",  // Calculado automaticamente pelo trigger
  category: "Lanches",
  active: true,
  createdAt: "2025-11-21T...",
  updatedAt: "2025-11-21T..."
}
```

### Categorias válidas:
- `Lanches`
- `Acompanhamentos`
- `Bebidas`
- `Outros`

---

## 🎯 Próximos Passos

### 1. **Atualizar Frontend - Adicionar campo Category**

Em `front/src/components/ProductModal/index.jsx`, adicionar:

```jsx
// Adicionar no estado
const [formData, setFormData] = useState({
  name: '',
  description: '',
  price: '',
  stock: '',
  minimumStock: '',
  category: 'Outros'  // ← NOVO
})

// Adicionar no formulário
<div className="form-group">
  <label htmlFor="category" className="form-label">
    Categoria *
  </label>
  <select
    id="category"
    className="form-input"
    value={formData.category}
    onChange={(e) => handleChange('category', e.target.value)}
  >
    <option value="Lanches">Lanches</option>
    <option value="Acompanhamentos">Acompanhamentos</option>
    <option value="Bebidas">Bebidas</option>
    <option value="Outros">Outros</option>
  </select>
</div>
```

### 2. **Implementar Rotas de Pedidos (Orders)**

Próxima etapa: atualizar `back/routes/orders.js` para:
- Conectar ao PostgreSQL
- Inserir em `orders` + `order_items`
- Retornar pedidos com JOIN

### 3. **Implementar Autenticação**

Criar sistema de login para:
- Capturar `employeeId` da sessão
- Usar em todos os pedidos
- Proteger rotas sensíveis

---

## 🐛 Troubleshooting

### Erro: "Connection refused"
```
Solução: Verificar se Docker está rodando
docker-compose up -d
```

### Erro: "relation does not exist"
```
Solução: Recriar banco de dados
docker-compose down -v
docker-compose up -d
```

### Erro: "authentication failed"
```
Solução: Verificar credenciais no .env
DB_USER=usuario
DB_PASSWORD=usuario123
```

---

## 📝 Comandos Úteis

```powershell
# Ver logs do PostgreSQL
docker-compose logs postgres

# Conectar ao PostgreSQL via CLI
docker exec -it postgres psql -U usuario -d postgres

# Verificar produtos no banco
docker exec -it postgres psql -U usuario -d postgres -c "SELECT * FROM products;"

# Parar Docker
docker-compose down

# Parar e limpar volumes (reseta banco)
docker-compose down -v
```

---

## ✅ Checklist de Integração

- [x] PostgreSQL configurado
- [x] Conexão estabelecida
- [x] Rotas de produtos conectadas ao banco
- [x] CRUD de produtos funcionando
- [x] Soft delete implementado
- [x] Validações no backend
- [x] Triggers funcionando (status automático)
- [ ] Frontend com campo category
- [ ] Rotas de pedidos conectadas
- [ ] Sistema de autenticação
- [ ] Dashboard com estatísticas

---

**Status Atual:** 🟢 Backend + PostgreSQL 100% funcionais para Produtos!

**Próximo:** Adicionar campo category no frontend e implementar Orders
