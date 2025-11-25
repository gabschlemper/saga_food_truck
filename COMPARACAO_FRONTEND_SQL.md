# 🔍 Comparação Frontend vs SQL - SAGA Food Truck

## ⚠️ PROBLEMAS ENCONTRADOS

### 1. **PRODUTOS - Incompatibilidade de Nomenclatura**

#### Frontend envia/espera:
```javascript
{
  name: string,           // ❌ DIFERENTE
  description: string,
  price: number,
  stock: number,          // ❌ DIFERENTE
  minimumStock: number,   // ❌ DIFERENTE
  status: string,
  createdAt: string,      // ❌ DIFERENTE (camelCase)
  updatedAt: string       // ❌ DIFERENTE (camelCase)
}
```

#### SQL espera (tabela `produtos`):
```sql
{
  nome: VARCHAR(255),           -- ✅ PORTUGUÊS
  descricao: TEXT,
  preco: DECIMAL(10, 2),
  estoque: INTEGER,             -- ✅ PORTUGUÊS
  estoque_minimo: INTEGER,      -- ✅ PORTUGUÊS (snake_case)
  status: tipo_status_produto,
  categoria: tipo_categoria_produto,  -- ⚠️ FALTA NO FRONTEND
  ativo: BOOLEAN,                     -- ⚠️ FALTA NO FRONTEND
  criado_em: TIMESTAMP,         -- ✅ PORTUGUÊS (snake_case)
  atualizado_em: TIMESTAMP      -- ✅ PORTUGUÊS (snake_case)
}
```

**🚨 PROBLEMAS:**
- ❌ Campos em inglês no frontend vs português no SQL
- ❌ `name` → deve ser `nome`
- ❌ `stock` → deve ser `estoque`
- ❌ `minimumStock` → deve ser `estoque_minimo`
- ❌ `createdAt` → deve ser `criado_em`
- ❌ `updatedAt` → deve ser `atualizado_em`
- ⚠️ Frontend não envia `categoria` (obrigatório no SQL)
- ⚠️ Frontend não envia `ativo` (padrão TRUE no SQL)

---

### 2. **PEDIDOS - Incompatibilidade Crítica de Estrutura**

#### Frontend envia/espera:
```javascript
{
  id: number,
  customer: string,           // ❌ DIFERENTE + INCOMPLETO
  items: [                    // ❌ ESTRUTURA DIFERENTE
    {
      productId: number,
      name: string,
      quantity: number,
      price: number
    }
  ],
  total: number,              // ❌ DIFERENTE
  paymentMethod: string,      // ❌ DIFERENTE (camelCase)
  paymentStatus: string,      // ❌ DIFERENTE (camelCase)
  status: string,
  createdAt: string,          // ❌ DIFERENTE (camelCase)
  updatedAt: string           // ❌ DIFERENTE (camelCase)
}
```

#### SQL espera (tabela `pedidos`):
```sql
-- Tabela PEDIDOS:
{
  id: SERIAL,
  id_funcionario: INTEGER NOT NULL,    -- ⚠️ FALTA COMPLETAMENTE NO FRONTEND
  id_cliente: INTEGER,                 -- ⚠️ FALTA NO FRONTEND
  nome_cliente: VARCHAR(255),          -- ✅ PORTUGUÊS
  valor_total: DECIMAL(10, 2),         -- ✅ PORTUGUÊS
  forma_pagamento: tipo_forma_pagamento,    -- ✅ PORTUGUÊS (snake_case)
  status_pagamento: tipo_status_pagamento,  -- ✅ PORTUGUÊS (snake_case)
  status: tipo_status_pedido,
  observacoes: TEXT,                   -- ⚠️ FALTA NO FRONTEND
  criado_em: TIMESTAMP,                -- ✅ PORTUGUÊS (snake_case)
  atualizado_em: TIMESTAMP             -- ✅ PORTUGUÊS (snake_case)
}

-- Tabela ITENS_PEDIDO (relacionamento separado):
{
  id: SERIAL,
  id_pedido: INTEGER NOT NULL,         -- ⚠️ Relacionamento não mapeado
  id_produto: INTEGER NOT NULL,
  nome_produto: VARCHAR(255),
  quantidade: INTEGER,
  preco_unitario: DECIMAL(10, 2),
  subtotal: DECIMAL(10, 2),            -- ⚠️ Calculado automaticamente
  criado_em: TIMESTAMP
}
```

