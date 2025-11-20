# ✅ Mudanças Realizadas no init.sql

## 🎯 Objetivo
Adaptar o schema do banco de dados PostgreSQL para ser 100% compatível com o frontend React/Redux que usa nomenclatura em **inglês com camelCase**.

---

## 📊 Resumo das Mudanças

### 1. **ENUMS - Renomeados para Inglês**

| Antes (Português) | Depois (Inglês) |
|-------------------|-----------------|
| `tipo_status_pedido` | `order_status_type` |
| `tipo_status_pagamento` | `payment_status_type` |
| `tipo_forma_pagamento` | `payment_method_type` |
| `tipo_status_produto` | `product_status_type` |
| `tipo_categoria_produto` | `product_category_type` |
| `tipo_role_usuario` | `user_role_type` |

✅ **Valores dos ENUMs mantidos em português** conforme usado no frontend!

---

### 2. **TABELAS - Nomes e Campos em Inglês (camelCase)**

#### Tabela: `funcionarios` → `employees`
```sql
-- ANTES:
funcionarios (
    id, nome, email, senha, role, ativo,
    criado_em, atualizado_em
)

-- DEPOIS:
employees (
    id, name, email, password, role, active,
    "createdAt", "updatedAt"
)
```

#### Tabela: `clientes` → `customers`
```sql
-- ANTES:
clientes (
    id, nome, telefone, email,
    criado_em, atualizado_em
)

-- DEPOIS:
customers (
    id, name, phone, email,
    "createdAt", "updatedAt"
)
```

#### Tabela: `produtos` → `products`
```sql
-- ANTES:
produtos (
    id, nome, descricao, preco, estoque, estoque_minimo,
    status, categoria, ativo, criado_em, atualizado_em
)

-- DEPOIS:
products (
    id, name, description, price, stock, "minimumStock",
    status, category, active, "createdAt", "updatedAt"
)
```

✅ **Campo `category` agora está presente** (era `categoria`)

#### Tabela: `pedidos` → `orders`
```sql
-- ANTES:
pedidos (
    id, id_funcionario, id_cliente, nome_cliente,
    valor_total, forma_pagamento, status_pagamento,
    status, observacoes, criado_em, atualizado_em
)

-- DEPOIS:
orders (
    id, "employeeId", "customerId", customer,
    total, "paymentMethod", "paymentStatus",
    status, notes, "createdAt", "updatedAt"
)
```

✅ **Agora compatível com o frontend:**
- `nome_cliente` → `customer`
- `valor_total` → `total`
- `forma_pagamento` → `paymentMethod`
- `status_pagamento` → `paymentStatus`
- `observacoes` → `notes`

#### Tabela: `itens_pedido` → `order_items`
```sql
-- ANTES:
itens_pedido (
    id, id_pedido, id_produto, nome_produto,
    quantidade, preco_unitario, subtotal, criado_em
)

-- DEPOIS:
order_items (
    id, "orderId", "productId", name,
    quantity, price, subtotal, "createdAt"
)
```

✅ **Estrutura alinhada com frontend:**
- `nome_produto` → `name`
- `quantidade` → `quantity`
- `preco_unitario` → `price`

#### Tabela: `auditoria_pedidos` → `order_audit`
```sql
-- ANTES:
auditoria_pedidos (
    id, id_pedido, acao, id_funcionario,
    dados_anteriores, dados_novos, data_acao
)

-- DEPOIS:
order_audit (
    id, "orderId", action, "employeeId",
    "previousData", "newData", "actionDate"
)
```

#### Tabela: `auditoria_produtos` → `product_audit`
```sql
-- ANTES:
auditoria_produtos (
    id, id_produto, acao, id_funcionario,
    campo_alterado, valor_anterior, valor_novo, data_acao
)

-- DEPOIS:
product_audit (
    id, "productId", action, "employeeId",
    "fieldChanged", "previousValue", "newValue", "actionDate"
)
```

---

### 3. **FUNCTIONS E TRIGGERS - Atualizados**

| Função Antiga | Função Nova |
|---------------|-------------|
| `atualizar_timestamp()` | `update_timestamp()` |
| `calcular_status_produto()` | `calculate_product_status()` |
| `auditar_pedido()` | `audit_order()` |
| `calcular_subtotal_item()` | `calculate_item_subtotal()` |
| `atualizar_estoque_produto()` | `update_product_stock()` |

✅ Todos os triggers renomeados para inglês
✅ Referências às colunas atualizadas (ex: `NEW.estoque` → `NEW.stock`)

---

### 4. **VIEWS - Renomeadas e Compatíveis**

| View Antiga | View Nova | Campos Frontend |
|-------------|-----------|-----------------|
| `vw_pedidos_completos` | `vw_orders_complete` | ✅ `items[]`, `paymentMethod`, etc |
| `vw_produtos_estoque_baixo` | `vw_products_low_stock` | ✅ `stock`, `minimumStock` |
| `vw_estatisticas_dia` | `vw_daily_stats` | ✅ `totalOrders`, `totalSales` |