**🚨 PROBLEMAS CRÍTICOS:**
- ❌ **`id_funcionario` é OBRIGATÓRIO no SQL mas NÃO existe no frontend!**
- ❌ `customer` → deve ser `nome_cliente`
- ❌ `items` está na requisição mas deve ser salvo em tabela separada `itens_pedido`
- ❌ `total` → deve ser `valor_total`
- ❌ `paymentMethod` → deve ser `forma_pagamento`
- ❌ `paymentStatus` → deve ser `status_pagamento`
- ❌ `createdAt` → deve ser `criado_em`
- ❌ `updatedAt` → deve ser `atualizado_em`
- ⚠️ Frontend não tem campo `id_cliente` (opcional no SQL)
- ⚠️ Frontend não tem campo `observacoes` (opcional no SQL)
- ⚠️ Estrutura de `items` precisa ser desmembrada em INSERT separado na tabela `itens_pedido`

---

### 3. **STATUS - Compatibilidade ✅**

#### Status do Pedido:
```javascript
// Frontend usa:
'Aguardando Pagamento'
'Preparando'
'Pronto'
'Entregue'
'Cancelado'

// SQL tem:
CREATE TYPE tipo_status_pedido AS ENUM (
    'Aguardando Pagamento',  -- ✅
    'Preparando',            -- ✅
    'Pronto',                -- ✅
    'Entregue',              -- ✅
    'Cancelado'              -- ✅
);
```
**✅ STATUS DO PEDIDO ESTÁ CORRETO!**

#### Status de Pagamento:
```javascript
// Frontend usa:
'Pendente'
'Pago'
'Cancelado'

// SQL tem:
CREATE TYPE tipo_status_pagamento AS ENUM (
    'Pendente',   -- ✅
    'Pago',       -- ✅
    'Cancelado'   -- ✅
);
```
**✅ STATUS DE PAGAMENTO ESTÁ CORRETO!**

#### Forma de Pagamento:
```javascript
// Frontend usa:
'Pix'
'Cartão Crédito'
'Cartão Débito'
'Dinheiro'

// SQL tem:
CREATE TYPE tipo_forma_pagamento AS ENUM (
    'Pix',              -- ✅
    'Cartão Crédito',   -- ✅
    'Cartão Débito',    -- ✅
    'Dinheiro'          -- ✅
);
```
**✅ FORMA DE PAGAMENTO ESTÁ CORRETA!**

#### Status do Produto:
```javascript
// Frontend usa:
'Disponível'
'Estoque Baixo'
'Sem Estoque'
'Em Estoque'

// SQL tem:
CREATE TYPE tipo_status_produto AS ENUM (
    'Disponível',      -- ✅
    'Estoque Baixo',   -- ✅
    'Sem Estoque',     -- ✅
    'Em Estoque'       -- ✅
);
```
**✅ STATUS DO PRODUTO ESTÁ CORRETO!**

---

## 📋 CHECKLIST DE CORREÇÕES NECESSÁRIAS

### Backend (`back/routes/products.js`):
- [ ] Mudar `name` → `nome`
- [ ] Mudar `description` → `descricao`
- [ ] Mudar `price` → `preco`
- [ ] Mudar `stock` → `estoque`
- [ ] Mudar `minimumStock` → `estoque_minimo`
- [ ] Mudar `createdAt` → `criado_em`
- [ ] Mudar `updatedAt` → `atualizado_em`
- [ ] Adicionar campo `categoria` (obrigatório)
- [ ] Adicionar campo `ativo` (padrão TRUE)
- [ ] Integrar com banco PostgreSQL real (remover mock)

### Backend (`back/routes/orders.js`):
- [ ] **URGENTE: Adicionar `id_funcionario` (obrigatório)**
- [ ] Mudar `customer` → `nome_cliente`
- [ ] Adicionar `id_cliente` (opcional)
- [ ] Mudar `total` → `valor_total`
- [ ] Mudar `paymentMethod` → `forma_pagamento`
- [ ] Mudar `paymentStatus` → `status_pagamento`
- [ ] Mudar `createdAt` → `criado_em`
- [ ] Mudar `updatedAt` → `atualizado_em`
- [ ] Adicionar campo `observacoes` (opcional)
- [ ] Implementar INSERT em `itens_pedido` separadamente
- [ ] Implementar JOIN para retornar pedidos com itens
- [ ] Integrar com banco PostgreSQL real (remover mock)

### Frontend (`front/src/components/ProductModal/index.jsx`):
- [ ] Adicionar campo `categoria` (dropdown com opções)
  - Opções: 'Lanches', 'Acompanhamentos', 'Bebidas', 'Outros'
- [ ] Considerar adicionar campo `ativo` (checkbox)

### Frontend (`front/src/pages/Orders/index.jsx`):
- [ ] Adicionar campo `id_funcionario` ao criar pedido
- [ ] Considerar adicionar campo `observacoes`
- [ ] Considerar adicionar campo `id_cliente` (opcional)

### Frontend Slices (Redux):
- [ ] Ajustar mapeamento de campos em `productsSlice.js`
- [ ] Ajustar mapeamento de campos em `ordersSlice.js`
- [ ] Garantir compatibilidade com nomes em português

---

## 🎯 PRIORIDADE DE CORREÇÕES

### 🔴 CRÍTICO (Impede funcionamento):
1. **Backend Orders**: Adicionar `id_funcionario` obrigatório
2. **Backend Orders**: Implementar insert em `itens_pedido`
3. **Backend**: Integrar com PostgreSQL (remover dados mock)
4. **Backend Products**: Adicionar campo `categoria`

### 🟡 IMPORTANTE (Inconsistências):
1. **Backend**: Converter todos os campos para português (snake_case)
2. **Frontend**: Adicionar campo categoria no modal de produtos
3. **Backend Orders**: Implementar relacionamento com `itens_pedido`

### 🟢 DESEJÁVEL (Melhorias):
1. Frontend: Adicionar campo `observacoes` nos pedidos
2. Frontend: Adicionar seleção de cliente (tabela `clientes`)
3. Frontend: Adicionar campo `ativo` em produtos
4. Backend: Implementar autenticação para capturar `id_funcionario`

---

## 💡 RECOMENDAÇÕES

### Opção 1: Adaptar Backend para o Frontend (Mais Rápido)
Manter nomes em inglês no backend e criar uma camada de tradução no SQL ou ORM.

**Prós:** Menos alterações no frontend
**Contras:** Inconsistência com padrão SQL brasileiro

### Opção 2: Adaptar Frontend para o SQL (Mais Correto) ⭐ RECOMENDADO
Alterar frontend e backend para usar nomenclatura em português.

**Prós:** 
- Consistência total
- Padrão brasileiro
- Código mais profissional para o mercado BR

**Contras:** Mais trabalho inicial

### Opção 3: Criar Camada de Transformação
Criar um middleware/adapter que converte entre os formatos.

**Prós:** Separa responsabilidades
**Contras:** Mais código para manter

---

## 🚀 PRÓXIMOS PASSOS SUGERIDOS

1. **Corrigir Backend Urgente:**
   - Adicionar `id_funcionario` obrigatório
   - Adicionar campo `categoria` em produtos
   - Implementar lógica de `itens_pedido`

2. **Conectar ao PostgreSQL:**
   - Substituir mock por queries reais
   - Testar triggers e constraints

3. **Atualizar Frontend:**
   - Adicionar campo categoria
   - Adicionar id_funcionario (pode vir da autenticação)

4. **Testar Integração:**
   - Criar produtos via frontend
   - Criar pedidos via frontend
   - Validar dados no PostgreSQL

---

**Última atualização:** 20 de Novembro de 2025