---

### 5. **DADOS SEED - Atualizados**

Todos os INSERTs iniciais foram adaptados para as novas tabelas e colunas:

```sql
-- Funcionários → Employees
INSERT INTO employees (name, email, password, role) VALUES ...

-- Produtos → Products
INSERT INTO products (name, description, price, stock, "minimumStock", category) VALUES ...

-- Clientes → Customers
INSERT INTO customers (name, phone) VALUES ...

-- Pedidos → Orders
INSERT INTO orders ("employeeId", "customerId", customer, total, "paymentMethod", "paymentStatus", status) VALUES ...

-- Itens → Order Items
INSERT INTO order_items ("orderId", "productId", name, quantity, price) VALUES ...
```

---

## 🔄 Mapeamento Completo de Campos

### Frontend → SQL (Produtos)
```javascript
{
  id: products.id,
  name: products.name,
  description: products.description,
  price: products.price,
  stock: products.stock,
  minimumStock: products."minimumStock",
  status: products.status,
  category: products.category,        // ✅ NOVO
  active: products.active,            // ✅ NOVO
  createdAt: products."createdAt",
  updatedAt: products."updatedAt"
}
```

### Frontend → SQL (Pedidos)
```javascript
{
  id: orders.id,
  employeeId: orders."employeeId",    // ✅ NOVO (obrigatório)
  customerId: orders."customerId",    // ✅ NOVO (opcional)
  customer: orders.customer,
  total: orders.total,
  paymentMethod: orders."paymentMethod",
  paymentStatus: orders."paymentStatus",
  status: orders.status,
  notes: orders.notes,                // ✅ NOVO (opcional)
  items: [                            // ✅ De order_items
    {
      productId: order_items."productId",
      name: order_items.name,
      quantity: order_items.quantity,
      price: order_items.price,
      subtotal: order_items.subtotal
    }
  ],
  createdAt: orders."createdAt",
  updatedAt: orders."updatedAt"
}
```

---

## ⚠️ Observações Importantes

### 1. **CamelCase com Aspas**
Campos com camelCase no PostgreSQL precisam de aspas duplas:
```sql
SELECT "createdAt", "updatedAt", "minimumStock" FROM products;
```

### 2. **Campo `employeeId` é Obrigatório**
Todo pedido precisa ter um `employeeId`. O frontend precisa enviar isso (pode vir da sessão/autenticação).

### 3. **Campo `category` Agora é Obrigatório em Produtos**
O frontend precisa adicionar um campo de seleção de categoria no modal de produtos.

### 4. **Estrutura de `items` nos Pedidos**
Quando o frontend envia um pedido com `items[]`, o backend precisa:
1. Inserir na tabela `orders`
2. Para cada item, inserir em `order_items` com o `orderId` gerado

---

## 🚀 Próximos Passos no Backend

Agora que o SQL está compatível, o backend precisa:

### 1. **Conectar ao PostgreSQL Real**
```javascript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'saga_food_truck',
  password: 'sua_senha',
  port: 5432,
});
```

### 2. **Atualizar Rotas de Produtos**
- Remover mock data
- Fazer queries SQL com os novos nomes de colunas
- Adicionar suporte ao campo `category`

### 3. **Atualizar Rotas de Pedidos**
- Implementar INSERT em `orders` + `order_items`
- Adicionar `employeeId` (da sessão)
- Implementar JOIN para retornar pedidos com items

### 4. **Exemplo de Query de Pedidos**
```javascript
// GET /api/orders - Com items incluídos
const result = await pool.query(`
  SELECT * FROM vw_orders_complete
  ORDER BY "createdAt" DESC
`);
```

---

## ✅ Benefícios das Mudanças

1. ✅ **100% compatível** com o frontend React
2. ✅ **Sem necessidade de transformação** de dados
3. ✅ **Código mais limpo** no backend
4. ✅ **Mantém ENUMs em português** (requisito do cliente)
5. ✅ **Triggers e constraints funcionando** perfeitamente
6. ✅ **Views prontas** para consultas complexas

---

## 📝 Checklist de Integração

### SQL ✅
- [x] ENUMs renomeados
- [x] Tabelas renomeadas
- [x] Campos em camelCase
- [x] Functions atualizadas
- [x] Triggers atualizados
- [x] Views adaptadas
- [x] Dados seed inseridos

### Backend (Próximos Passos)
- [ ] Conectar ao PostgreSQL
- [ ] Atualizar queries em `products.js`
- [ ] Atualizar queries em `orders.js`
- [ ] Adicionar campo `category` nas validações
- [ ] Implementar lógica de `order_items`
- [ ] Adicionar `employeeId` (autenticação)

### Frontend (Ajustes Menores)
- [ ] Adicionar campo `category` no ProductModal
- [ ] Garantir envio de `employeeId` nos pedidos
- [ ] Considerar adicionar campo `notes` (observações)

---

**Data:** 20 de Novembro de 2025  
**Status:** ✅ SQL 100% Compatível com Frontend
